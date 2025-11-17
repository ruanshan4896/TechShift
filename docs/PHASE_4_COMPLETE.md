# Phase 4: Internal Linking System - HOÀN THÀNH ✅

## Tổng quan

Đã tích hợp thành công hệ thống tự động xây dựng liên kết nội bộ (Internal Linking) để tối ưu SEO.

## Tính năng đã hoàn thành

### 1. Keyword Extraction ✅
- Gemini AI trích xuất 5-7 keywords quan trọng
- Phân tích tiêu đề và nội dung
- Ưu tiên: tên công nghệ, sản phẩm, công ty, khái niệm kỹ thuật

**Code:** `lib/gemini.ts` - `extractKeywords()`

### 2. Related Articles Search ✅
- Tìm kiếm bài viết liên quan theo keyword
- Search trong title và content (ILIKE)
- Loại trừ bài viết hiện tại
- Limit 1-2 bài/keyword

**Code:** `lib/db.ts` - `findRelatedArticles()`

### 3. Auto Link Insertion ✅
- Tìm lần xuất hiện đầu tiên của keyword
- Thay thế bằng `<a>` tag
- Giới hạn max 4 links/bài
- Anchor text tự nhiên

**Code:** `lib/internal-linking.ts` - `buildInternalLinks()`

### 4. Content Update ✅
- Lưu content đã có links vào database
- Update sau khi insert article
- Không ảnh hưởng đến bài viết cũ

**Code:** `lib/db.ts` - `updateArticleContent()`

### 5. HTML Rendering ✅
- Component mới để render HTML
- Support `dangerouslySetInnerHTML`
- Giữ nguyên markdown formatting

**Code:** `components/ArticleContent.tsx`

### 6. CSS Styling ✅
- Class `.internal-link` cho links
- Underline dotted màu xanh
- Hover effect

**Code:** `app/globals.css`

## Workflow hoàn chỉnh

```
Bài viết mới (từ RSS)
    ↓
AI viết lại nội dung (Gemini)
    ↓
Insert vào database
    ↓
Extract keywords (Gemini) ← NEW
    ↓
Find related articles (Database) ← NEW
    ↓
Build internal links (4 max) ← NEW
    ↓
Update content với links ← NEW
    ↓
Publish lên website
```

## Ví dụ thực tế

### Input
```
Bài viết: "Hố đen nuốt sao: Vụ nổ ánh sáng kỷ lục..."
```

### Processing
```
Keywords extracted: 5
  1. Hố đen
  2. Ngôi sao
  3. Vụ nổ ánh sáng
  4. Mặt Trời
  5. Giới hạn Roche

Related articles found:
  - "Chụp ảnh lỗ đen..." (keyword: Hố đen)
  - "Thần Châu 20..." (keyword: Mặt Trời)

Internal links added: 2
```

### Output
```html
Khi <a href="/posts/chup-anh-lo-den..." class="internal-link">hố đen</a> 
nuốt chửng một ngôi sao, năng lượng giải phóng tương đương 
10 nghìn tỷ <a href="/posts/than-chau-20..." class="internal-link">Mặt Trời</a>...
```

## API Response mới

```json
{
  "success": true,
  "processed": 5,
  "results": [
    {
      "id": 90,
      "originalTitle": "Hố đen nuốt sao...",
      "newTitle": "Hố đen nuốt sao: Vụ nổ ánh sáng...",
      "slug": "ho-den-nuot-sao-vu-no-anh-sang...",
      "internalLinks": 2,
      "keywords": ["Hố đen", "Ngôi sao", "Mặt Trời"],
      "status": "success"
    }
  ]
}
```

## Testing

### Test keyword extraction
```bash
npm run test:links
```

### Test full workflow
```bash
# Via admin panel
http://localhost:3000/admin/rss
→ Click "🤖 Test Process Articles (AI)"

# Via API
curl -H "Authorization: Bearer secret" \
  http://localhost:3000/api/process-articles
```

## SEO Benefits

### 1. Link Juice Distribution
- Authority truyền giữa các trang
- Tăng ranking cho cả 2 trang

### 2. Better Crawlability
- Google bot dễ crawl toàn bộ site
- Index nhiều trang hơn

### 3. User Experience
- Người dùng tìm nội dung liên quan dễ dàng
- Tăng page views
- Giảm bounce rate

### 4. Keyword Relevance
- Anchor text chứa keywords
- Tăng topical authority

## Performance Impact

### API Calls thêm
- 1 call extract keywords (~2s)
- 5-7 calls find related (~1s)
- **Total thêm: ~3-5s/bài**

### Database Queries thêm
- 5-7 SELECT queries (find related)
- 1 UPDATE query (update content)
- **Total: ~8 queries/bài**

### Acceptable vì:
- Chạy background (cron job)
- Không ảnh hưởng user experience
- SEO benefits > performance cost

## Configuration

### Số lượng links
```typescript
// app/api/process-articles/route.ts
const contentWithLinks = await buildInternalLinks(
  processed.content,
  keywords,
  slug,
  4 // Thay đổi ở đây (1-10)
);
```

### Số keywords
```typescript
// lib/gemini.ts
.slice(0, 7); // Thay đổi ở đây (3-10)
```

## Files Created/Modified

### New Files
- `lib/internal-linking.ts` - Core logic
- `components/ArticleContent.tsx` - HTML rendering
- `scripts/test-internal-linking.ts` - Testing
- `INTERNAL_LINKING_GUIDE.md` - Documentation

### Modified Files
- `lib/gemini.ts` - Added extractKeywords()
- `lib/db.ts` - Added findRelatedArticles(), updateArticleContent()
- `app/api/process-articles/route.ts` - Integrated internal linking
- `app/posts/[slug]/page.tsx` - Use ArticleContent component
- `app/globals.css` - Added .internal-link styling

## Statistics

Sau 1 tháng với 100 bài viết:
- ~300-400 internal links tự động
- Mỗi bài có 3-4 outbound links
- Mỗi bài nhận 3-4 inbound links
- Tạo mạng lưới liên kết chặt chẽ

## Next Steps (Optional)

Có thể mở rộng:
- [ ] Track click-through rate của links
- [ ] A/B testing anchor text
- [ ] Auto-update old articles với links mới
- [ ] Link graph visualization
- [ ] Suggest manual links trong admin
- [ ] External linking strategy

## Conclusion

✅ **Phase 4 hoàn thành!**

Hệ thống giờ có:
1. RSS Auto-Fetch
2. AI Content Processing
3. Auto-Publish
4. **Internal Linking** ← NEW

→ Website tin tức **HOÀN TOÀN TỰ ĐỘNG** với SEO tối ưu! 🎉

## Commands Summary

```bash
# Test internal linking
npm run test:links

# Check articles
npm run check

# Test AI processing
npm run test:ai

# List Gemini models
npm run list:models

# Seed database
npm run seed
npm run seed:rss
```

## Documentation

- `INTERNAL_LINKING_GUIDE.md` - Chi tiết về internal linking
- `GEMINI_GUIDE.md` - AI processing guide
- `RSS_GUIDE.md` - RSS system guide
- `COMPLETE_SYSTEM.md` - Tổng quan toàn hệ thống
- `TROUBLESHOOTING.md` - Giải quyết vấn đề

---

**🎊 Chúc mừng! Hệ thống đã hoàn thiện với Internal Linking!**
