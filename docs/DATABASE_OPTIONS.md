# So sánh các lựa chọn Database cho Next.js

## 1. Neon (Đang sử dụng) ⭐ Khuyên dùng

**Ưu điểm:**
- ✅ Miễn phí: 0.5 GB storage, 3 GB transfer/tháng
- ✅ Serverless: Auto-scale, chỉ trả tiền khi dùng
- ✅ Branching: Tạo database branch cho preview deployments
- ✅ Connection pooling tích hợp
- ✅ Tốc độ cao, độ trễ thấp
- ✅ Tích hợp tốt với Vercel

**Nhược điểm:**
- ⚠️ Free tier có giới hạn storage
- ⚠️ Cần tài khoản riêng (không tích hợp trực tiếp trong Vercel)

**Setup:**
```bash
npm install @neondatabase/serverless
```

**Connection:**
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require"
```

---

## 2. Supabase

**Ưu điểm:**
- ✅ Miễn phí: 500 MB storage, 2 GB transfer/tháng
- ✅ Postgres đầy đủ tính năng
- ✅ Có dashboard quản lý tốt
- ✅ Realtime subscriptions
- ✅ Authentication tích hợp
- ✅ Storage cho files

**Nhược điểm:**
- ⚠️ Phức tạp hơn nếu chỉ cần database
- ⚠️ Free tier có giới hạn connections

**Setup:**
```bash
npm install @supabase/supabase-js
```

---

## 3. PlanetScale

**Ưu điểm:**
- ✅ MySQL serverless
- ✅ Branching workflow tuyệt vời
- ✅ Không cần migrations truyền thống
- ✅ Tốc độ cao

**Nhược điểm:**
- ⚠️ Không còn free tier (từ 2024)
- ⚠️ MySQL thay vì Postgres
- ⚠️ Không hỗ trợ foreign keys

---

## 4. Railway

**Ưu điểm:**
- ✅ Hỗ trợ nhiều loại database (Postgres, MySQL, Redis, MongoDB)
- ✅ Setup đơn giản
- ✅ Dashboard đẹp

**Nhược điểm:**
- ⚠️ Free tier: $5 credit/tháng (có thể hết nhanh)
- ⚠️ Cần theo dõi usage

---

## 5. Vercel Postgres (Đã ngừng)

Vercel đã ngừng cung cấp Postgres trực tiếp. Thay vào đó họ khuyên dùng:
- Neon (khuyên dùng nhất)
- Supabase
- PlanetScale

---

## Kết luận

**Cho dự án này (Tech News):**
- **Neon** là lựa chọn tốt nhất vì:
  - Miễn phí và đủ dùng
  - Serverless, tối ưu cho Next.js
  - Connection pooling tốt
  - Được Vercel khuyên dùng

**Nếu cần thêm tính năng:**
- **Supabase**: Nếu cần auth, realtime, storage
- **Railway**: Nếu cần nhiều loại database khác nhau

**Cho production lớn:**
- Neon Pro: $19/tháng
- Supabase Pro: $25/tháng
- Hoặc tự host Postgres trên AWS/DigitalOcean
