import { NextResponse } from 'next/server';
import { updateArticleStatus } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty IDs array' },
        { status: 400 }
      );
    }

    // Update all articles to PUBLISHED status
    const results = await Promise.allSettled(
      ids.map(id => updateArticleStatus(id, 'PUBLISHED'))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Revalidate paths
    revalidatePath('/dashboard');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: `Đã xuất bản ${successful} bài viết${failed > 0 ? `, ${failed} thất bại` : ''}`,
      successful,
      failed,
    });
  } catch (error) {
    console.error('Error in bulk publish:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
