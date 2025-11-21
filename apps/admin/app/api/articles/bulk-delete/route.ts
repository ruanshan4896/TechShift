import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty IDs array' },
        { status: 400 }
      );
    }

    // Get article titles before deleting (to find related raw_articles)
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const articles = await sql.query(
      `SELECT title, slug FROM articles WHERE id IN (${placeholders})`,
      ids
    );

    // Delete all articles with the given IDs
    // Using parameterized query to prevent SQL injection
    await sql.query(
      `DELETE FROM articles WHERE id IN (${placeholders})`,
      ids
    );

    // Delete related raw_articles to allow re-fetching
    // Strategy: Delete by fuzzy title matching since we don't have direct foreign key
    // This allows admin to re-fetch and re-process these articles from RSS
    if (articles.length > 0) {
      try {
        let totalDeleted = 0;
        
        for (const article of articles) {
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
              `DELETE FROM raw_articles WHERE ${conditions} RETURNING id`
            );
            
            totalDeleted += result.length;
          }
        }
        
        console.log(`Deleted ${totalDeleted} raw_articles for ${articles.length} articles`);
      } catch (rawDeleteError) {
        // Log but don't fail the main delete operation
        console.warn('Could not delete some raw_articles:', rawDeleteError);
      }
    }

    // Revalidate paths
    revalidatePath('/dashboard');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: `Đã xóa ${ids.length} bài viết`,
      deleted: ids.length,
    });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
