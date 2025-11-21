import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty IDs array' },
        { status: 400 }
      );
    }

    // Get article titles before deleting (to find related raw_articles)
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const articles = await sql.query(
      `SELECT title, slug FROM articles WHERE id IN (${placeholders})`,
      ids
    );

    // Delete all articles with the given IDs
    // Using parameterized query to prevent SQL injection
    await sql.query(
      `DELETE FROM articles WHERE id IN (${placeholders})`,
      ids
    );

    // Delete related raw_articles to allow re-fetching
    // This allows admin to re-fetch and re-process these articles from RSS
    if (articles.length > 0) {
      try {
        for (const article of articles) {
          await sql`
            DELETE FROM raw_articles 
            WHERE title ILIKE ${`%${article.title}%`}
            OR title ILIKE ${`%${article.slug}%`}
          `;
        }
        console.log(`Deleted raw_articles for ${articles.length} articles`);
      } catch (rawDeleteError) {
        // Log but don't fail the main delete operation
        console.warn('Could not delete some raw_articles:', rawDeleteError);
      }
    }

    // Revalidate paths
    revalidatePath('/dashboard');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: `Đã xóa ${ids.length} bài viết`,
      deleted: ids.length,
    });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
