import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);
    
    // Get article
    const articles = await sql`
      SELECT * FROM articles WHERE id = ${articleId} LIMIT 1
    `;

    if (articles.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Get tags for this article
    const tags = await sql`
      SELECT t.id, t.name, t.slug
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = ${articleId}
      ORDER BY t.name
    `;

    return NextResponse.json({ 
      article: articles[0],
      tags: tags 
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);
    
    // Get article info before deleting (to find related raw_articles)
    const articles = await sql`
      SELECT slug, title FROM articles WHERE id = ${articleId} LIMIT 1
    `;
    
    if (articles.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    const article = articles[0];
    
    // Delete the article (CASCADE will delete article_tags automatically)
    await sql`DELETE FROM articles WHERE id = ${articleId}`;
    
    // Delete related raw_articles to allow re-fetching
    // Strategy: Delete by fuzzy title matching since we don't have direct foreign key
    // This allows admin to re-fetch and re-process the article from RSS
    try {
      // Extract key words from title for better matching
      const titleWords = article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Remove special chars
        .split(/\s+/)
        .filter((word: string) => word.length > 3) // Only words > 3 chars
        .slice(0, 5); // Take first 5 significant words
      
      if (titleWords.length > 0) {
        // Build ILIKE conditions for each word
        const conditions = titleWords.map((word: string) => `title ILIKE '%${word}%'`).join(' AND ');
        
        // Delete raw_articles that match most of the title words
        const result = await sql.query(
          `DELETE FROM raw_articles WHERE ${conditions} RETURNING id, title, original_url`
        );
        
        if (result.length > 0) {
          console.log(`Deleted ${result.length} raw_articles for: ${article.title}`);
          result.forEach((row: any) => {
            console.log(`  - ${row.title} (${row.original_url})`);
          });
        } else {
          console.log(`No matching raw_articles found for: ${article.title}`);
        }
      }
    } catch (rawDeleteError) {
      // Log but don't fail the main delete operation
      console.warn('Could not delete raw_articles:', rawDeleteError);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);
    const body = await request.json();
    const { title, slug, content, summary, cover_image_url, category_id, tags } = body;

    // Update article
    await sql`
      UPDATE articles
      SET 
        title = ${title},
        slug = ${slug},
        content = ${content},
        summary = ${summary},
        cover_image_url = ${cover_image_url},
        category_id = ${category_id || null}
      WHERE id = ${articleId}
    `;

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Delete existing tags
      await sql`DELETE FROM article_tags WHERE article_id = ${articleId}`;

      // Insert new tags
      for (const tagName of tags) {
        if (tagName && tagName.trim()) {
          // Generate slug for tag
          const tagSlug = tagName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

          // Find or create tag
          const existingTag = await sql`
            SELECT id FROM tags WHERE slug = ${tagSlug} LIMIT 1
          `;

          let tagId;
          if (existingTag.length > 0) {
            tagId = existingTag[0].id;
          } else {
            const newTag = await sql`
              INSERT INTO tags (name, slug)
              VALUES (${tagName.trim()}, ${tagSlug})
              RETURNING id
            `;
            tagId = newTag[0].id;
          }

          // Link tag to article
          await sql`
            INSERT INTO article_tags (article_id, tag_id)
            VALUES (${articleId}, ${tagId})
            ON CONFLICT DO NOTHING
          `;
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
