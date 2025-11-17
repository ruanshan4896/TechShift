# Internal Linking System Guide

## Tổng quan

Hệ thống tự động xây dựng liên kết nội bộ (internal linking) để:
- Tăng SEO (Search Engine Optimization)
- Cải thiện user experience
- Tăng page views
- Giảm bounce rate

## Cách hoạt động

### Workflow

```
Bài viết mới được tạo
    ↓
1. Trích xuất 5-7 keywords (Gemini AI)
    ↓
2. Tìm bài viết liên quan (Database search)
    ↓
3. Chèn links vào nội dung (Max 4 links)
    ↓
4. Lưu lại content đã có links
```

### Chi tiết từng bước

#### 1. Trích xuất Keywords

Gemini AI phân tích nội dung và trích xuất:
- Tên công nghệ (AI, Machine Learning, iPhone)
- Tên sản phẩm (GPT-4, Windows 11)
- Tên công ty (OpenAI, Microsoft, Apple)
- Khái niệm kỹ thuật (chip xử lý, hố đen)

**Ví dụ:**
```
Bài viết: "Hố đen nuốt sao..."
Keywords: Hố đen, Ngôi sao, Vụ nổ ánh sáng, Mặt Trời
```

#### 2. Tìm bài viết liên quan

Với mỗi keyword, tìm 1-2 bài viết cũ có chứa keyword trong:
- Tiêu đề (ILIKE search)
- Nội dung (ILIKE search)

Loại trừ bài viết hiện tại.

#### 3. Chèn links

- Tìm lần xuất hiện **đầu tiên** của keyword
- Thay thế bằng `<a>` tag với:
  - `href`: URL bài viết liên quan
  - `title`: Tiêu đề bài viết
  - `class="internal-link"`: Để styling

**Giới hạn:** Max 4 links/bài để tránh spam

#### 4. Styling

CSS tự động style internal links:
```css
.internal-link {
  color: #2563eb;
  text-decoration: underline dotted;
}
```

## Ví dụ thực tế

### Input
```
Bài viết về "Hố đen nuốt sao"
Keywords: Hố đen, Ngôi sao, Mặt Trời
```

### Output
```html
Khi <a href="/posts/chup-anh-lo-den" class="internal-link">hố đen</a> 
nuốt chửng một <a href="/posts/ngoi-sao-khong-lo" class="internal-link">ngôi sao</a>...
```

### Kết quả trên website
Khi [hố đen](#) nuốt chửng một [ngôi sao](#)...
(Links có underline dotted màu xanh)

## Test Internal Linking

### Test với 1 bài viết
```bash
npm run test:links
```

Output:
```
Keywords extracted: 5
  1. Hố đen
  2. Ngôi sao
  ...

Internal links added: 2
  1. <a href="/posts/...">Hố đen</a>
  2. <a href="/posts/...">Ngôi sao</a>
```

### Test full workflow
```bash
# Process articles với AI + internal linking
curl -H "Authorization: Bearer your-secret" \
  http://localhost:3000/api/process-articles
```

## Monitoring

### Check links trong database
```sql
-- Bài viết có internal links
SELECT title, 
  (LENGTH(content) - LENGTH(REPLACE(content, 'internal-link', ''))) / 13 as link_count
FROM articles
WHERE content LIKE '%internal-link%'
ORDER BY created_at DESC;
```

### Check keywords
```bash
npm run test:links
```

## Configuration

### Thay đổi số lượng links

Edit `app/api/process-articles/route.ts`:
```typescript
const contentWithLinks = await buildInternalLinks(
  processed.content,
  keywords,
  slug,
  4 // Thay đổi số này (1-10)
);
```

### Thay đổi số keywords

Edit `lib/gemini.ts`:
```typescript
.slice(0, 7); // Thay đổi số này (3-10)
```

### Thay đổi số bài viết liên quan

Edit `lib/internal-linking.ts`:
```typescript
const relatedArticles = await findRelatedArticles(keyword, currentSlug, 1);
// Thay 1 thành 2 để tìm nhiều hơn
```

## SEO Benefits

### 1. Internal Link Juice
- Truyền authority giữa các trang
- Giúp Google hiểu cấu trúc site

### 2. Crawlability
- Google bot dễ dàng crawl toàn bộ site
- Index nhiều trang hơn

### 3. User Experience
- Người dùng dễ tìm nội dung liên quan
- Tăng time on site
- Giảm bounce rate

### 4. Keyword Relevance
- Anchor text chứa keywords
- Tăng relevance cho cả 2 trang

## Best Practices

### ✅ Nên làm
- Giữ số links ở mức 3-5/bài
- Dùng anchor text tự nhiên
- Link đến bài viết liên quan thật sự
- Đa dạng anchor text

### ❌ Không nên
- Quá nhiều links (>10)
- Link đến bài không liên quan
- Dùng anchor text generic ("click here")
- Link spam

## Troubleshooting

### Không tìm thấy bài viết liên quan

**Nguyên nhân:** Database chưa có đủ bài viết

**Giải pháp:** 
- Chờ hệ thống fetch thêm bài
- Hoặc seed thêm bài viết mẫu

### Keywords không chính xác

**Nguyên nhân:** Prompt chưa tối ưu

**Giải pháp:** Edit prompt trong `lib/gemini.ts`

### Links không hiển thị

**Nguyên nhân:** CSS chưa load

**Giải pháp:** Check `app/globals.css` có class `.internal-link`

## Performance

### API Calls
- 1 call để extract keywords
- N calls để tìm bài viết (N = số keywords)
- Total: ~6-8 calls/bài

### Database Queries
- 1 query để insert article
- 5-7 queries để tìm related articles
- 1 query để update content

### Time
- Extract keywords: ~2-3 giây
- Find related: ~1-2 giây
- Total thêm: ~3-5 giây/bài

## Future Enhancements

Có thể mở rộng:
- [ ] Link đến external sources
- [ ] A/B testing anchor text
- [ ] Track click-through rate
- [ ] Auto-update old articles với links mới
- [ ] Suggest manual links trong admin
- [ ] Link graph visualization

## Statistics

Sau 1 tháng với 100 bài viết:
- ~300-400 internal links
- Mỗi bài có 3-4 links
- Mỗi bài được link đến 3-4 lần
- Tạo thành mạng lưới liên kết chặt chẽ

## Resources

- [Google SEO Guide - Internal Links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Moz - Internal Linking](https://moz.com/learn/seo/internal-link)
- [Ahrefs - Internal Linking Guide](https://ahrefs.com/blog/internal-links-for-seo/)
