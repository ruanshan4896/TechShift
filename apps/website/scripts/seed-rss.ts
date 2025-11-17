import { createRssTables, insertRssSource } from '../lib/db';

const sampleRssSources = [
  {
    name: 'VnExpress Công nghệ',
    rss_url: 'https://vnexpress.net/rss/so-hoa.rss',
    is_active: true,
  },
  {
    name: 'Genk - Công nghệ',
    rss_url: 'https://genk.vn/cntt.rss',
    is_active: true,
  },
  {
    name: 'TechCrunch',
    rss_url: 'https://techcrunch.com/feed/',
    is_active: true,
  },
];

async function seedRss() {
  try {
    console.log('Creating RSS tables...');
    await createRssTables();
    console.log('✓ Tables created');

    console.log('Inserting sample RSS sources...');
    for (const source of sampleRssSources) {
      await insertRssSource(source);
      console.log(`✓ Inserted: ${source.name}`);
    }

    console.log('✓ RSS seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding RSS:', error);
    throw error;
  }
}

seedRss();
