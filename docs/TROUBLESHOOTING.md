# Troubleshooting Guide

## Vấn đề đã giải quyết

### ✅ Gemini API Model Name

**Lỗi:**
```
[404 Not Found] models/gemini-pro is not found
```

**Nguyên nhân:** Google đã cập nhật model names

**Giải pháp:** Dùng `gemini-2.5-flash` (model mới nhất)

```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
```

### ✅ Bài viết không xuất hiện sau khi process

**Kiểm tra:**
1. Check database status:
   ```bash
   npm run check
   ```

2. Xem logs trong dev server

3. Verify API key:
   ```bash
   npm run list:models
   ```

**Giải pháp:**
- Đảm bảo `GEMINI_API_KEY` đúng
- Model name phải là `gemini-2.5-flash`
- Restart dev server sau khi đổi code

## Các lỗi thường gặp

### 1. Database Connection Timeout

**Lỗi:**
```
Connect Timeout Error
```

**Nguyên nhân:** Neon free tier sleep sau 5 phút không hoạt động

**Giải pháp:**
- Refresh trang để wake up database
- Hoặc upgrade lên Neon Pro ($19/tháng)

### 2. Hydration Mismatch

**Lỗi:**
```
A tree hydrated but some attributes didn't match
```

**Nguyên nhân:** Browser extensions thêm attributes vào DOM

**Giải pháp:** Đã thêm `suppressHydrationWarning` trong layout.tsx

### 3. API Rate Limit

**Lỗi:**
```
Rate limit exceeded
```

**Giải pháp:**
- Gemini free: 60 requests/phút
- Giảm số bài xử lý mỗi lần (5 → 3)
- Tăng interval cron job (10 phút → 15 phút)

### 4. Slug Duplicate

**Lỗi:**
```
Duplicate key value violates unique constraint
```

**Giải pháp:** Hệ thống tự động thêm số vào slug nếu trùng

### 5. Failed Articles

**Kiểm tra:**
```sql
SELECT * FROM raw_articles WHERE status = 'failed';
```

**Giải pháp:**
- Xem logs để biết lỗi cụ thể
- Có thể reset status về 'pending' để retry:
  ```sql
  UPDATE raw_articles SET status = 'pending' WHERE id = X;
  ```

## Commands hữu ích

```bash
# Kiểm tra articles
npm run check

# Test AI với 1 bài
npm run test:ai

# List available models
npm run list:models

# Seed database
npm run seed
npm run seed:rss
```

## Monitoring

### Check Logs
```bash
# Dev server logs
tail -f .next/dev/server.log

# Vercel logs (production)
vercel logs
```

### Check Database
```sql
-- Pending articles
SELECT COUNT(*) FROM raw_articles WHERE status = 'pending';

-- Failed articles
SELECT COUNT(*) FROM raw_articles WHERE status = 'failed';

-- Recent published
SELECT title, created_at FROM articles 
ORDER BY created_at DESC LIMIT 5;
```

## Performance Tips

1. **Batch size:** 5 bài/lần là optimal
2. **Cron interval:** 10 phút cho process, 30 phút cho fetch
3. **ISR revalidate:** 3600 giây (1 giờ) cho trang chủ

## Support

Nếu vẫn gặp vấn đề:
1. Check logs trong dev server
2. Run `npm run check` để xem database
3. Verify environment variables
4. Restart dev server
5. Clear `.next` folder: `rm -rf .next`

## Useful SQL Queries

```sql
-- Reset failed articles to pending
UPDATE raw_articles 
SET status = 'pending' 
WHERE status = 'failed';

-- Delete old articles
DELETE FROM articles 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Count by source
SELECT rs.name, COUNT(ra.id) as total
FROM rss_sources rs
LEFT JOIN raw_articles ra ON rs.id = ra.source_id
GROUP BY rs.name;
```
