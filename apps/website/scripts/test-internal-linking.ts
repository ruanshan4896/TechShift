import { neon } from '@neondatabase/serverless';
import { extractKeywords } from '../lib/gemini';
import { buildInternalLinks, countInternalLinks } from '../lib/internal-linking';

const sql = neon(process.env.DATABASE_URL!);

async function testInternalLinking() {
  try {
    console.log('Testing Internal Linking System...\n');

    // Get latest article
    const articles = await sql`
      SELECT * FROM articles 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    if (articles.length === 0) {
      console.log('No articles found!');
      return;
    }

    const article = articles[0];
    console.log('Article:', article.title);
    console.log('Slug:', article.slug);
    console.log('\n--- Step 1: Extract Keywords ---');

    const keywords = await extractKeywords(article.content, article.title);
    console.log('Keywords extracted:', keywords.length);
    keywords.forEach((kw, i) => {
      console.log(`  ${i + 1}. ${kw}`);
    });

    console.log('\n--- Step 2: Build Internal Links ---');
    const contentWithLinks = await buildInternalLinks(
      article.content,
      keywords,
      article.slug,
      4
    );

    const linkCount = countInternalLinks(contentWithLinks);
    console.log(`Internal links added: ${linkCount}`);

    if (linkCount > 0) {
      console.log('\n--- Step 3: Preview Links ---');
      const linkMatches = contentWithLinks.match(/<a[^>]*class="internal-link"[^>]*>.*?<\/a>/g);
      if (linkMatches) {
        linkMatches.forEach((link, i) => {
          console.log(`  ${i + 1}. ${link}`);
        });
      }
    }

    console.log('\n✓ Test completed!');
  } catch (error) {
    console.error('Error:', error);
  }
}

testInternalLinking();
