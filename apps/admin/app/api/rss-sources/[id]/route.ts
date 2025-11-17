import { NextResponse } from 'next/server';
import { updateRssSource, deleteRssSource } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, rss_url, is_active } = body;

    await updateRssSource(parseInt(id), { name, rss_url, is_active });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating RSS source:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteRssSource(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting RSS source:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
