# TechShift - AI-Powered Tech News CMS

> Hệ thống quản lý nội dung công nghệ tự động với AI, tích hợp RSS feed và xử lý ngôn ngữ tiếng Việt.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng chính](#-tính-năng-chính)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Sử dụng](#-sử-dụng)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Tổng quan

TechShift là một CMS (Content Management System) hiện đại được xây dựng với Next.js 16, tích hợp AI (Google Gemini) để tự động hóa quy trình tạo nội dung từ các nguồn RSS feed.

### Đặc điểm nổi bật

- ✅ **AI-Powered Content Processing**: Tự động viết lại bài viết với Gemini AI
- ✅ **Multi-source RSS Fetching**: Hỗ trợ nhiều nguồn RSS đồng thời
- ✅ **Vietnamese Optimization**: Tối ưu cho tiếng Việt (tags, content, SEO)
- ✅ **Draft/Published Workflow**: Quy trình duyệt bài chuyên nghiệp
- ✅ **Bulk Operations**: Xử lý hàng loạt (publish, delete)
- ✅ **Smart Internal Linking**: Tự động chèn link nội bộ thông minh
- ✅ **Detailed Processing Reports**: Báo cáo chi tiết từng bài viết

---

## 🚀 Tính năng chính

### 1. AI Content Processing

**Gemini API Integration:**
- Key rotation system (hỗ trợ 20 keys)
- Automatic article rewriting
- SEO optimization
- Vietnamese language focus
- HTML entities decoding
- Markdown stripping for meta fields

**Processing Pipeline:**
```
RSS Feed → Fetch → AI Analysis → AI Rewriting → Internal Linking → Draft → Review → Publish
```

### 2. RSS Feed Management

**Features:**
- Multi-source RSS support
- Duplicate prevention (URL-based)
- Automatic scheduling
- Processing logs with status
- Skip reasons (duplicate, short content, errors)

**Supported Status:**
- ✅ **SUCCESS**: Bài viết được tạo thành công
- ⏭️ **SKIPPED**: Bỏ qua (duplicate, content ngắn)
- ❌ **FAILED**: Lỗi xử lý (với message chi tiết)

### 3. Admin Dashboard

**Content Management:**
- Draft/Published tabs
- Bulk actions (select all, publish, delete)
- Floating action bar
- Tag management
- Article editor with preview
- Processing logs modal

**Security:**
- Server-side authentication
- JWT tokens (8-hour expiration)
- HttpOnly cookies
- Password from environment variables

### 4. Public Website

**Features:**
- Homepage with latest articles
- Category pages
- Tag pages
- Search functionality
- Related articles
- View counter
- SEO-optimized meta tags

**Security:**
- Only PUBLISHED articles visible
- Draft articles return 404
- Status filter on all queries

---

## 🏗️ Kiến trúc hệ thống

### Monorepo Structure

```
techshift/
├── apps/
│   ├── admin/          # Admin CMS (Next.js)
│   │   ├── app/
│   │   │   ├── api/    # API routes
│   │   │   ├── dashboard/
│   │   │   ├── editor/
│   │   │   └── rss/
│   │   ├── lib/
│   │   │   ├── ai-processor.ts      # AI processing engine
│   │   │   ├── internal-linking.ts  # Smart linking
│   │   │   ├── markdown-utils.ts    # Markdown utilities
│   │   │   └── db.ts                # Database functions
│   │   └── components/
│   │
│   └── website/        # Public website (Next.js)
│       ├── app/
│       ├── lib/
│       └── components/
│
├── packages/           # Shared packages (if any)
└── pnpm-workspace.yaml
```

### Tech Stack

**Frontend:**
- Next.js 16.0.3 (App Router)
- React 19.2.0
- TypeScript 5.x
- Tailwind CSS 4.0

**Backend:**
- Next.js API Routes
- Neon Serverless Postgres
- Google Gemini AI API

**Tools:**
- pnpm (package manager)
- Turbopack (build tool)
- ESLint (linting)

---

## 📦 Cài đặt

### Prerequisites

- Node.js 18+ 
- pnpm 9+
- PostgreSQL database (Neon recommended)
- Google Gemini API keys

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/ruanshan4896/TechShift.git
cd TechShift

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp apps/admin/.env.local.example apps/admin/.env.local
cp apps/website/.env.local.example apps/website/.env.local

# 4. Configure .env.local files (see Configuration section)

# 5. Run database migrations (if needed)
# Create tables will run automatically on first API call

# 6. Start development servers
pnpm dev
```

**Development URLs:**
- Admin: http://localhost:3001
- Website: http://localhost:3000

---

## ⚙️ Cấu hình

### Admin Environment Variables

**File:** `apps/admin/.env.local`

```bash
# Database (Required)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Admin Authentication (Required)
ADMIN_PASSWORD="your-secure-password"
JWT_SECRET="your-jwt-secret-key-min-32-chars"

# Google Gemini API Keys (Required)
# Supports up to 20 keys for rotation
GEMINI_API_KEYS="key1,key2,key3,..."

# Cron Job Secret (Optional)
CRON_SECRET="your-cron-secret"

# Cloudinary (Optional - for image upload)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Website Environment Variables

**File:** `apps/website/.env.local`

```bash
# Database (Required)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### Database Setup

**Neon Postgres (Recommended):**

1. Create account at https://neon.tech
2. Create new project
3. Copy connection string
4. Add to `.env.local`

**Tables are auto-created on first API call:**
- `articles` - Bài viết
- `categories` - Danh mục
- `tags` - Tags
- `article_tags` - Junction table
- `rss_sources` - Nguồn RSS
- `raw_articles` - Bài viết gốc từ RSS

---

## 📖 Sử dụng

### 1. Đăng nhập Admin

```
URL: http://localhost:3001/rss
Password: [ADMIN_PASSWORD from .env.local]
```

### 2. Thêm RSS Source

**Steps:**
1. Go to RSS Manager
2. Click "Thêm nguồn RSS mới"
3. Fill in:
   - Tên nguồn: VnExpress Tech
   - RSS URL: https://vnexpress.net/rss/suc-khoe.rss
   - Kích hoạt: ✓
4. Click "Thêm mới"

### 3. Fetch & Process Articles

**Steps:**
1. Click "Fetch & Process" button
2. Confirm dialog
3. Wait for processing (10-30 seconds)
4. View detailed report modal:
   - Summary statistics
   - Success/Skipped/Failed logs
   - Reasons for each status

**Processing Logs Example:**
```
✅ SUCCESS: "iPhone 16 Pro Max: Đánh giá chi tiết"
   Created successfully as draft with slug: iphone-16-pro-max-danh-gia

⏭️ SKIPPED: "Samsung Galaxy S24 ra mắt"
   Duplicate URL found in database

❌ FAILED: "Google Pixel 9 Launch"
   Processing failed: Gemini API timeout
```

### 4. Review & Publish Drafts

**Steps:**
1. Go to Dashboard: http://localhost:3001/dashboard
2. Switch to "Bản nháp" tab
3. Review articles
4. Options:
   - **Single publish:** Click ✓ icon
   - **Bulk publish:** Select multiple → Click "Xuất bản"
   - **Edit:** Click pencil icon
   - **Delete:** Click trash icon

### 5. Bulk Operations

**Select All:**
- Click checkbox in header

**Bulk Publish:**
- Select articles → Click "Xuất bản" in floating bar

**Bulk Delete:**
- Select articles → Click "Xóa" in floating bar
- Confirm deletion

---

## 🔌 API Documentation

### RSS Processing

**Endpoint:** `POST /api/process-rss/[sourceId]`

**Response:**
```typescript
{
  success: true,
  source: "VnExpress Tech",
  summary: {
    total: 10,
    success: 2,
    skipped: 7,
    failed: 1
  },
  logs: [
    {
      title: "Article Title",
      url: "https://...",
      status: "SUCCESS" | "SKIPPED" | "FAILED",
      message: "Detailed reason..."
    }
  ],
  message: "Processed 10 articles: 2 success, 7 skipped, 1 failed."
}
```

### Article Management

**Get Articles:**
```
GET /api/articles?status=DRAFT|PUBLISHED
```

**Get Single Article:**
```
GET /api/articles/[id]
```

**Update Article:**
```
PUT /api/articles/[id]
Body: { title, slug, content, summary, cover_image_url, category_id, tags }
```

**Delete Article:**
```
DELETE /api/articles/[id]
```

**Publish Article:**
```
POST /api/articles/[id]/publish
```

**Bulk Publish:**
```
POST /api/articles/bulk-publish
Body: { ids: [1, 2, 3] }
```

**Bulk Delete:**
```
POST /api/articles/bulk-delete
Body: { ids: [1, 2, 3] }
```

---

## 🗄️ Database Schema

### Articles Table

```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  published_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category_id INTEGER,
  view_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('DRAFT', 'PUBLISHED')) DEFAULT 'PUBLISHED'
);
```

### Raw Articles Table

```sql
CREATE TABLE raw_articles (
  id SERIAL PRIMARY KEY,
  source_id INTEGER REFERENCES rss_sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_url TEXT UNIQUE NOT NULL,
  original_content TEXT NOT NULL,
  publication_date TIMESTAMP NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processed', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### RSS Sources Table

```sql
CREATE TABLE rss_sources (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rss_url TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tags & Categories

```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE article_tags (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);
```

---

## 🚢 Deployment

### Vercel Deployment

**Admin App:**

1. Import project to Vercel
2. Set Root Directory: `apps/admin`
3. Framework Preset: Next.js
4. Environment Variables:
   - Add all from `.env.local`
5. Deploy

**Website App:**

1. Create new project
2. Set Root Directory: `apps/website`
3. Framework Preset: Next.js
4. Environment Variables:
   - Add DATABASE_URL
5. Deploy

### Environment Variables on Vercel

**Required for Admin:**
```
DATABASE_URL
ADMIN_PASSWORD
JWT_SECRET
GEMINI_API_KEYS
```

**Required for Website:**
```
DATABASE_URL
```

### Build Commands

```bash
# Admin
cd apps/admin && pnpm build

# Website
cd apps/website && pnpm build
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Errors

**Error:** `Cannot find module '@/lib/...'`

**Fix:**
```bash
# Clear cache and rebuild
rm -rf .next
pnpm install
pnpm build
```

#### 2. Database Connection

**Error:** `Connection timeout`

**Fix:**
- Check DATABASE_URL format
- Ensure `?sslmode=require` is included
- Verify database is accessible

#### 3. Gemini API Errors

**Error:** `API key not configured`

**Fix:**
- Check GEMINI_API_KEYS in .env.local
- Ensure keys are comma-separated
- Verify keys are valid

#### 4. Draft Articles Visible on Website

**Fix:**
- Already fixed in latest version
- All queries filter by `status = 'PUBLISHED'`
- Clear browser cache

#### 5. Cannot Re-fetch Deleted Articles

**Fix:**
- Already fixed with fuzzy title matching
- raw_articles are deleted when article is deleted
- Can re-fetch after deletion

### Debug Mode

**Enable detailed logging:**

```typescript
// In api routes
console.log('Debug:', { variable });
```

**Check Vercel logs:**
```
Vercel Dashboard → Project → Deployments → View Function Logs
```

---

## 📊 Performance

### Optimization Features

- ✅ **Turbopack:** Fast builds (10x faster than Webpack)
- ✅ **Edge Functions:** Low latency responses
- ✅ **Connection Pooling:** Efficient database connections
- ✅ **Image Optimization:** Automatic image optimization
- ✅ **Static Generation:** Pre-rendered pages where possible

### Monitoring

**Metrics to track:**
- API response times
- Gemini API quota usage
- Database query performance
- Error rates
- User engagement

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Make changes
3. Test locally
4. Commit with descriptive message
5. Push and create PR

### Commit Message Format

```
type(scope): description

Examples:
feat(admin): Add bulk delete functionality
fix(api): Fix duplicate article detection
docs(readme): Update installation guide
```

### Code Style

- Use TypeScript
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful comments

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Authors

- **RuanShan** - Initial work
- **Kiro AI Assistant** - Development assistance

---

## 🙏 Acknowledgments

- Next.js team for amazing framework
- Google for Gemini AI API
- Neon for serverless Postgres
- Vercel for hosting platform
- Open source community

---

## 📞 Support

**Issues:** https://github.com/ruanshan4896/TechShift/issues

**Email:** [Your email]

**Documentation:** This README

---

## 🗺️ Roadmap

### Planned Features

- [ ] Multi-language support (English, Vietnamese)
- [ ] Advanced analytics dashboard
- [ ] Comment system
- [ ] Newsletter integration
- [ ] Social media auto-posting
- [ ] Advanced SEO tools
- [ ] A/B testing for titles
- [ ] Content scheduling
- [ ] User roles & permissions
- [ ] API rate limiting

### Future Improvements

- [ ] Add article_id foreign key to raw_articles
- [ ] Implement Redis caching
- [ ] Add full-text search with Algolia
- [ ] Implement CDN for images
- [ ] Add automated testing
- [ ] Improve error handling
- [ ] Add monitoring & alerting

---

**Last Updated:** November 23, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
