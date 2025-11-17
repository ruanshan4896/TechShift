# Deployment Guide - Tech News

## Pre-deployment Checklist

- [x] Database schema created
- [x] Sample data seeded
- [x] Environment variables configured
- [x] RSS sources added
- [x] Admin panel tested
- [x] API endpoints working
- [x] Cron job configured

## Deploy lên Vercel

### Bước 1: Push lên GitHub

```bash
git add .
git commit -m "Add RSS auto-fetch system"
git push origin main
```

### Bước 2: Import vào Vercel

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import repository từ GitHub
4. Vercel tự động detect Next.js

### Bước 3: Configure Environment Variables

Thêm các biến sau trong Vercel Project Settings → Environment Variables:

```env
# Database (từ Neon)
DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/db?sslmode=require

# Security
CRON_SECRET=your-random-secret-key-here
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_CRON_SECRET=your-random-secret-key-here
```

**Quan trọng:**
- Dùng password mạnh cho production
- `CRON_SECRET` nên là random string dài (32+ ký tự)
- Apply cho cả 3 environments: Production, Preview, Development

### Bước 4: Deploy

Click "Deploy" và đợi ~2 phút.

### Bước 5: Seed Database trên Production

Sau khi deploy xong:

**Option 1: Từ Local**
```bash
# Thay DATABASE_URL bằng production URL
DATABASE_URL="production-url" npm run seed
DATABASE_URL="production-url" npm run seed:rss
```

**Option 2: Từ Neon Console**
1. Vào Neon Console → SQL Editor
2. Copy nội dung từ `scripts/seed.ts` và `scripts/seed-rss.ts`
3. Chạy các SQL commands thủ công

### Bước 6: Verify Cron Job

1. Vào Vercel Project → Settings → Cron Jobs
2. Xem cron job `/api/fetch-rss` đã được tạo
3. Schedule: `*/30 * * * *` (mỗi 30 phút)

**Test Cron Job:**
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.vercel.app/api/fetch-rss
```

### Bước 7: Test Website

1. Truy cập `https://your-domain.vercel.app`
2. Kiểm tra trang chủ hiển thị bài viết
3. Click vào bài viết để xem chi tiết
4. Truy cập `/admin/rss` để test admin panel

## Post-deployment

### Monitor Cron Jobs

Vercel Dashboard → Project → Logs → Filter by "Cron"

Xem logs của cron job để đảm bảo fetch RSS thành công.

### Check Database

Vào Neon Console → SQL Editor:

```sql
-- Xem số lượng bài viết đã fetch
SELECT COUNT(*) FROM raw_articles;

-- Xem bài viết mới nhất
SELECT title, publication_date, status 
FROM raw_articles 
ORDER BY publication_date DESC 
LIMIT 10;

-- Thống kê theo nguồn
SELECT 
  rs.name,
  COUNT(ra.id) as total,
  COUNT(CASE WHEN ra.status = 'pending' THEN 1 END) as pending
FROM rss_sources rs
LEFT JOIN raw_articles ra ON rs.id = ra.source_id
GROUP BY rs.name;
```

### Update RSS Sources

Truy cập: `https://your-domain.vercel.app/admin/rss`

Thêm/sửa/xóa nguồn RSS theo nhu cầu.

## Custom Domain (Optional)

1. Vercel Dashboard → Project → Settings → Domains
2. Add domain của bạn
3. Configure DNS theo hướng dẫn
4. Vercel tự động setup SSL certificate

## Monitoring & Alerts

### Vercel Analytics (Free)

Tự động enabled, xem tại:
- Dashboard → Project → Analytics

### Uptime Monitoring

Dùng các service miễn phí:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

### Error Tracking

Tích hợp Sentry (optional):
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Scaling

### Database
- Neon Free: 0.5 GB storage
- Neon Pro: $19/month - 10 GB storage
- Neon Scale: Custom pricing

### Vercel
- Hobby: Free - 100 GB bandwidth
- Pro: $20/month - 1 TB bandwidth
- Enterprise: Custom pricing

## Backup Strategy

### Database Backup

Neon tự động backup, nhưng nên export định kỳ:

```bash
# Export từ Neon
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Code Backup

- GitHub repository (primary)
- Vercel deployment history (automatic)

## Security Checklist

- [x] HTTPS enabled (Vercel automatic)
- [x] Environment variables secured
- [x] Admin panel password protected
- [x] API endpoints authenticated
- [x] Database connection encrypted
- [x] CORS configured
- [x] Rate limiting (Vercel automatic)

## Troubleshooting

**Cron job không chạy:**
- Chỉ hoạt động trên production
- Kiểm tra `vercel.json` syntax
- Xem logs trong Vercel Dashboard

**Database connection error:**
- Verify `DATABASE_URL` đúng
- Check Neon database status
- Ensure connection pooling enabled

**Admin panel không login được:**
- Check `NEXT_PUBLIC_ADMIN_PASSWORD`
- Clear browser cache
- Try incognito mode

## Support

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Vercel Community](https://github.com/vercel/next.js/discussions)

---

🎉 **Chúc mừng! Website của bạn đã live!**
