import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import {
  getAllRssSources,
  checkArticleExists,
  insertArticleAsDraft,
  findOrCreateTag,
  linkArticleToTags,
  checkSlugExists,
  getPublishedArticlesForLinking,
} from '@/lib/db';
import { processArticleWithAI, generateSlug } from '@/lib/ai-processor';

const parser = new Parser();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  try {
    const { sourceId } = await params;
    const sourceIdNum = parseInt(sourceId);

    if (isNaN(sourceIdNum)) {
      return NextResponse.json(
        { error: 'Invalid source ID' },
        { status: 400 }
      );
    }

    // Get the RSS source
    const sources = await getAllRssSources();
    const source = sources.find(s => s.id === sourceIdNum);

    if (!source) {
      return NextResponse.json(
        { error: 'RSS source not found' },
        { status: 404 }
      );
    }

    if (!source.is_active) {
      return NextResponse.json(
        { error: 'RSS source is not active' },
        { status: 400 }
      );
    }

    console.log(`Fetching RSS from: ${source.name}`);

    // Fetch RSS feed
    const feed = await parser.parseURL(source.rss_url);
    
    // Get latest 10 articles
    const latestArticles = feed.items.slice(0, 10);
    
    // Detailed processing logs
    type ProcessLog = {
      title: string;
      url: string;
      status: 'SUCCESS' | 'SKIPPED' | 'FAILED';
      message: string;
    };
    
    const logs: ProcessLog[] = [];
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const item of latestArticles) {
      const articleTitle = item.title || 'Unknown';
      const articleUrl = item.link || 'No URL';
      
      if (!item.link || !item.title) {
        logs.push({
          title: articleTitle,
          url: articleUrl,
          status: 'SKIPPED',
          message: 'Missing title or URL',
        });
        skippedCount++;
        continue;
      }

      try {
        // Check if article already exists in raw_articles by original_url
        const exists = await checkArticleExists(item.link);
        if (exists) {
          console.log(`  ⏭️  Skipped duplicate: ${item.link}`);
          logs.push({
            title: articleTitle,
            url: articleUrl,
            status: 'SKIPPED',
            message: 'Duplicate URL found in database',
          });
          skippedCount++;
          continue;
        }

        console.log(`\nProcessing: ${item.title}`);

        const originalContent = item.content || item.contentSnippet || item.summary || '';
        
        if (originalContent.length < 100) {
          console.log('  Content too short, skipping');
          logs.push({
            title: articleTitle,
            url: articleUrl,
            status: 'SKIPPED',
            message: `Content too short (${originalContent.length} chars, minimum 100)`,
          });
          skippedCount++;
          continue;
        }

        // Process with AI
        const processed = await processArticleWithAI(
          item.title,
          originalContent,
          [] // Will add related articles after we have tags
        );

        // Ensure unique slug
        let finalSlug = processed.slug;
        let slugCounter = 1;
        while (await checkSlugExists(finalSlug)) {
          finalSlug = `${processed.slug}-${slugCounter}`;
          slugCounter++;
        }

        // Insert article as draft
        const articleId = await insertArticleAsDraft({
          title: processed.title,
          slug: finalSlug,
          content: processed.content,
          summary: processed.summary,
          cover_image_url: processed.coverImageUrl,
        });

        // Save to raw_articles to prevent duplicate processing
        const { insertRawArticle } = await import('@/lib/db');
        await insertRawArticle({
          source_id: sourceIdNum,
          title: item.title,
          original_url: item.link,
          original_content: originalContent,
          publication_date: item.pubDate ? new Date(item.pubDate) : new Date(),
          status: 'processed',
        });

        // Create and link tags
        const tagIds: number[] = [];
        for (const tagName of processed.tags) {
          if (tagName && tagName.trim()) {
            const tagSlug = generateSlug(tagName);
            const tagId = await findOrCreateTag(tagName.trim(), tagSlug);
            tagIds.push(tagId);
          }
        }

        if (tagIds.length > 0) {
          await linkArticleToTags(articleId, tagIds);
        }

        // Now get related articles for internal linking
        if (processed.tags.length > 0) {
          const relatedArticles = await getPublishedArticlesForLinking(
            articleId,
            processed.tags,
            3
          );

          // If we found related articles, update content with links
          if (relatedArticles.length > 0) {
            const { insertInternalLinks } = await import('@/lib/ai-processor');
            const contentWithLinks = insertInternalLinks(
              processed.content,
              relatedArticles.map(a => ({ title: a.title, slug: a.slug })),
              3
            );

            // Update article content
            const { updateArticleContent } = await import('@/lib/db');
            await updateArticleContent(finalSlug, contentWithLinks);
          }
        }

        processedCount++;
        logs.push({
          title: processed.title,
          url: articleUrl,
          status: 'SUCCESS',
          message: `Created successfully as draft with slug: ${finalSlug}`,
        });

        console.log(`  ✓ Saved as draft: ${processed.title}`);

      } catch (error) {
        console.error(`  ✗ Error processing article:`, error);
        errorCount++;
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logs.push({
          title: articleTitle,
          url: articleUrl,
          status: 'FAILED',
          message: `Processing failed: ${errorMessage}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      source: source.name,
      summary: {
        total: latestArticles.length,
        success: processedCount,
        skipped: skippedCount,
        failed: errorCount,
      },
      logs,
      message: `Processed ${latestArticles.length} articles: ${processedCount} success, ${skippedCount} skipped, ${errorCount} failed.`,
    });

  } catch (error) {
    console.error('Error in process-rss:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
