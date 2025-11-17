# Tech News - Hướng Dẫn Hoàn Chỉnh

## 📋 Mục lục

1. [Tổng quan Hệ thống](#tổng-quan-hệ-thống)
2. [Cài đặt & Setup](#cài-đặt--setup)
3. [Database Schema](#database-schema)
4. [Tính năng Chính](#tính-năng-chính)
5. [Admin Panel](#admin-panel)
6. [RSS Auto-Fetch](#rss-auto-fetch)
7. [AI Content Processing](#ai-content-processing)
8. [Internal Linking](#internal-linking)
9. [API Keys Rotation](#api-keys-rotation)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## Tổng quan Hệ thống

Website tin tức công nghệ **HOÀN TOÀN TỰ ĐỘNG** với AI:

```
RSS Feeds → Fetch (30 phút) → AI Processing (10 phút) → Auto Publish → Website
```

### Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, TypeScript 5
- **Backend**: Next.js API Routes, Neon Postgres
- **AI**: Google Gemini 2.5 Flash (20 keys rotation)
- **Deployment**: Vercel

### Tính năng Nổi bật
- ✅ RSS Auto-Fetch từ nhiều nguồn
- ✅ AI viết lại bài viết (Gemini)
- ✅ Internal linking tự động
- ✅ SEO optimization (Schema.org)
- ✅ Admin dashboard (CRUD)
- ✅ Categories & Tags system
- ✅ Search functionality
- ✅ View count tracking
- ✅ Responsive design
- ✅ 20 API keys rotation

---

## Cài đặt & Setup

### 1. Clone & Install

```bash
git clone <repo>
cd tech-news
npm install
```

### 2. Database Setup (Neon)

1. Tạo account tại [neon.tech](https://neon.tech)
2. Tạo project mới, chọn region Singapore
3. Copy connection string

### 3. Environment Variables

Tạo file `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:pass@ep-xxx.aws.neon.tech/db?sslmode=require"

# Security
CRON_SECRET="your-random-secret-key"
NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
NEXT_PUBLIC_CRON_SECRET="your-random-secret-key"

# Google Gemini API Keys (Add up to 20 keys for rotation)
GEMINI_API_KEY="your-primary-key"
GEMINI_API_KEY_1="your-key-1"
GEMINI_API_KEY_2="your-key-2"
# ... up to GEMINI_API_KEY_20
```

### 4. Seed Database

```bash
npm run seed              # Articles table + 5 sample articles
npm run seed:rss          # RSS sources + tags
npm run seed:categories   # Categories + tags
```

### 5. Run Development

```bash
npm run dev
```

Truy cập: http://localhost:3000

---

## Database Schema

### Bảng `articles`
```sql
id SERIAL PRIMARY KEY
title TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
content TEXT NOT NULL
summary TEXT NOT NULL
cover_image_url TEXT NOT NULL
published_at TIMESTAMP NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
category_id INTEGER REFERENCES categories(id)
view_count INTEGER DEFAULT 0
```

### Bảng `categories`
```sql
id SERIAL PRIMARY KEY
name TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Bảng `tags`
```sql
id SERIAL PRIMARY KEY
name TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Bảng `article_tags` (Junction)
```sql
article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE
tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE
PRIMARY KEY (article_id, tag_id)
```

### Bảng `rss_sources`
```sql
id SERIAL PRIMARY KEY
name TEXT NOT NULL
rss_url TEXT UNIQUE NOT NULL
is_active BOOLEAN DEFAULT true
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Bảng `raw_articles`
```sql
id SERIAL PRIMARY KEY
source_id INTEGER REFERENCES rss_sources(id)
title TEXT NOT NULL
original_url TEXT UNIQUE NOT NULL
original_content TEXT NOT NULL
publication_date TIMESTAMP NOT NULL
status TEXT CHECK (status IN ('pending', 'processed', 'failed'))
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## Tính năng Chính

### 1. Trang chủ (`/`)
- Grid layout 2 columns + sidebar
- 12 bài viết mới nhất
- ISR revalidate mỗi giờ

### 2. Category Pages (`/category/[slug]`)
- Dynamic routing cho 7 categories
- Breadcrumbs với Schema.org
- Sidebar với featured/latest/tags

### 3. Tag Pages (`/tags/[slug]`)
- Dynamic routing cho tất cả tags
- List articles by tag

### 4. Search Page (`/search?q=...`)
- Full-text search trong title và content
- Up to 50 results

### 5. Post Detail (`/posts/[slug]`)
- Markdown rendering với react-markdown
- View count tracking (auto increment)
- Tags display
- Internal links
- Breadcrumbs
- Sidebar

---

## Admin Panel

### Access
```
URL: http://localhost:3000/admin
Password: admin123
```

### Dashboard (`/admin`)
- Danh sách tất cả bài viết
- Actions: Xem, Sửa, Xóa
- Link đến RSS Manager
- Link đến Editor

### Editor (`/admin/editor/[id]`)
- Thêm bài mới: `/admin/editor/new`
- Sửa bài: `/admin/editor/[id]`
- Form fields:
  - Title
  - Slug (auto-generate)
  - Category (dropdown)
  - Summary
  - Cover Image URL
  - Content (Markdown)

### RSS Manager (`/admin/rss`)
- Quản lý RSS sources (CRUD)
- Fetch RSS Now
- Process with AI
- Link to Dashboard

---

## RSS Auto-Fetch

### Workflow

```
1. Cron Job (mỗi 30 phút)
   ↓
2. Fetch RSS từ sources active
   ↓
3. Lưu vào raw_articles (status: pending)
   ↓
4. Check duplicate (original_url unique)
```

### Sample RSS Sources
- VnExpress: `https://vnexpress.net/rss/so-hoa.rss`
- Genk: `https://genk.vn/cntt.rss`
- TechCrunch: `https://techcrunch.com/feed/`

### Manual Trigger
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/fetch-rss
```

---

## AI Content Processing

### Workflow

```
1. Cron Job (mỗi 10 phút)
   ↓
2. Lấy 5 bài pending
   ↓
3. Gemini AI:
   - Viết lại bài (500-800 từ)
   - Tạo tóm tắt (155 ký tự)
   - Đề xuất 3 tiêu đề
   ↓
4. Extract keywords
   ↓
5. Build internal links (max 4)
   ↓
6. Publish lên website
```

### Gemini Prompts

**Prompt A - Viết lại:**
```
Dựa trên nội dung gốc, viết bài mới:
- Bổ sung thông tin nền
- Giải thích thuật ngữ
- So sánh công nghệ tương tự
- 500-800 từ
- Format Markdown
```

**Prompt B - Metadata:**
```
Từ bài viết trên:
1. Tóm tắt 150-155 ký tự
2. 3 tiêu đề hấp dẫn (<60 ký tự)
```

### Manual Trigger
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/process-articles
```

---

## Internal Linking

### Workflow

```
1. Extract 5-7 keywords (Gemini AI)
   ↓
2. Tìm bài viết liên quan (Database)
   ↓
3. Chèn links vào content (max 4)
   ↓
4. Update article
```

### Example
```markdown
Input: "Hố đen nuốt sao..."
Keywords: Hố đen, Ngôi sao, Mặt Trời

Output:
Khi <a href="/posts/chup-anh-lo-den">hố đen</a> 
nuốt chửng một <a href="/posts/ngoi-sao">ngôi sao</a>...
```

### SEO Benefits
- Link juice distribution
- Better crawlability
- Improved user experience
- Keyword relevance

---

## API Keys Rotation

### Setup

Thêm tối đa 20 API keys vào `.env.local`:

```env
GEMINI_API_KEY="key-1"
GEMINI_API_KEY_1="key-1"
GEMINI_API_KEY_2="key-2"
GEMINI_API_KEY_3="key-3"
# ... up to GEMINI_API_KEY_20
```

### How It Works

```typescript
// Tự động luân phiên giữa các keys
const API_KEYS = [key1, key2, key3, ...].filter(Boolean);
let currentKeyIndex = 0;

function getNextApiKey() {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}
```

### Benefits
- **Tăng quota**: 60 requests/phút × 20 keys = 1,200 requests/phút
- **Tránh rate limit**: Tự động switch khi 1 key hết quota
- **High availability**: Nếu 1 key lỗi, dùng key khác

### Monitoring
```bash
# Check which key is being used
# Logs sẽ hiển thị key rotation
```

---

## Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

2. **Import to Vercel**
- Vào [vercel.com](https://vercel.com)
- Import repository
- Vercel auto-detect Next.js

3. **Environment Variables**
Add tất cả variables từ `.env.local`:
- `DATABASE_URL`
- `CRON_SECRET`
- `NEXT_PUBLIC_ADMIN_PASSWORD`
- `GEMINI_API_KEY` (và 20 keys nếu có)

4. **Deploy**
- Click "Deploy"
- Đợi ~2 phút

5. **Cron Jobs**
File `vercel.json` đã config:
```json
{
  "crons": [
    {
      "path": "/api/fetch-rss",
      "schedule": "*/30 * * * *"
    },
    {
      "path": "/api/process-articles",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

### Post-Deployment

1. **Seed Database**
```bash
DATABASE_URL="production-url" npm run seed
DATABASE_URL="production-url" npm run seed:rss
DATABASE_URL="production-url" npm run seed:categories
```

2. **Test Cron Jobs**
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.vercel.app/api/fetch-rss
```

3. **Monitor**
- Vercel Dashboard → Logs
- Filter by "fetch-rss" hoặc "process-articles"

---

## Troubleshooting

### Database Connection Timeout
**Lỗi:** `Connect Timeout Error`

**Nguyên nhân:** Neon free tier sleep sau 5 phút

**Giải pháp:**
- Refresh trang để wake up
- Hoặc upgrade Neon Pro

### Gemini API Rate Limit
**Lỗi:** `Rate limit exceeded`

**Giải pháp:**
- Thêm nhiều API keys (up to 20)
- Giảm số bài xử lý mỗi lần (5 → 3)
- Tăng cron interval (10 phút → 15 phút)

### Markdown Not Rendering
**Lỗi:** Content hiển thị raw markdown

**Giải pháp:**
- Check `react-markdown` đã install
- Verify `ArticleContent` component đang dùng

### Slug Duplicate
**Lỗi:** `Duplicate key value violates unique constraint`

**Giải pháp:**
- Hệ thống tự động thêm số vào slug
- Hoặc sửa slug thủ công trong editor

### 404 on Editor Page
**Lỗi:** `/admin/editor/[id]` returns 404

**Giải pháp:**
- Check file exists: `app/admin/editor/[id]/page.tsx`
- Restart dev server
- Clear `.next` folder

---

## Commands Summary

```bash
# Development
npm run dev

# Seed Database
npm run seed
npm run seed:rss
npm run seed:categories

# Testing
npm run check              # Check database
npm run test:ai            # Test AI processing
npm run test:links         # Test internal linking
npm run list:models        # List Gemini models

# Build
npm run build
npm start
```

---

## API Endpoints

### Public APIs
- `GET /` - Home page
- `GET /posts/[slug]` - Article detail
- `GET /category/[slug]` - Category page
- `GET /tags/[slug]` - Tag page
- `GET /search?q=...` - Search results

### Admin APIs
- `GET /api/articles` - List all articles
- `GET /api/articles/[id]` - Get article
- `POST /api/articles` - Create article
- `PUT /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article
- `GET /api/categories` - List categories
- `GET /api/rss-sources` - List RSS sources
- `POST /api/rss-sources` - Create RSS source
- `PUT /api/rss-sources/[id]` - Update RSS source
- `DELETE /api/rss-sources/[id]` - Delete RSS source

### Cron APIs (Protected)
- `GET /api/fetch-rss` - Fetch RSS feeds
- `GET /api/process-articles` - Process with AI

---

## Performance

### Metrics
- **First Load**: ~500ms
- **Page Navigation**: ~100ms
- **Search**: ~200ms
- **AI Processing**: ~30-60s per article

### Optimizations
- ISR revalidate mỗi giờ
- Image optimization (Next.js Image)
- Server components (async data fetching)
- Database indexes
- Connection pooling

### Capacity
- **Neon Free**: 0.5 GB storage, 3 GB transfer/tháng
- **Gemini Free**: 60 req/min × 20 keys = 1,200 req/min
- **Vercel Hobby**: 100 GB bandwidth/tháng

---

## Security

### Authentication
- Password protection cho admin pages
- Environment variable: `NEXT_PUBLIC_ADMIN_PASSWORD`
- Cron secret: `CRON_SECRET`

### Best Practices
- Đổi password mặc định
- Dùng strong random secrets
- HTTPS only (Vercel automatic)
- Input validation
- SQL injection prevention (parameterized queries)

---

## Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Gemini API Docs](https://ai.google.dev/docs)

### Community
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)
- [Vercel Community](https://vercel.com/community)

---

## Changelog

### v2.0 - Phase 2 Complete
- ✅ Admin dashboard với CRUD
- ✅ Editor page (thêm/sửa bài viết)
- ✅ 20 API keys rotation
- ✅ Markdown rendering fix
- ✅ Categories & Tags system
- ✅ Search functionality
- ✅ Breadcrumbs với Schema.org
- ✅ Sidebar components
- ✅ Footer component

### v1.0 - Initial Release
- ✅ RSS Auto-Fetch
- ✅ AI Content Processing
- ✅ Internal Linking
- ✅ Basic website structure

---

## 🎉 Kết luận

Hệ thống hoàn chỉnh với:
- **Tự động hóa 100%**: RSS → AI → Publish
- **Admin dashboard**: Quản lý dễ dàng
- **SEO-optimized**: Schema.org, internal links
- **Scalable**: 20 API keys rotation
- **Production-ready**: Deploy lên Vercel

**Website tin tức công nghệ chuyên nghiệp và hoàn toàn tự động! 🚀**
