import { NextResponse } from 'next/server';
import { getAllRssSources, insertRssSource } from '@/lib/db';

export async function GET() {
  try {
    const sources = await getAllRssSources();
    return NextResponse.json({ sources });
  } catch (error) {
    console.error('Error fetching RSS sources:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rss_url, is_active } = body;

    if (!name || !rss_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await insertRssSource({ name, rss_url, is_active: is_active ?? true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating RSS source:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
