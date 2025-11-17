# RSS Auto-Fetch - Quick Start

## 🚀 Setup trong 3 bước

### Bước 1: Seed RSS Tables (30 giây)

```bash
npm run seed:rss
```

Kết quả:
```
✓ Tables created
✓ Inserted: VnExpress Công nghệ
✓ Inserted: Genk - Công nghệ
✓ Inserted: TechCrunch
```

### Bước 2: Truy cập Admin Panel

Mở: **http://localhost:3000/admin/rss**

Đăng nhập: `admin123`

### Bước 3: Test Fetch

Click nút **"🔄 Test Fetch RSS"**

Hệ thống sẽ fetch bài viết từ 3 nguồn RSS!

## ✅ Xong!

Bây giờ bạn có:
- 3 nguồn RSS đang hoạt động
- Admin panel để quản lý
- API endpoint để fetch tự động
- Cron job chạy mỗi 30 phút (trên Vercel)

## 📊 Kiểm tra Database

Vào Neon Console → SQL Editor:

```sql
-- Xem các nguồn RSS
SELECT * FROM rss_sources;

-- Xem bài viết đã fetch
SELECT * FROM raw_articles ORDER BY publication_date DESC LIMIT 10;

-- Đếm bài viết theo nguồn
SELECT 
  rs.name, 
  COUNT(ra.id) as total_articles
FROM rss_sources rs
LEFT JOIN raw_articles ra ON rs.id = ra.source_id
GROUP BY rs.name;
```

## 🔧 Thêm nguồn RSS mới

1. Vào Admin Panel
2. Nhập tên: "Tên website"
3. Nhập RSS URL: "https://example.com/rss"
4. Click "Thêm mới"

## 🌐 Nguồn RSS hay

**Tiếng Việt:**
- VnExpress: `https://vnexpress.net/rss/so-hoa.rss`
- Genk: `https://genk.vn/cntt.rss`
- Zing: `https://zingnews.vn/cong-nghe.rss`

**Tiếng Anh:**
- TechCrunch: `https://techcrunch.com/feed/`
- The Verge: `https://www.theverge.com/rss/index.xml`
- Hacker News: `https://hnrss.org/frontpage`

## 🚀 Deploy lên Vercel

1. Push code lên GitHub
2. Deploy trên Vercel
3. Thêm Environment Variables:
   - `DATABASE_URL` (từ Neon)
   - `CRON_SECRET` (tạo random string)
   - `NEXT_PUBLIC_ADMIN_PASSWORD` (đổi từ admin123)
   - `NEXT_PUBLIC_CRON_SECRET` (giống CRON_SECRET)

4. Cron job sẽ tự động chạy mỗi 30 phút!

## 📝 Next Steps

Sau khi có raw articles, bạn có thể:
- Tạo AI processor để tóm tắt nội dung
- Auto-generate slug và cover image
- Tự động publish lên trang chủ
- Gửi notification khi có bài mới

Xem chi tiết trong `RSS_GUIDE.md`
