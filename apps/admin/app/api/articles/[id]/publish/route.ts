import { NextResponse } from 'next/server';
import { updateArticleStatus } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    await updateArticleStatus(articleId, 'PUBLISHED');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error publishing article:', error);
    return NextResponse.json(
      { error: 'Failed to publish article' },
      { status: 500 }
    );
  }
}
