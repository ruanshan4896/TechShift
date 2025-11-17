import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const articles = await sql`
      SELECT id, title, slug, published_at, view_count, category_id, created_at
      FROM articles
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, summary, cover_image_url, category_id } = body;

    const result = await sql`
      INSERT INTO articles (title, slug, content, summary, cover_image_url, category_id, published_at)
      VALUES (${title}, ${slug}, ${content}, ${summary}, ${cover_image_url}, ${category_id || null}, NOW())
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
