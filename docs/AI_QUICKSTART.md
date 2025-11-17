# AI Content Processing - Quick Start

## 🚀 Setup trong 3 bước

### Bước 1: Lấy Gemini API Key (2 phút)

1. Vào [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập Google
3. Click "Create API Key"
4. Copy key

### Bước 2: Thêm vào .env.local

```env
GEMINI_API_KEY="your-api-key-here"
```

### Bước 3: Test!

1. Mở Admin Panel: http://localhost:3000/admin/rss
2. Click "🔄 Test Fetch RSS" (lấy bài viết từ RSS)
3. Click "🤖 Test Process Articles (AI)" (xử lý với AI)

## ✅ Xong!

Sau vài giây, bài viết mới sẽ xuất hiện trên trang chủ!

## 🎯 Workflow tự động

```
Mỗi 30 phút: Fetch RSS → raw_articles (pending)
    ↓
Mỗi 10 phút: AI xử lý → articles (published)
    ↓
Tự động hiển thị trên website!
```

## 🔍 Kiểm tra kết quả

### Xem trong Database (Neon Console)

```sql
-- Bài viết đang chờ xử lý
SELECT COUNT(*) FROM raw_articles WHERE status = 'pending';

-- Bài viết đã xử lý
SELECT title, created_at FROM articles 
ORDER BY created_at DESC LIMIT 5;
```

### Xem trên Website

Truy cập: http://localhost:3000

Bài viết mới sẽ xuất hiện đầu tiên!

## 💡 AI làm gì?

1. **Viết lại bài viết:**
   - Bổ sung thông tin nền
   - Giải thích thuật ngữ kỹ thuật
   - So sánh với công nghệ tương tự
   - 500-800 từ, dễ đọc

2. **Tạo metadata:**
   - Tóm tắt SEO (155 ký tự)
   - 3 tiêu đề hấp dẫn
   - Slug tự động

3. **Tự động publish:**
   - Không cần review thủ công
   - Hiển thị ngay trên website

## 📊 Giới hạn Free Tier

- **60 requests/phút**
- **1,500 requests/ngày**
- **Unlimited tokens**

→ Đủ xử lý ~720 bài/ngày! 🎉

## 🚀 Deploy lên Vercel

1. Push code lên GitHub
2. Deploy trên Vercel
3. Thêm Environment Variable:
   ```
   GEMINI_API_KEY=your-key
   ```
4. Cron jobs tự động chạy!

## 🎨 Tùy chỉnh

Muốn thay đổi cách AI viết?

Edit file: `tech-news/lib/gemini.ts`

Thay đổi prompts theo ý bạn!

## ⚠️ Lưu ý

- API key miễn phí nhưng có giới hạn
- Mỗi lần test tốn 2 API calls
- Production nên monitor usage
- Có thể upgrade lên paid nếu cần

## 🎉 Kết quả

Website tin tức tự động:
- ✅ Fetch RSS mỗi 30 phút
- ✅ AI viết lại bài mỗi 10 phút
- ✅ Tự động publish
- ✅ SEO-optimized
- ✅ Không cần can thiệp thủ công!

**Chúc mừng! Bạn có một AI content machine! 🤖✨**
