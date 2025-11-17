import { neon } from '@neondatabase/serverless';
import { processArticleWithGemini, generateSlug } from '../lib/gemini';

const sql = neon(process.env.DATABASE_URL!);

async function testAI() {
  try {
    console.log('Fetching one pending article...');
    const rows = await sql`
      SELECT * FROM raw_articles 
      WHERE status = 'pending'
      LIMIT 1
    `;

    if (rows.length === 0) {
      console.log('No pending articles found!');
      return;
    }

    const article = rows[0];
    console.log('\nProcessing:', article.title);
    console.log('Original URL:', article.original_url);

    console.log('\nCalling Gemini API...');
    const processed = await processArticleWithGemini(
      article.title,
      article.original_content,
      article.original_url
    );

    console.log('\n✓ Success!');
    console.log('\nSuggested Titles:');
    processed.suggestedTitles.forEach((title, i) => {
      console.log(`  ${i + 1}. ${title}`);
    });

    console.log('\nSummary:');
    console.log(`  ${processed.summary}`);

    console.log('\nContent Preview:');
    console.log(`  ${processed.content.substring(0, 200)}...`);

    console.log('\nSlug:');
    console.log(`  ${generateSlug(processed.suggestedTitles[0])}`);

  } catch (error) {
    console.error('\n✗ Error:', error);
  }
}

testAI();
