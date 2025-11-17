# Quick Start Guide

## Bước 1: Setup Database (5 phút)

1. Truy cập [neon.tech](https://neon.tech) và đăng ký miễn phí
2. Tạo project mới, chọn region **Singapore** (gần VN nhất)
3. Copy **Pooled connection string**
4. Paste vào file `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/db?sslmode=require"
```

## Bước 2: Seed Database

```bash
npm run seed
```

Bạn sẽ thấy:
```
✓ Table created
✓ Inserted: AI và Machine Learning...
✓ Inserted: Next.js 15...
✓ Seeding completed successfully!
```

## Bước 3: Chạy Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) 🎉

## Xong rồi!

Website đã có:
- ✅ 5 bài viết mẫu về công nghệ
- ✅ Trang chủ với danh sách bài viết
- ✅ Trang chi tiết bài viết
- ✅ SEO optimization
- ✅ Responsive design

## Troubleshooting

**Lỗi: "relation articles does not exist"**
→ Chạy `npm run seed` để tạo bảng

**Lỗi: "No database connection string"**
→ Kiểm tra file `.env.local` có `DATABASE_URL` chưa

**Lỗi: Image hostname not configured**
→ Đã fix trong `next.config.ts`

## Next Steps

- Thêm bài viết mới vào database (dùng Neon SQL Editor)
- Customize design trong `app/page.tsx` và `app/posts/[slug]/page.tsx`
- Deploy lên Vercel (xem `SETUP.md`)
