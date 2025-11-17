import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  cover_image_url: string;
  published_at: Date;
  created_at: Date;
  category_id?: number;
  view_count: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
}

export interface ArticleWithCategory extends Article {
  category_name?: string;
  category_slug?: string;
}

export interface ArticleWithTags extends Article {
  tags?: Tag[];
}

export async function createArticlesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      summary TEXT NOT NULL,
      cover_image_url TEXT NOT NULL,
      published_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      category_id INTEGER,
      view_count INTEGER DEFAULT 0
    )
  `;
}

export async function createCategoriesAndTagsTables() {
  // Categories table
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Tags table
  await sql`
    CREATE TABLE IF NOT EXISTS tags (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Article-Tag junction table
  await sql`
    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
      tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (article_id, tag_id)
    )
  `;

  // Add category_id and view_count columns if not exist
  await sql`
    DO $$ 
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'category_id'
      ) THEN
        ALTER TABLE articles ADD COLUMN category_id INTEGER;
      END IF;
      
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'view_count'
      ) THEN
        ALTER TABLE articles ADD COLUMN view_count INTEGER DEFAULT 0;
      END IF;
    END $$;
  `;

  // Add foreign key for category if not exists
  await sql`
    DO $$ 
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'articles_category_id_fkey'
      ) THEN
        ALTER TABLE articles 
        ADD CONSTRAINT articles_category_id_fkey 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
      END IF;
    END $$;
  `;
}

export async function getLatestArticles(limit: number = 10): Promise<Article[]> {
  const rows = await sql`
    SELECT * FROM articles 
    ORDER BY published_at DESC 
    LIMIT ${limit}
  `;
  return rows as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const rows = await sql`
    SELECT * FROM articles 
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return (rows[0] as Article) || null;
}

export async function insertArticle(article: Omit<Article, 'id' | 'created_at'>) {
  const publishedAt = article.published_at.toISOString();
  await sql`
    INSERT INTO articles (title, slug, content, summary, cover_image_url, published_at)
    VALUES (${article.title}, ${article.slug}, ${article.content}, ${article.summary}, ${article.cover_image_url}, ${publishedAt})
  `;
}

// RSS Source Management
export interface RssSource {
  id: number;
  name: string;
  rss_url: string;
  is_active: boolean;
  created_at: Date;
}

export interface RawArticle {
  id: number;
  source_id: number;
  title: string;
  original_url: string;
  original_content: string;
  publication_date: Date;
  status: 'pending' | 'processed' | 'failed';
  created_at: Date;
}

export async function createRssTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS rss_sources (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      rss_url TEXT UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS raw_articles (
      id SERIAL PRIMARY KEY,
      source_id INTEGER REFERENCES rss_sources(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      original_url TEXT UNIQUE NOT NULL,
      original_content TEXT NOT NULL,
      publication_date TIMESTAMP NOT NULL,
      status TEXT CHECK (status IN ('pending', 'processed', 'failed')) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_raw_articles_status ON raw_articles(status)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_raw_articles_source ON raw_articles(source_id)
  `;
}

export async function getActiveRssSources(): Promise<RssSource[]> {
  const rows = await sql`
    SELECT * FROM rss_sources 
    WHERE is_active = true
    ORDER BY name
  `;
  return rows as RssSource[];
}

export async function getAllRssSources(): Promise<RssSource[]> {
  const rows = await sql`
    SELECT * FROM rss_sources 
    ORDER BY name
  `;
  return rows as RssSource[];
}

export async function insertRssSource(source: Omit<RssSource, 'id' | 'created_at'>) {
  await sql`
    INSERT INTO rss_sources (name, rss_url, is_active)
    VALUES (${source.name}, ${source.rss_url}, ${source.is_active})
  `;
}

export async function updateRssSource(id: number, source: Partial<Omit<RssSource, 'id' | 'created_at'>>) {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (source.name !== undefined) {
    updates.push(`name = $${updates.length + 1}`);
    values.push(source.name);
  }
  if (source.rss_url !== undefined) {
    updates.push(`rss_url = $${updates.length + 1}`);
    values.push(source.rss_url);
  }
  if (source.is_active !== undefined) {
    updates.push(`is_active = $${updates.length + 1}`);
    values.push(source.is_active);
  }

  if (updates.length > 0) {
    await sql.query(`UPDATE rss_sources SET ${updates.join(', ')} WHERE id = $${updates.length + 1}`, [...values, id]);
  }
}

export async function deleteRssSource(id: number) {
  await sql`DELETE FROM rss_sources WHERE id = ${id}`;
}

export async function checkArticleExists(originalUrl: string): Promise<boolean> {
  const rows = await sql`
    SELECT id FROM raw_articles WHERE original_url = ${originalUrl} LIMIT 1
  `;
  return rows.length > 0;
}

export async function insertRawArticle(article: Omit<RawArticle, 'id' | 'created_at'>) {
  const publicationDate = article.publication_date.toISOString();
  await sql`
    INSERT INTO raw_articles (source_id, title, original_url, original_content, publication_date, status)
    VALUES (${article.source_id}, ${article.title}, ${article.original_url}, ${article.original_content}, ${publicationDate}, ${article.status})
  `;
}

export async function getPendingRawArticles(limit: number = 10): Promise<RawArticle[]> {
  const rows = await sql`
    SELECT * FROM raw_articles 
    WHERE status = 'pending'
    ORDER BY publication_date DESC
    LIMIT ${limit}
  `;
  return rows as RawArticle[];
}

