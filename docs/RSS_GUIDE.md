# Hướng dẫn Hệ thống RSS Auto-Fetch

## Tổng quan

Hệ thống tự động thu thập tin tức từ các nguồn RSS và lưu vào database để xử lý sau.

## Cấu trúc Database

### Bảng `rss_sources`
- `id`: Primary key
- `name`: Tên nguồn (VD: VnExpress, TechCrunch)
- `rss_url`: URL của RSS feed
- `is_active`: Bật/tắt nguồn
- `created_at`: Thời gian tạo

### Bảng `raw_articles`
- `id`: Primary key
- `source_id`: Foreign key → rss_sources
- `title`: Tiêu đề bài viết
- `original_url`: URL gốc (unique)
- `original_content`: Nội dung thô từ RSS
- `publication_date`: Ngày xuất bản
- `status`: 'pending' | 'processed' | 'failed'
- `created_at`: Thời gian tạo

## Setup

### 1. Seed RSS Tables

```bash
npm run seed:rss
```

Tạo bảng và thêm 3 nguồn RSS mẫu:
- VnExpress Công nghệ
- Genk - Công nghệ  
- TechCrunch

### 2. Cấu hình Environment Variables

Thêm vào `.env.local`:

```env
CRON_SECRET="your-secret-key-here"
NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
NEXT_PUBLIC_CRON_SECRET="your-secret-key-here"
```

**Quan trọng:** Đổi mật khẩu trên production!

### 3. Truy cập Admin Panel

Mở: http://localhost:3000/admin/rss

Đăng nhập với password: `admin123`

## Sử dụng

### Quản lý RSS Sources

1. **Thêm nguồn mới:**
   - Nhập tên nguồn
   - Nhập RSS URL
   - Chọn Active/Inactive
   - Click "Thêm mới"

2. **Sửa nguồn:**
   - Click "Sửa" trên nguồn cần sửa
   - Cập nhật thông tin
   - Click "Cập nhật"

3. **Xóa nguồn:**
   - Click "Xóa"
   - Confirm

4. **Test Fetch:**
   - Click "🔄 Test Fetch RSS"
   - Xem kết quả fetch

### API Endpoints

#### GET `/api/fetch-rss`
Thu thập bài viết từ tất cả nguồn active.

**Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response:**
```json
{
  "success": true,
  "totalFetched": 50,
  "totalNew": 12,
  "sources": [
    {
      "source": "VnExpress",
      "fetched": 20,
      "new": 5
    }
  ]
}
```

#### GET `/api/rss-sources`
Lấy danh sách tất cả nguồn RSS.

#### POST `/api/rss-sources`
Tạo nguồn RSS mới.

#### PUT `/api/rss-sources/[id]`
Cập nhật nguồn RSS.

#### DELETE `/api/rss-sources/[id]`
Xóa nguồn RSS.

## Vercel Cron Job

File `vercel.json` đã được cấu hình để chạy fetch RSS mỗi 30 phút:

```json
{
  "crons": [
    {
      "path": "/api/fetch-rss",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

**Lưu ý:** Cron jobs chỉ hoạt động trên Vercel production, không chạy local.

### Test Local

Để test local, gọi API thủ công:

```bash
curl -H "Authorization: Bearer your-secret-key" \
  http://localhost:3000/api/fetch-rss
```

## Workflow

1. **Cron job chạy mỗi 30 phút** → Gọi `/api/fetch-rss`
2. **API fetch RSS** → Lấy bài viết từ các nguồn active
3. **Kiểm tra duplicate** → Chỉ lưu bài viết mới (check `original_url`)
4. **Lưu vào `raw_articles`** → Status = 'pending'
5. **Xử lý sau** → Có thể dùng AI để tóm tắt, dịch, format...

## Nguồn RSS Tiếng Việt

Một số nguồn RSS công nghệ phổ biến:

- **VnExpress:** https://vnexpress.net/rss/so-hoa.rss
- **Genk:** https://genk.vn/cntt.rss
- **Zing News:** https://zingnews.vn/cong-nghe.rss
- **ICTNews:** https://ictnews.vn/rss.aspx

## Nguồn RSS Quốc tế

- **TechCrunch:** https://techcrunch.com/feed/
- **The Verge:** https://www.theverge.com/rss/index.xml
- **Ars Technica:** https://feeds.arstechnica.com/arstechnica/index
- **Hacker News:** https://hnrss.org/frontpage

## Troubleshooting

**Lỗi: "Unauthorized"**
→ Kiểm tra `CRON_SECRET` trong headers

**Không fetch được bài viết**
→ Kiểm tra RSS URL có hợp lệ không
→ Thử truy cập URL trực tiếp trên browser

**Duplicate articles**
→ Hệ thống tự động check `original_url`, không lo duplicate

## Next Steps

Sau khi có `raw_articles`, bạn có thể:

1. Tạo API để xử lý pending articles
2. Dùng AI (OpenAI, Claude) để tóm tắt nội dung
3. Tự động tạo slug và cover image
4. Chuyển từ `raw_articles` → `articles` table
5. Tự động publish lên website
