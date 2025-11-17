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
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkArticleExists",
    ()=>checkArticleExists,
    "checkSlugExists",
    ()=>checkSlugExists,
    "createArticlesTable",
    ()=>createArticlesTable,
    "createRssTables",
    ()=>createRssTables,
    "deleteRssSource",
    ()=>deleteRssSource,
    "getActiveRssSources",
    ()=>getActiveRssSources,
    "getAllRssSources",
    ()=>getAllRssSources,
    "getArticleBySlug",
    ()=>getArticleBySlug,
    "getLatestArticles",
    ()=>getLatestArticles,
    "getPendingRawArticles",
    ()=>getPendingRawArticles,
    "insertArticle",
    ()=>insertArticle,
    "insertArticleFromRaw",
    ()=>insertArticleFromRaw,
    "insertRawArticle",
    ()=>insertRawArticle,
    "insertRssSource",
    ()=>insertRssSource,
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
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
}),
"[project]/lib/gemini.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateSlug",
    ()=>generateSlug,
    "getDefaultCoverImage",
    ()=>getDefaultCoverImage,
    "processArticleWithGemini",
    ()=>processArticleWithGemini
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY);
async function processArticleWithGemini(originalTitle, originalContent, originalUrl) {
    // Use Gemini 2.5 Flash - latest free model
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash'
    });
    // Prompt A: Tạo bài viết tổng hợp
    const promptA = `Dựa trên nội dung từ bài viết gốc tại ${originalUrl} với tiêu đề "${originalTitle}", hãy viết một bài viết mới, đầy đủ và chi tiết về chủ đề này.

Nội dung gốc:
${originalContent}

**Yêu cầu:**
- Viết bài viết hoàn chỉnh bằng tiếng Việt
- Bổ sung thêm các thông tin nền
- Giải thích các thuật ngữ kỹ thuật cho người mới
- Đưa ra góc nhìn so sánh với các công nghệ/sản phẩm tương tự (nếu có)
- Giữ văn phong chuyên nghiệp nhưng dễ tiếp cận
- Không sao chép nguyên văn
- Độ dài: 500-800 từ
- Format: Markdown với heading (##), bullet points, và đoạn văn rõ ràng

Hãy viết bài viết:`;
    const resultA = await model.generateContent(promptA);
    const content = resultA.response.text();
    // Prompt B: Tạo tóm tắt và tiêu đề
    const promptB = `Từ nội dung bài viết sau:

${content}

Hãy:
1. Viết một đoạn tóm tắt (meta description) trong khoảng 150-155 ký tự, hấp dẫn và chuẩn SEO
2. Đề xuất 3 tiêu đề mới hấp dẫn, chuẩn SEO (dưới 60 ký tự mỗi tiêu đề)

Format trả về:
SUMMARY: [tóm tắt ở đây]
TITLE1: [tiêu đề 1]
TITLE2: [tiêu đề 2]
TITLE3: [tiêu đề 3]`;
    const resultB = await model.generateContent(promptB);
    const metaText = resultB.response.text();
    // Parse kết quả
    const summaryMatch = metaText.match(/SUMMARY:\s*(.+)/);
    const title1Match = metaText.match(/TITLE1:\s*(.+)/);
    const title2Match = metaText.match(/TITLE2:\s*(.+)/);
    const title3Match = metaText.match(/TITLE3:\s*(.+)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : originalTitle.substring(0, 155);
    const suggestedTitles = [
        title1Match ? title1Match[1].trim() : originalTitle,
        title2Match ? title2Match[1].trim() : originalTitle,
        title3Match ? title3Match[1].trim() : originalTitle
    ];
    return {
        content,
        summary,
        suggestedTitles
    };
}
function generateSlug(title) {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 100);
}
function getDefaultCoverImage(title) {
    // Sử dụng Unsplash với keyword từ title
    const keywords = title.split(' ').slice(0, 3).join(',');
    return `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80`;
}
}),
"[project]/app/api/process-articles/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gemini.ts [app-route] (ecmascript)");
;
;
;
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
        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Gemini API key not configured'
            }, {
                status: 500
            });
        }
        const pendingArticles = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPendingRawArticles"])(5);
        const results = [];
        for (const rawArticle of pendingArticles){
            try {
                console.log(`Processing article: ${rawArticle.title}`);
                // Process with Gemini
                const processed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processArticleWithGemini"])(rawArticle.title, rawArticle.original_content, rawArticle.original_url);
                // Choose best title (first suggestion)
                const finalTitle = processed.suggestedTitles[0];
                let slug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSlug"])(finalTitle);
                // Ensure unique slug
                let slugCounter = 1;
                while(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkSlugExists"])(slug)){
                    slug = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSlug"])(finalTitle)}-${slugCounter}`;
                    slugCounter++;
                }
                // Get cover image
                const coverImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDefaultCoverImage"])(finalTitle);
                // Insert into articles table
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insertArticleFromRaw"])({
                    title: finalTitle,
                    slug,
                    content: processed.content,
                    summary: processed.summary,
                    cover_image_url: coverImage,
                    published_at: rawArticle.publication_date
                });
                // Update raw article status
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateRawArticleStatus"])(rawArticle.id, 'processed');
                results.push({
                    id: rawArticle.id,
                    originalTitle: rawArticle.title,
                    newTitle: finalTitle,
                    slug,
                    status: 'success'
                });
                console.log(`✓ Processed: ${finalTitle}`);
            } catch (error) {
                console.error(`Error processing article ${rawArticle.id}:`, error);
                // Update status to failed
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateRawArticleStatus"])(rawArticle.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
                results.push({
                    id: rawArticle.id,
                    originalTitle: rawArticle.title,
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            processed: results.length,
            results,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in process-articles:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__01912254._.js.map