# Tech News - Hệ thống Hoàn chỉnh

## 🎯 Tổng quan

Website tin tức công nghệ **HOÀN TOÀN TỰ ĐỘNG** với AI:

```
RSS Feeds → Fetch tự động → AI xử lý → Publish tự động → Website
```

## 🏗️ Kiến trúc Hệ thống

### Phase 1: Website Cơ bản ✅
- Next.js 15 + Tailwind CSS 4
- Neon Postgres Database
- SSG + ISR cho performance
- SEO optimization
- Responsive design

### Phase 2: RSS Auto-Fetch ✅
- Quản lý nguồn RSS (CRUD)
- Fetch tự động mỗi 30 phút
- Lưu vào `raw_articles` (pending)
- Admin panel để quản lý

### Phase 3: AI Content Processing ✅
- Google Gemini API integration
- Tự động viết lại bài viết
- Tạo tiêu đề + tóm tắt SEO
- Process mỗi 10 phút
- Auto-publish lên website

## 📊 Database Schema

### `articles` - Bài viết đã publish
```sql
id, title, slug, content, summary, 
cover_image_url, published_at, created_at
```

### `rss_sources` - Nguồn RSS
```sql
id, name, rss_url, is_active, created_at
```

### `raw_articles` - Bài viết thô từ RSS
```sql
id, source_id, title, original_url, 
original_content, publication_date, 
status (pending/processed/failed), created_at
```

## 🔄 Workflow Tự động

### 1. Fetch RSS (Mỗi 30 phút)
```
Vercel Cron → /api/fetch-rss
  ↓
Lấy RSS từ các nguồn active
  ↓
Lưu vào raw_articles (status: pending)
  ↓
Kiểm tra duplicate (original_url unique)
```

### 2. Process với AI (Mỗi 10 phút)
```
Vercel Cron → /api/process-articles
  ↓
Lấy 5 bài pending
  ↓
Gemini AI:
  - Viết lại bài viết (500-800 từ)
  - Tạo tóm tắt SEO (155 ký tự)
  - Đề xuất 3 tiêu đề hấp dẫn
  ↓
Lưu vào articles (auto-publish)
  ↓
Update status: processed
```

### 3. Hiển thị (Tức thì)
```
ISR revalidate mỗi giờ
  ↓
Bài viết mới xuất hiện trên trang chủ
  ↓
SEO-optimized, ready to rank!
```

## 🚀 Setup Hoàn chỉnh

### 1. Clone & Install
```bash
git clone <repo>
cd tech-news
npm install
```

### 2. Database Setup
```bash
# Tạo Neon database (miễn phí)
# Copy connection string

# Seed database
npm run seed        # Articles table + 5 bài mẫu
npm run seed:rss    # RSS tables + 3 nguồn
```

### 3. Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Security
CRON_SECRET="random-secret-key"
NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
NEXT_PUBLIC_CRON_SECRET="random-secret-key"

# AI
GEMINI_API_KEY="your-gemini-key"
```

### 4. Run Development
```bash
npm run dev
```

### 5. Test System
```
1. http://localhost:3000/admin/rss
2. Click "🔄 Test Fetch RSS"
3. Click "🤖 Test Process Articles (AI)"
4. Refresh trang chủ → Thấy bài mới!
```

## 📈 Capacity & Limits

### Neon Database (Free)
- Storage: 0.5 GB
- Transfer: 3 GB/tháng
- Connections: Pooled (unlimited)
- **Đủ cho ~10,000 bài viết**

### Gemini API (Free)
- Requests: 60/phút, 1,500/ngày
- Tokens: Unlimited
- **Đủ xử lý ~720 bài/ngày**

### Vercel (Hobby)
- Bandwidth: 100 GB/tháng
- Builds: Unlimited
- Cron Jobs: Unlimited
- **Đủ cho ~100,000 visitors/tháng**

## 🎯 Production Checklist

- [ ] Đổi `NEXT_PUBLIC_ADMIN_PASSWORD`
- [ ] Tạo `CRON_SECRET` mạnh (32+ ký tự)
- [ ] Lấy Gemini API key
- [ ] Setup Neon database
- [ ] Deploy lên Vercel
- [ ] Add environment variables
- [ ] Test cron jobs
- [ ] Monitor logs
- [ ] Setup custom domain (optional)

## 📊 Monitoring

### Database
```sql
-- Bài viết pending
SELECT COUNT(*) FROM raw_articles WHERE status = 'pending';

-- Bài viết đã publish
SELECT COUNT(*) FROM articles;

-- Thống kê theo nguồn
SELECT rs.name, COUNT(ra.id) as total
FROM rss_sources rs
LEFT JOIN raw_articles ra ON rs.id = ra.source_id
GROUP BY rs.name;
```

### Vercel Dashboard
- Logs → Filter by "fetch-rss" hoặc "process-articles"
- Analytics → Xem traffic
- Cron Jobs → Xem execution history

## 🎨 Customization

### Thay đổi AI Prompts
Edit: `lib/gemini.ts`

### Thêm nguồn RSS
Admin Panel: `/admin/rss`

### Thay đổi cron schedule
Edit: `vercel.json`

### Customize UI
Edit: `app/page.tsx`, `app/posts/[slug]/page.tsx`

## 💰 Cost Breakdown

### Development (FREE)
- Next.js: Free
- Neon: Free tier
- Gemini: Free tier
- Vercel: Hobby plan (free)

### Production (Có thể FREE)
- Neon Free: Đủ cho ~10K bài
- Gemini Free: Đủ cho ~720 bài/ngày
- Vercel Hobby: Đủ cho ~100K visitors/tháng

### Scale Up (Nếu cần)
- Neon Pro: $19/tháng
- Gemini Paid: Pay-as-you-go
- Vercel Pro: $20/tháng

## 🎉 Kết quả

Một website tin tức **HOÀN TOÀN TỰ ĐỘNG**:

✅ Fetch RSS tự động
✅ AI viết lại bài tự động
✅ Publish tự động
✅ SEO-optimized
✅ Không cần can thiệp thủ công
✅ Scale được
✅ Chi phí thấp (có thể FREE)

## 📚 Documentation

- `README.md` - Overview
- `QUICKSTART.md` - Quick start guide
- `SETUP.md` - Database setup
- `RSS_GUIDE.md` - RSS system
- `RSS_QUICKSTART.md` - RSS quick start
- `GEMINI_GUIDE.md` - AI processing
- `AI_QUICKSTART.md` - AI quick start
- `DEPLOYMENT.md` - Deploy guide
- `FEATURES.md` - Feature list
- `ACCESSIBILITY.md` - Accessibility
- `DATABASE_OPTIONS.md` - Database comparison

## 🚀 Next Level

Có thể mở rộng thêm:
- [ ] Automatic image generation (DALL-E, Midjourney)
- [ ] Multi-language support
- [ ] Category/tag classification
- [ ] Social media auto-posting
- [ ] Email newsletter
- [ ] Analytics dashboard
- [ ] User comments
- [ ] Search functionality

## 🎯 Tech Stack Summary

**Frontend:**
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript 5

**Backend:**
- Next.js API Routes
- Neon Postgres (Serverless)
- Google Gemini AI
- RSS Parser

**Infrastructure:**
- Vercel (Hosting + Cron Jobs)
- Neon (Database)
- Google AI (Content Processing)

**Total Cost:** $0 - $60/tháng (tùy scale)

---

**🎊 Chúc mừng! Bạn có một AI-powered news platform hoàn chỉnh!**
