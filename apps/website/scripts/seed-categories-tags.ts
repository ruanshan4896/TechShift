import { createCategoriesAndTagsTables, insertCategory, findOrCreateTag } from '../lib/db';

const categories = [
  { name: 'AI', slug: 'ai' },
  { name: 'Mobile', slug: 'mobile' },
  { name: 'PC & Hardware', slug: 'pc-hardware' },
  { name: 'Internet', slug: 'internet' },
  { name: 'Đánh giá', slug: 'danh-gia' },
  { name: 'Thủ thuật', slug: 'thu-thuat' },
  { name: 'Khám phá', slug: 'kham-pha' },
];

const tags = [
  'AI', 'Machine Learning', 'ChatGPT', 'OpenAI',
  'iPhone', 'Android', 'Samsung', 'Xiaomi',
  'Laptop', 'PC', 'Gaming', 'CPU', 'GPU',
  'Internet', '5G', 'WiFi', 'Cloud',
  'Review', 'Tips', 'Tutorial', 'News',
];

async function seedCategoriesAndTags() {
  try {
    console.log('Creating categories and tags tables...');
    await createCategoriesAndTagsTables();
    console.log('✓ Tables created');

    console.log('\nInserting categories...');
    for (const cat of categories) {
      try {
        await insertCategory(cat.name, cat.slug);
        console.log(`✓ ${cat.name}`);
      } catch (error: any) {
        if (error.message?.includes('duplicate')) {
          console.log(`  (already exists: ${cat.name})`);
        } else {
          throw error;
        }
      }
    }

    console.log('\nInserting tags...');
    for (const tagName of tags) {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-');
      try {
        await findOrCreateTag(tagName, slug);
        console.log(`✓ ${tagName}`);
      } catch (error: any) {
        console.log(`  (error: ${tagName})`);
      }
    }

    console.log('\n✓ Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding:', error);
    throw error;
  }
}

seedCategoriesAndTags();
