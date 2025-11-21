import { NextResponse } from 'next/server';
import {
  getPendingRawArticles,
  updateRawArticleStatus,
  insertArticleFromRaw,
  checkSlugExists,
  updateArticleContent,
} from '@/lib/db';
import { processArticleWithAI, generateSlug, getDefaultCoverImage } from '@/lib/ai-processor';
import { insertInternalLinks } from '@/lib/internal-linking';

export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Gemini API keys are configured
    if (!process.env.GEMINI_API_KEYS && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const pendingArticles = await getPendingRawArticles(5);
    const results = [];

    for (const rawArticle of pendingArticles) {
      try {
        console.log(`Processing article: ${rawArticle.title}`);

        // Process with AI (new implementation)
        const processed = await processArticleWithAI(
          rawArticle.title,
          rawArticle.original_content,
          [] // No related articles for now
        );

        // Use AI-generated title
        const finalTitle = processed.title;
        let slug = processed.slug;

        // Ensure unique slug
        let slugCounter = 1;
        while (await checkSlugExists(slug)) {
          slug = `${processed.slug}-${slugCounter}`;
          slugCounter++;
        }

        // Get cover image
        const coverImage = processed.coverImageUrl || getDefaultCoverImage(finalTitle);

        // Insert into articles table
        await insertArticleFromRaw({
          title: finalTitle,
          slug,
          content: processed.content,
          summary: processed.summary,
          cover_image_url: coverImage,
          published_at: rawArticle.publication_date,
        });

        console.log(`✓ Article inserted: ${finalTitle}`);

        // Update raw article status
        await updateRawArticleStatus(rawArticle.id, 'processed');

        results.push({
          id: rawArticle.id,
          originalTitle: rawArticle.title,
          newTitle: finalTitle,
          slug,
          tags: processed.tags,
          status: 'success',
        });

        console.log(`✓ Processed: ${finalTitle}`);
      } catch (error) {
        console.error(`Error processing article ${rawArticle.id}:`, error);

        // Update status to failed
        await updateRawArticleStatus(
          rawArticle.id,
          'failed',
          error instanceof Error ? error.message : 'Unknown error'
        );

        results.push({
          id: rawArticle.id,
          originalTitle: rawArticle.title,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in process-articles:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
