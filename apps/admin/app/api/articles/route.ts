import { NextResponse } from 'next/server';
import { getArticlesByStatus, getLatestArticles } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let articles;
    if (status === 'DRAFT' || status === 'PUBLISHED') {
      articles = await getArticlesByStatus(status);
    } else {
      articles = await getLatestArticles(100);
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
