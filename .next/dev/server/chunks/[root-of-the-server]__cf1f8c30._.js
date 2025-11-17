module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkArticleExists",
    ()=>checkArticleExists,
    "checkSlugExists",
    ()=>checkSlugExists,
    "createArticlesTable",
    ()=>createArticlesTable,
    "createCategoriesAndTagsTables",
    ()=>createCategoriesAndTagsTables,
    "createRssTables",
    ()=>createRssTables,
    "deleteRssSource",
    ()=>deleteRssSource,
    "findOrCreateTag",
    ()=>findOrCreateTag,
    "findRelatedArticles",
    ()=>findRelatedArticles,
    "getActiveRssSources",
    ()=>getActiveRssSources,
    "getAllCategories",
    ()=>getAllCategories,
    "getAllRssSources",
    ()=>getAllRssSources,
    "getAllTags",
    ()=>getAllTags,
    "getArticleBySlug",
    ()=>getArticleBySlug,
    "getArticleTags",
    ()=>getArticleTags,
    "getArticlesByCategory",
    ()=>getArticlesByCategory,
    "getArticlesByTag",
    ()=>getArticlesByTag,
    "getCategoryBySlug",
    ()=>getCategoryBySlug,
    "getFeaturedArticles",
    ()=>getFeaturedArticles,
    "getLatestArticles",
    ()=>getLatestArticles,
    "getPendingRawArticles",
    ()=>getPendingRawArticles,
    "getPopularTags",
    ()=>getPopularTags,
    "getTagBySlug",
    ()=>getTagBySlug,
    "incrementViewCount",
    ()=>incrementViewCount,
    "insertArticle",
    ()=>insertArticle,
    "insertArticleFromRaw",
    ()=>insertArticleFromRaw,
    "insertCategory",
    ()=>insertCategory,
    "insertRawArticle",
    ()=>insertRawArticle,
    "insertRssSource",
    ()=>insertRssSource,
    "linkArticleToTags",
    ()=>linkArticleToTags,
    "searchArticles",
    ()=>searchArticles,
    "updateArticleContent",
    ()=>updateArticleContent,
    "updateRawArticleStatus",
    ()=>updateRawArticleStatus,
    "updateRssSource",
    ()=>updateRssSource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
