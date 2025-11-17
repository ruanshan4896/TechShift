# Hướng dẫn Setup Neon Database

## Bước 1: Tạo Neon Database (Miễn phí)

1. Truy cập [Neon Console](https://console.neon.tech)
2. Đăng ký/Đăng nhập (có thể dùng GitHub)
3. Click "Create a project"
4. Đặt tên project (ví dụ: `tech-news`)
5. Chọn region gần bạn (ví dụ: Singapore cho VN)
6. Click "Create project"

## Bước 2: Lấy Connection String

1. Sau khi tạo project, bạn sẽ thấy connection string
2. Copy "Connection string" (chọn "Pooled connection")
3. Paste vào file `.env.local` trong project

Ví dụ:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**Lưu ý:** Neon cung cấp 2 loại connection:
- **Pooled connection** (khuyên dùng): Tối ưu cho serverless
- **Direct connection**: Cho các ứng dụng long-running

## Bước 3: Seed Database

Chạy lệnh sau để tạo bảng và thêm dữ liệu mẫu:

```bash
npm run seed
```

Bạn sẽ thấy output:
```
Creating articles table...
✓ Table created
Inserting sample articles...
✓ Inserted: AI và Machine Learning: Xu hướng công nghệ 2025
✓ Inserted: Next.js 15: Những tính năng mới đáng chú ý
✓ Inserted: Tailwind CSS 4.0: Thiết kế web hiện đại
✓ Inserted: TypeScript 5.5: An toàn kiểu dữ liệu tốt hơn
✓ Inserted: Vercel Postgres: Database cho ứng dụng serverless
✓ Seeding completed successfully!
```

## Bước 4: Chạy Development Server

```bash
npm run dev
```

Truy cập http://localhost:3000 để xem website.

## Kiểm tra Database

Bạn có thể kiểm tra dữ liệu trong Neon Console:
1. Vào [Neon Console](https://console.neon.tech)
2. Chọn project của bạn
3. Tab "Tables" → Chọn bảng "articles"
4. Hoặc dùng "SQL Editor" để chạy query:
```sql
SELECT * FROM articles ORDER BY published_at DESC;
```

## Deploy lên Vercel

1. Push code lên GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Import project vào Vercel:
   - Vào Vercel Dashboard → "Add New" → "Project"
   - Import repository từ GitHub
   - Vercel sẽ tự động detect Next.js

3. Thêm Environment Variables:
   - Trong project settings → "Environment Variables"
   - Thêm `DATABASE_URL` với giá trị từ Neon
   - Apply cho Production, Preview, và Development

4. Deploy:
   - Click "Deploy"
   - Sau khi deploy xong, database đã sẵn sàng (bảng đã được tạo từ seed local)

## Lưu ý

- File `.env.local` không được commit lên Git (đã có trong .gitignore)
- Trên production, environment variables được quản lý bởi Vercel
- ISR revalidate: Trang chủ sẽ rebuild mỗi giờ (3600 giây)
- Neon Free tier: 0.5 GB storage, 3 GB data transfer/tháng (đủ cho hầu hết dự án nhỏ)

## Tại sao chọn Neon?

- ✅ **Miễn phí**: Free tier hào phóng
- ✅ **Serverless**: Tự động scale, chỉ trả tiền khi dùng
- ✅ **Tích hợp tốt**: Được Vercel khuyên dùng
- ✅ **Branching**: Tạo database branch cho mỗi preview deployment
- ✅ **Fast**: Connection pooling tối ưu cho serverless
