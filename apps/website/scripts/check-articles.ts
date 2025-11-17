import { neon } from '@neondatabase/serverless';

const sqlClient = neon(process.env.DATABASE_URL!);

async function checkArticles() {
  try {
    console.log('Checking raw_articles...');
    const rawArticles = await sqlClient`
      SELECT id, title, status, created_at 
      FROM raw_articles 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    console.log('\nRaw Articles:');
    console.table(rawArticles);

    console.log('\nChecking articles...');
    const articles = await sqlClient`
      SELECT id, title, slug, created_at 
      FROM articles 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    console.log('\nPublished Articles:');
    console.table(articles);

    console.log('\nStatus summary:');
    const summary = await sqlClient`
      SELECT status, COUNT(*) as count 
      FROM raw_articles 
      GROUP BY status
    `;
    console.table(summary);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkArticles();
