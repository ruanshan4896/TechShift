# Tech News - Website Tin Tức Công Nghệ

Website tin tức công nghệ được xây dựng với Next.js 15, Tailwind CSS và Vercel Postgres.

## Công nghệ sử dụng

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Neon Postgres (Serverless)
- **Language**: TypeScript

## Tính năng

- ✅ Trang chủ hiển thị 10 bài viết mới nhất (SSG với ISR)
- ✅ Trang chi tiết bài viết với URL động
- ✅ Tối ưu SEO với metadata động
- ✅ Responsive design
- ✅ Image optimization với Next.js Image
- ✅ **RSS Auto-Fetch**: Thu thập tin tức tự động từ RSS feeds
- ✅ **Admin Panel**: Quản lý nguồn RSS
- ✅ **Cron Jobs**: Tự động fetch mỗi 30 phút (Vercel)
- ✅ **AI Content Processing**: Google Gemini tự động viết lại bài viết
- ✅ **Auto-Publish**: Bài viết tự động xuất hiện trên website
- ✅ **SEO Optimization**: AI tạo tiêu đề và tóm tắt chuẩn SEO
- ✅ **Internal Linking**: Tự động xây dựng liên kết nội bộ giữa các bài viết
- ✅ **Keyword Extraction**: AI trích xuất keywords và tìm bài viết liên quan

## Cài đặt

1. Clone repository và cài đặt dependencies:

```bash
npm install
```

2. Cấu hình Neon Database:

Tạo tài khoản miễn phí tại [Neon](https://neon.tech) và lấy connection string.

Cập nhật file `.env.local`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

Xem chi tiết trong file `SETUP.md`

3. Tạo bảng và seed dữ liệu mẫu:

```bash
npm run seed        # Tạo bảng articles và thêm 5 bài mẫu
npm run seed:rss    # Tạo bảng RSS và thêm 3 nguồn RSS
```

4. Cấu hình Google Gemini API (tùy chọn - cho AI processing):

Lấy API key miễn phí tại [Google AI Studio](https://makersuite.google.com/app/apikey)

Thêm vào `.env.local`:
```env
GEMINI_API_KEY="your-api-key-here"
```

5. Chạy development server:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

6. Truy cập Admin Panel (tùy chọn):

```
http://localhost:3000/admin/rss
Password: admin123
```

## Cấu trúc dự án

```
tech-news/
├── app/
│   ├── layout.tsx          # Root layout với metadata
│   ├── page.tsx            # Trang chủ (SSG)
│   ├── not-found.tsx       # Trang 404
│   ├── posts/
│   │   └── [slug]/
│   │       └── page.tsx    # Trang chi tiết bài viết (SSR)
│   ├── admin/
│   │   └── rss/
│   │       └── page.tsx    # Admin panel quản lý RSS
│   └── api/
│       ├── fetch-rss/
│       │   └── route.ts    # API fetch RSS (cron job)
│       └── rss-sources/
│           └── route.ts    # API quản lý RSS sources
├── lib/
│   └── db.ts              # Database functions
├── scripts/
│   ├── seed.ts            # Script seed articles
│   └── seed-rss.ts        # Script seed RSS sources
├── vercel.json            # Cron job configuration
└── .env.local             # Environment variables

```

## Database Schema

### Bảng `articles`
- `id` (SERIAL PRIMARY KEY)
- `title` (TEXT)
- `slug` (TEXT UNIQUE)
- `content` (TEXT)
- `summary` (TEXT)
- `cover_image_url` (TEXT)
- `published_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

### Bảng `rss_sources`
- `id` (SERIAL PRIMARY KEY)
- `name` (TEXT) - Tên nguồn RSS
- `rss_url` (TEXT UNIQUE) - URL của RSS feed
- `is_active` (BOOLEAN) - Bật/tắt nguồn
- `created_at` (TIMESTAMP)

### Bảng `raw_articles`
- `id` (SERIAL PRIMARY KEY)
- `source_id` (INTEGER) - Foreign key → rss_sources
- `title` (TEXT)
- `original_url` (TEXT UNIQUE)
- `original_content` (TEXT)
- `publication_date` (TIMESTAMP)
- `status` (TEXT) - 'pending' | 'processed' | 'failed'
- `created_at` (TIMESTAMP)

## Deploy lên Vercel

1. Push code lên GitHub
2. Import project vào Vercel
3. Thêm `DATABASE_URL` vào Environment Variables (lấy từ Neon)
4. Deploy và tận hưởng!

## Tối ưu

- **SSG với ISR**: Trang chủ được generate tại build time và revalidate mỗi giờ
- **Image Optimization**: Sử dụng Next.js Image component
- **SEO**: Dynamic metadata cho mỗi trang
- **Performance**: Connection pooling với Neon serverless driver
