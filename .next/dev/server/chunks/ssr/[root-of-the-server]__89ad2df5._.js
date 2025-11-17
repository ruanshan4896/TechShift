module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-rsc] (ecmascript)");
;
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
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
"[project]/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-rsc] (ecmascript)");
;
;
;
;
const revalidate = 3600; // ISR: Revalidate every hour
async function Home() {
    const articles = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLatestArticles"])(10);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white shadow-sm border-b border-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-gray-900",
                            children: "Tech News"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 14,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-700 mt-1",
                            children: "Tin tức công nghệ mới nhất"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 17,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                    children: articles.map((article)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: `/posts/${article.slug}`,
                            className: "group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative h-48 w-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        src: article.cover_image_url,
                                        alt: article.title,
                                        fill: true,
                                        className: "object-cover group-hover:scale-105 transition-transform duration-300"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 32,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 31,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors",
                                            children: article.title
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 40,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-700 text-sm line-clamp-3",
                                            children: article.summary
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 43,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 text-sm text-gray-600 font-medium",
                                            children: new Date(article.published_at).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 46,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 39,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, article.id, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 26,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__89ad2df5._.js.map