# Google Gemini AI Integration Guide

## Tổng quan

Hệ thống tự động xử lý bài viết từ RSS feeds bằng Google Gemini AI:
1. Fetch RSS → Lưu vào `raw_articles` (status: pending)
2. Gemini AI xử lý → Tạo bài viết mới, tóm tắt, tiêu đề
3. Lưu vào `articles` → Hiển thị trên website

## Setup Google Gemini API

### Bước 1: Lấy API Key

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập với Google account
3. Click "Create API Key"
4. Copy API key

### Bước 2: Thêm vào Environment Variables

Thêm vào `.env.local`:

```env
GEMINI_API_KEY="your-api-key-here"
```

**Lưu ý:** API key này là MIỄN PHÍ với quota hào phóng:
- 60 requests/phút
- 1,500 requests/ngày
- Đủ cho hầu hết use cases

## Cách hoạt động

### 1. Fetch RSS (Mỗi 30 phút)

```
Cron Job → /api/fetch-rss → Lưu vào raw_articles (pending)
```

### 2. Process với AI (Mỗi 10 phút)

```
Cron Job → /api/process-articles → Lấy 5 bài pending
  ↓
Gemini AI:
  - Prompt A: Viết lại bài viết (500-800 từ)
  - Prompt B: Tạo tóm tắt + 3 tiêu đề
  ↓
Lưu vào articles → Status: processed
```

### 3. Hiển thị trên Website

Bài viết tự động xuất hiện trên trang chủ!

## API Endpoints

### POST `/api/process-articles`

Xử lý 5 bài viết pending với Gemini AI.

**Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response:**
```json
{
  "success": true,
  "processed": 5,
  "results": [
    {
      "id": 1,
      "originalTitle": "Tiêu đề gốc",
      "newTitle": "Tiêu đề mới từ AI",
      "slug": "tieu-de-moi-tu-ai",
      "status": "success"
    }
  ]
}
```

## Test thủ công

### Option 1: Từ Admin Panel

1. Truy cập: http://localhost:3000/admin/rss
2. Click "🔄 Test Fetch RSS" để lấy bài viết
3. Click "🤖 Test Process Articles (AI)" để xử lý với AI

### Option 2: Từ Terminal

```bash
# Fetch RSS
curl -H "Authorization: Bearer your-secret" \
  http://localhost:3000/api/fetch-rss

# Process với AI
curl -H "Authorization: Bearer your-secret" \
  http://localhost:3000/api/process-articles
```

## Gemini Prompts

### Prompt A: Viết lại bài viết

```
Dựa trên nội dung từ bài viết gốc, hãy viết một bài viết mới:
- Bổ sung thông tin nền
- Giải thích thuật ngữ kỹ thuật
- So sánh với công nghệ tương tự
- Văn phong chuyên nghiệp nhưng dễ hiểu
- 500-800 từ
- Format Markdown
```

### Prompt B: Tạo metadata

```
Từ bài viết trên, hãy:
1. Viết tóm tắt 150-155 ký tự (SEO)
2. Đề xuất 3 tiêu đề hấp dẫn (<60 ký tự)
```

## Workflow hoàn chỉnh

```
1. RSS Feed → raw_articles (pending)
   ↓ 10 phút
2. Gemini AI xử lý
   ↓
3. articles table (published)
   ↓
4. Hiển thị trên website
```

## Monitoring

### Check Database

```sql
-- Xem bài viết pending
SELECT COUNT(*) FROM raw_articles WHERE status = 'pending';

-- Xem bài viết đã xử lý
SELECT COUNT(*) FROM raw_articles WHERE status = 'processed';

-- Xem bài viết lỗi
SELECT * FROM raw_articles WHERE status = 'failed';

-- Xem bài viết mới nhất
SELECT title, published_at FROM articles 
ORDER BY created_at DESC LIMIT 10;
```

### Check Logs

Vercel Dashboard → Project → Logs → Filter by "process-articles"

## Tối ưu

### 1. Batch Processing

Hiện tại: 5 bài/lần (mỗi 10 phút)
→ 30 bài/giờ
→ 720 bài/ngày

Có thể tăng lên 10-20 bài/lần nếu cần.

### 2. Error Handling

- Retry logic: Tự động retry nếu API timeout
- Failed articles: Giữ status 'failed' để review thủ công
- Rate limiting: Respect Gemini API limits

### 3. Content Quality

Gemini AI đảm bảo:
- Không duplicate content
- SEO-friendly
- Dễ đọc, chuyên nghiệp
- Bổ sung thông tin hữu ích

## Cost & Limits

### Gemini API Free Tier

- **Requests:** 60/phút, 1,500/ngày
- **Tokens:** Unlimited (trong free tier)
- **Models:** gemini-pro (text), gemini-pro-vision (image)

### Ước tính sử dụng

- 5 bài/10 phút = 30 bài/giờ = 720 bài/ngày
- Mỗi bài: 2 API calls (Prompt A + B)
- Total: 1,440 calls/ngày

**Kết luận:** Vừa đủ với free tier! 🎉

## Troubleshooting

**Lỗi: "Gemini API key not configured"**
→ Thêm `GEMINI_API_KEY` vào `.env.local`

**Lỗi: "Rate limit exceeded"**
→ Giảm số bài xử lý mỗi lần (5 → 3)
→ Tăng interval cron job (10 phút → 15 phút)

**Bài viết chất lượng kém**
→ Cải thiện prompts trong `lib/gemini.ts`
→ Thêm examples vào prompts

**Slug bị duplicate**
→ Hệ thống tự động thêm số vào slug nếu trùng

## Next Steps

Có thể mở rộng:
- [ ] Tự động fetch cover image từ article content
- [ ] Phân loại category/tags tự động
- [ ] Dịch bài viết sang tiếng Anh
- [ ] Tạo social media posts
- [ ] Generate meta keywords
- [ ] A/B testing titles

## Resources

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Pricing](https://ai.google.dev/pricing)
- [Rate Limits](https://ai.google.dev/docs/rate_limits)