export async function updateRawArticleStatus(id: number, status: 'pending' | 'processed' | 'failed', error?: string) {
  if (error) {
    await sql`
      UPDATE raw_articles 
      SET status = ${status}
      WHERE id = ${id}
    `;
  } else {
    await sql`
      UPDATE raw_articles 
      SET status = ${status}
      WHERE id = ${id}
    `;
  }
}

export async function checkSlugExists(slug: string): Promise<boolean> {
  const rows = await sql`
    SELECT id FROM articles WHERE slug = ${slug} LIMIT 1
  `;
  return rows.length > 0;
}

export async function insertArticleFromRaw(article: {
  title: string;
  slug: string;
  content: string;
  summary: string;
  cover_image_url: string;
  published_at: Date;
}): Promise<void> {
  const publishedAt = article.published_at.toISOString();
  await sql`
    INSERT INTO articles (title, slug, content, summary, cover_image_url, published_at)
    VALUES (${article.title}, ${article.slug}, ${article.content}, ${article.summary}, ${article.cover_image_url}, ${publishedAt})
  `;
}

export async function findRelatedArticles(keyword: string, excludeSlug: string, limit: number = 2): Promise<Article[]> {
  const rows = await sql`
    SELECT * FROM articles 
    WHERE slug != ${excludeSlug}
    AND (
      title ILIKE ${`%${keyword}%`}
      OR content ILIKE ${`%${keyword}%`}
    )
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows as Article[];
}

export async function updateArticleContent(slug: string, content: string): Promise<void> {
  await sql`
    UPDATE articles 
    SET content = ${content}
    WHERE slug = ${slug}
  `;
}

// Categories
export async function getAllCategories(): Promise<Category[]> {
  const rows = await sql`SELECT * FROM categories ORDER BY name`;
  return rows as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const rows = await sql`SELECT * FROM categories WHERE slug = ${slug} LIMIT 1`;
  return (rows[0] as Category) || null;
}

export async function insertCategory(name: string, slug: string): Promise<void> {
  await sql`INSERT INTO categories (name, slug) VALUES (${name}, ${slug})`;
}

// Tags
export async function getAllTags(): Promise<Tag[]> {
  const rows = await sql`SELECT * FROM tags ORDER BY name`;
  return rows as Tag[];
}

export async function getPopularTags(limit: number = 10): Promise<Tag[]> {
  const rows = await sql`
    SELECT t.*, COUNT(at.article_id) as article_count
    FROM tags t
    LEFT JOIN article_tags at ON t.id = at.tag_id
    GROUP BY t.id
    ORDER BY article_count DESC, t.name
    LIMIT ${limit}
  `;
  return rows as Tag[];
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const rows = await sql`SELECT * FROM tags WHERE slug = ${slug} LIMIT 1`;
  return (rows[0] as Tag) || null;
}

export async function findOrCreateTag(name: string, slug: string): Promise<number> {
  const existing = await sql`SELECT id FROM tags WHERE slug = ${slug} LIMIT 1`;
  if (existing.length > 0) {
    return existing[0].id as number;
  }
  const result = await sql`INSERT INTO tags (name, slug) VALUES (${name}, ${slug}) RETURNING id`;
  return result[0].id as number;
}

export async function getArticlesByCategory(categorySlug: string, limit: number = 20): Promise<ArticleWithCategory[]> {
  const rows = await sql`
    SELECT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE c.slug = ${categorySlug}
    ORDER BY a.published_at DESC
    LIMIT ${limit}
  `;
  return rows as ArticleWithCategory[];
}

export async function getArticlesByTag(tagSlug: string, limit: number = 20): Promise<Article[]> {
  const rows = await sql`
    SELECT a.*
    FROM articles a
    INNER JOIN article_tags at ON a.id = at.article_id
    INNER JOIN tags t ON at.tag_id = t.id
    WHERE t.slug = ${tagSlug}
    ORDER BY a.published_at DESC
    LIMIT ${limit}
  `;
  return rows as Article[];
}

export async function getArticleTags(articleId: number): Promise<Tag[]> {
  const rows = await sql`
    SELECT t.*
    FROM tags t
    INNER JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ${articleId}
    ORDER BY t.name
  `;
  return rows as Tag[];
}

export async function linkArticleToTags(articleId: number, tagIds: number[]): Promise<void> {
  for (const tagId of tagIds) {
    await sql`
      INSERT INTO article_tags (article_id, tag_id)
      VALUES (${articleId}, ${tagId})
      ON CONFLICT DO NOTHING
    `;
  }
}

export async function searchArticles(query: string, limit: number = 20): Promise<Article[]> {
  const searchTerm = `%${query}%`;
  const rows = await sql`
    SELECT * FROM articles
    WHERE title ILIKE ${searchTerm} OR content ILIKE ${searchTerm}
    ORDER BY published_at DESC
    LIMIT ${limit}
  `;
  return rows as Article[];
}

export async function incrementViewCount(slug: string): Promise<void> {
  await sql`
    UPDATE articles 
    SET view_count = view_count + 1
    WHERE slug = ${slug}
  `;
}

export async function getFeaturedArticles(limit: number = 5): Promise<Article[]> {
  const rows = await sql`
    SELECT * FROM articles
    ORDER BY view_count DESC, published_at DESC
    LIMIT ${limit}
  `;
  return rows as Article[];
}
