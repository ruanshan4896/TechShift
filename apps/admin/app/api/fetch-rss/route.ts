import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { getActiveRssSources, checkArticleExists, insertRawArticle } from '@/lib/db';

const parser = new Parser();

export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sources = await getActiveRssSources();
    let totalFetched = 0;
    let totalNew = 0;
    const results = [];

    for (const source of sources) {
      try {
        const feed = await parser.parseURL(source.rss_url);
        let newArticles = 0;

        for (const item of feed.items) {
          if (!item.link || !item.title) continue;

          const exists = await checkArticleExists(item.link);
          if (!exists) {
            await insertRawArticle({
              source_id: source.id,
              title: item.title,
              original_url: item.link,
              original_content: item.content || item.contentSnippet || '',
              publication_date: item.pubDate ? new Date(item.pubDate) : new Date(),
              status: 'pending',
            });
            newArticles++;
            totalNew++;
          }
          totalFetched++;
        }

        results.push({
          source: source.name,
          fetched: feed.items.length,
          new: newArticles,
        });
      } catch (error) {
        console.error(`Error fetching RSS from ${source.name}:`, error);
        results.push({
          source: source.name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      totalFetched,
      totalNew,
      sources: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in fetch-rss:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
