import { NextResponse } from 'next/server';
import {
  getPendingRawArticles,
  updateRawArticleStatus,
  insertArticleFromRaw,
  checkSlugExists,
  updateArticleContent,
} from '@/lib/db';
import { processArticleWithGemini, generateSlug, getDefaultCoverImage, extractKeywords } from '@/lib/gemini';
import { buildInternalLinks, countInternalLinks } from '@/lib/internal-linking';

export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
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

        // Process with Gemini
        const processed = await processArticleWithGemini(
          rawArticle.title,
          rawArticle.original_content,
          rawArticle.original_url
        );

        // Choose best title (first suggestion)
        const finalTitle = processed.suggestedTitles[0];
        let slug = generateSlug(finalTitle);

        // Ensure unique slug
        let slugCounter = 1;
        while (await checkSlugExists(slug)) {
          slug = `${generateSlug(finalTitle)}-${slugCounter}`;
          slugCounter++;
        }

        // Get cover image
        const coverImage = getDefaultCoverImage(finalTitle);

        // Insert into articles table (without internal links first)
        await insertArticleFromRaw({
          title: finalTitle,
          slug,
          content: processed.content,
          summary: processed.summary,
          cover_image_url: coverImage,
          published_at: rawArticle.publication_date,
        });

        console.log(`✓ Article inserted: ${finalTitle}`);

        // Extract keywords for internal linking
        console.log('  Extracting keywords...');
        const keywords = await extractKeywords(processed.content, finalTitle);
        console.log(`  Keywords: ${keywords.join(', ')}`);

        // Build internal links
        console.log('  Building internal links...');
        const contentWithLinks = await buildInternalLinks(
          processed.content,
          keywords,
          slug,
          4 // Max 4 internal links
        );

        const linkCount = countInternalLinks(contentWithLinks);
        console.log(`  Added ${linkCount} internal links`);

        // Update article with internal links
        if (linkCount > 0) {
          await updateArticleContent(slug, contentWithLinks);
        }

        // Update raw article status
        await updateRawArticleStatus(rawArticle.id, 'processed');

        results.push({
          id: rawArticle.id,
          originalTitle: rawArticle.title,
          newTitle: finalTitle,
          slug,
          internalLinks: linkCount,
          keywords: keywords.slice(0, 3), // Show first 3 keywords
          status: 'success',
        });

        console.log(`✓ Processed: ${finalTitle} (${linkCount} links)`);
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
