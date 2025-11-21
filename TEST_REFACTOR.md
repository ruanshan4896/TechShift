# Hướng Dẫn Test Refactor

## 🚀 Chuẩn bị

1. **Khởi động dev server:**
```bash
cd apps/admin
pnpm dev
```

2. **Kiểm tra database:**
```bash
# Đảm bảo bảng raw_articles đã tồn tại
# Nếu chưa, chạy migration hoặc tạo bảng thủ công
```

---

## ✅ Test Case 1: Duplicate Prevention

### Mục tiêu
Kiểm tra hệ thống có skip bài viết trùng lặp không.

### Các bước
1. Chọn 1 RSS source đang active (VD: source ID = 1)
2. Gọi API process RSS lần 1:
```bash
curl -X POST http://localhost:3001/api/process-rss/1
```

3. Xem response và console log:
```json
{
  "success": true,
  "processed": 10,
  "skipped": 0,
  "errors": 0
}
```

4. Gọi API process RSS lần 2 (cùng source):
```bash
curl -X POST http://localhost:3001/api/process-rss/1
```

5. Xem response:
```json
{
  "success": true,
  "processed": 0,
  "skipped": 10,
  "errors": 0
}
```

### Kết quả mong đợi
- ✅ Lần 1: Xử lý thành công 10 bài
- ✅ Lần 2: Skip 10 bài (không gọi AI)
- ✅ Console log: `⏭️ Skipped duplicate: [URL]`
- ✅ Không tốn quota API Gemini

---

## ✅ Test Case 2: JSON Format & Clean Content

### Mục tiêu
Kiểm tra nội dung lưu DB có sạch không (không chứa JSON string).

### Các bước
1. Process 1 bài viết mới
2. Vào database, query bài viết vừa tạo:
```sql
SELECT title, content, summary 
FROM articles 
ORDER BY created_at DESC 
LIMIT 1;
```

3. Kiểm tra cột `content`:

### Kết quả mong đợi
- ✅ `content` là Markdown sạch:
```markdown
## Tiêu đề H2

Nội dung bài viết...

### Tiêu đề H3

- Bullet point 1
- Bullet point 2
```

- ❌ KHÔNG được chứa JSON:
```json
{
  "title": "...",
  "content": "..."
}
```

- ❌ KHÔNG có conversational filler:
```
Chắc chắn rồi, đây là bài viết...
```

---

## ✅ Test Case 3: Vietnamese Tags

### Mục tiêu
Kiểm tra tags có phải tiếng Việt không.

### Các bước
1. Process 1 bài viết mới
2. Vào database, query tags của bài viết:
```sql
SELECT t.name 
FROM tags t
INNER JOIN article_tags at ON t.id = at.tag_id
INNER JOIN articles a ON at.article_id = a.id
WHERE a.slug = 'slug-bai-viet-moi'
ORDER BY t.name;
```

### Kết quả mong đợi
- ✅ Tags tiếng Việt:
  - "Công nghệ"
  - "Điện thoại"
  - "AI"
  - "Đánh giá"
  - "Tin tức"

- ❌ KHÔNG có tags tiếng Anh:
  - "Technology"
  - "Smartphone"
  - "Music streaming"

---

## ✅ Test Case 4: HTML Entities Decoding

### Mục tiêu
Kiểm tra tiếng Việt có dấu hiển thị đúng không.

### Các bước
1. Tìm 1 RSS feed có HTML entities trong title/content
   - VD: `T&iacute;nh năng mới` → `Tính năng mới`
   - VD: `&#039;` → `'`
   - VD: `&amp;` → `&`

2. Process bài viết đó

3. Kiểm tra trong database:
```sql
SELECT title, content 
FROM articles 
WHERE title LIKE '%Tính năng%';
```

### Kết quả mong đợi
- ✅ Title: "Tính năng mới của iPhone 17"
- ✅ Content: Tiếng Việt có dấu chính xác
- ❌ KHÔNG còn: `&iacute;`, `&#039;`, `&amp;`

---

## 🐛 Debug Tips

### Nếu vẫn có duplicate
```typescript
// Kiểm tra hàm checkArticleExists() trong db.ts
// Đảm bảo query đúng bảng raw_articles
```

### Nếu vẫn có JSON trong content
```typescript
// Kiểm tra console log trong rewriteArticle()
// Xem responseText trước khi parse
console.log('Raw response:', responseText);
```

### Nếu vẫn có tags tiếng Anh
```typescript
// Kiểm tra prompt trong analyzeArticle()
// Đảm bảo có dòng:
// "Generate 5 tags strictly in VIETNAMESE language"
```

### Nếu vẫn có HTML entities
```typescript
// Kiểm tra import he
import { decode as decodeHtmlEntities } from 'he';

// Kiểm tra có gọi decode không
const cleanTitle = decodeHtmlEntities(originalTitle);
```

---

## 📊 Monitoring

### Console Logs cần theo dõi
```
✅ Processing: [Title]
✅   Step A: Analyzing article...
✅   Main keyword: [Keyword]
✅   Suggested tags: [Tag1, Tag2, ...]
✅   Step B: Rewriting content...
✅   Step C: Inserting internal links...
✅   ✓ Saved as draft: [Title]

⏭️  Skipped duplicate: [URL]
```

### Error Logs cần chú ý
```
❌ Error in analyzeArticle: [Error message]
❌ Failed to analyze article: [Details]
❌ Error in rewriteArticle: [Error message]
❌ Failed to rewrite article with AI: [Details]
❌ Invalid JSON structure: missing required fields
```

---

## 🎯 Success Criteria

Refactor thành công khi:
- ✅ Duplicate rate = 0% (lần fetch thứ 2)
- ✅ JSON format errors = 0%
- ✅ Vietnamese tags rate = 100%
- ✅ HTML entities errors = 0%
- ✅ API quota usage giảm 50% (do skip duplicates)

---

**Happy Testing! 🚀**