;
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
async function createArticlesTable() {
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
async function createCategoriesAndTagsTables() {
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
async function getLatestArticles(limit = 10) {
    const rows = await sql`
    SELECT * FROM articles 
    ORDER BY published_at DESC 
    LIMIT ${limit}
  `;
    return rows;
}
async function getArticleBySlug(slug) {
    const rows = await sql`
    SELECT * FROM articles 
    WHERE slug = ${slug}
    LIMIT 1
  `;
    return rows[0] || null;
}
async function insertArticle(article) {
    const publishedAt = article.published_at.toISOString();
    await sql`
    INSERT INTO articles (title, slug, content, summary, cover_image_url, published_at)
    VALUES (${article.title}, ${article.slug}, ${article.content}, ${article.summary}, ${article.cover_image_url}, ${publishedAt})
  `;
}
async function createRssTables() {
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
async function getActiveRssSources() {
    const rows = await sql`
    SELECT * FROM rss_sources 
    WHERE is_active = true
    ORDER BY name
  `;
    return rows;
}
async function getAllRssSources() {
    const rows = await sql`
    SELECT * FROM rss_sources 
    ORDER BY name
  `;
    return rows;
}
async function insertRssSource(source) {
    await sql`
    INSERT INTO rss_sources (name, rss_url, is_active)
    VALUES (${source.name}, ${source.rss_url}, ${source.is_active})
  `;
}
async function updateRssSource(id, source) {
    const updates = [];
    const values = [];
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
        await sql.query(`UPDATE rss_sources SET ${updates.join(', ')} WHERE id = $${updates.length + 1}`, [
            ...values,
            id
        ]);
    }
}
async function deleteRssSource(id) {
    await sql`DELETE FROM rss_sources WHERE id = ${id}`;
}
async function checkArticleExists(originalUrl) {
    const rows = await sql`
    SELECT id FROM raw_articles WHERE original_url = ${originalUrl} LIMIT 1
  `;
    return rows.length > 0;
}
async function insertRawArticle(article) {
    const publicationDate = article.publication_date.toISOString();
    await sql`
    INSERT INTO raw_articles (source_id, title, original_url, original_content, publication_date, status)
    VALUES (${article.source_id}, ${article.title}, ${article.original_url}, ${article.original_content}, ${publicationDate}, ${article.status})
  `;
}
async function getPendingRawArticles(limit = 10) {
    const rows = await sql`
    SELECT * FROM raw_articles 
    WHERE status = 'pending'
    ORDER BY publication_date DESC
    LIMIT ${limit}
  `;
    return rows;
}
async function updateRawArticleStatus(id, status, error) {
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
async function checkSlugExists(slug) {
    const rows = await sql`
    SELECT id FROM articles WHERE slug = ${slug} LIMIT 1
  `;
    return rows.length > 0;
}
async function insertArticleFromRaw(article) {
    const publishedAt = article.published_at.toISOString();
    await sql`
    INSERT INTO articles (title, slug, content, summary, cover_image_url, published_at)
    VALUES (${article.title}, ${article.slug}, ${article.content}, ${article.summary}, ${article.cover_image_url}, ${publishedAt})
  `;
}
async function findRelatedArticles(keyword, excludeSlug, limit = 2) {
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
    return rows;
}
async function updateArticleContent(slug, content) {
    await sql`
    UPDATE articles 
    SET content = ${content}
    WHERE slug = ${slug}
  `;
}
async function getAllCategories() {
    const rows = await sql`SELECT * FROM categories ORDER BY name`;
    return rows;
}
async function getCategoryBySlug(slug) {
    const rows = await sql`SELECT * FROM categories WHERE slug = ${slug} LIMIT 1`;
    return rows[0] || null;
}
async function insertCategory(name, slug) {
    await sql`INSERT INTO categories (name, slug) VALUES (${name}, ${slug})`;
}
async function getAllTags() {
    const rows = await sql`SELECT * FROM tags ORDER BY name`;
    return rows;
}
async function getPopularTags(limit = 10) {
    const rows = await sql`
    SELECT t.*, COUNT(at.article_id) as article_count
    FROM tags t
    LEFT JOIN article_tags at ON t.id = at.tag_id
    GROUP BY t.id
    ORDER BY article_count DESC, t.name
    LIMIT ${limit}
  `;
    return rows;
}
async function getTagBySlug(slug) {
    const rows = await sql`SELECT * FROM tags WHERE slug = ${slug} LIMIT 1`;
    return rows[0] || null;
}
async function findOrCreateTag(name, slug) {
    const existing = await sql`SELECT id FROM tags WHERE slug = ${slug} LIMIT 1`;
    if (existing.length > 0) {
        return existing[0].id;
    }
    const result = await sql`INSERT INTO tags (name, slug) VALUES (${name}, ${slug}) RETURNING id`;
    return result[0].id;
}
async function getArticlesByCategory(categorySlug, limit = 20) {
    const rows = await sql`
    SELECT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE c.slug = ${categorySlug}
    ORDER BY a.published_at DESC
    LIMIT ${limit}
  `;
    return rows;
}
async function getArticlesByTag(tagSlug, limit = 20) {
    const rows = await sql`
    SELECT a.*
    FROM articles a
    INNER JOIN article_tags at ON a.id = at.article_id
    INNER JOIN tags t ON at.tag_id = t.id
    WHERE t.slug = ${tagSlug}
    ORDER BY a.published_at DESC
    LIMIT ${limit}
  `;
    return rows;
}
async function getArticleTags(articleId) {
    const rows = await sql`
    SELECT t.*
    FROM tags t
    INNER JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ${articleId}
    ORDER BY t.name
  `;
    return rows;
}
async function linkArticleToTags(articleId, tagIds) {
    for (const tagId of tagIds){
        await sql`
      INSERT INTO article_tags (article_id, tag_id)
      VALUES (${articleId}, ${tagId})
      ON CONFLICT DO NOTHING
    `;
    }
}
async function searchArticles(query, limit = 20) {
    const searchTerm = `%${query}%`;
    const rows = await sql`
    SELECT * FROM articles
    WHERE title ILIKE ${searchTerm} OR content ILIKE ${searchTerm}
    ORDER BY published_at DESC
    LIMIT ${limit}
  `;
    return rows;
}
async function incrementViewCount(slug) {
    await sql`
    UPDATE articles 
    SET view_count = view_count + 1
    WHERE slug = ${slug}
  `;
}
async function getFeaturedArticles(limit = 5) {
    const rows = await sql`
    SELECT * FROM articles
    ORDER BY view_count DESC, published_at DESC
    LIMIT ${limit}
  `;
    return rows;
}
}),
"[project]/app/api/fetch-rss/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rss$2d$parser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/rss-parser/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
;
const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rss$2d$parser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]();
async function GET(request) {
    try {
        // Verify cron secret for security
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const sources = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getActiveRssSources"])();
        let totalFetched = 0;
        let totalNew = 0;
        const results = [];
        for (const source of sources){
            try {
                const feed = await parser.parseURL(source.rss_url);
                let newArticles = 0;
                for (const item of feed.items){
                    if (!item.link || !item.title) continue;
                    const exists = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkArticleExists"])(item.link);
                    if (!exists) {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insertRawArticle"])({
                            source_id: source.id,
                            title: item.title,
                            original_url: item.link,
                            original_content: item.content || item.contentSnippet || '',
                            publication_date: item.pubDate ? new Date(item.pubDate) : new Date(),
                            status: 'pending'
                        });
                        newArticles++;
                        totalNew++;
                    }
                    totalFetched++;
                }
                results.push({
                    source: source.name,
                    fetched: feed.items.length,
                    new: newArticles
                });
            } catch (error) {
                console.error(`Error fetching RSS from ${source.name}:`, error);
                results.push({
                    source: source.name,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            totalFetched,
            totalNew,
            sources: results,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in fetch-rss:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cf1f8c30._.js.map