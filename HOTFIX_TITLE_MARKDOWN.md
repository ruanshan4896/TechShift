# Hotfix: Remove Markdown from Title

## 🐛 Vấn đề

AI vẫn thỉnh thoảng chèn Markdown vào trong value của key `title` trong JSON response.

**Ví dụ thực tế:**
```json
{
  "title": "Tiết lộ 'góc khuất' gây tranh cãi: Những **điểm yếu iOS** khiến iFan cũng phải ngao ngán!"
}
```

**Vấn đề:**
- Title chứa `**bold**` formatting
- Hiển thị xấu trên website
- Không phù hợp cho meta tags

---

## ✅ Giải pháp

### 1. Update Import Statement

**File:** `apps/admin/lib/ai-processor.ts`

```typescript
// Before
import { createMetaDescription } from './markdown-utils';

// After
import { createMetaDescription, stripMarkdown } from './markdown-utils';
```

### 2. Update System Prompt

Thêm chỉ thị rõ ràng vào prompt:

```typescript
**CRITICAL FORMATTING RULES:**
- Return RAW JSON only, no markdown formatting, no conversational filler
- Title and Summary must be PLAIN TEXT ONLY
- Do NOT use Markdown formatting (bold, italic, links) inside title or summary values
- Only content field can contain Markdown

JSON Schema:
{
  "title": "string - Vietnamese title (PLAIN TEXT, no ** or * or [])",
  "content": "string - Vietnamese Markdown content (Markdown allowed here)",
  "summary": "string - Vietnamese summary (PLAIN TEXT, no ** or * or [])"
}
```

### 3. Strip Markdown from Title

Áp dụng `stripMarkdown()` cho title sau khi parse JSON:

```typescript
// Parse JSON response
const parsed = JSON.parse(responseText);

// Validate fields
if (!parsed.title || !parsed.content || !parsed.summary) {
  throw new Error('Invalid JSON structure: missing required fields');
}

// Clean content (existing logic)
let cleanContentResult = parsed.content;
// ... existing content cleaning logic ...

// ✅ NEW: Clean title - strip any Markdown formatting
const cleanTitle = stripMarkdown(parsed.title);

// Clean summary (existing)
const cleanSummary = createMetaDescription(parsed.summary, 160);

return {
  title: cleanTitle,        // ✅ Now clean!
  content: cleanContentResult,
  summary: cleanSummary,
};
```

---

## 🔍 Cách hoạt động

### stripMarkdown() function

Từ `apps/admin/lib/markdown-utils.ts`:

```typescript
export function stripMarkdown(text: string): string {
  if (!text) return '';

  let result = text;

  // Remove bold (**text** or __text__)
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
  result = result.replace(/__([^_]+)__/g, '$1');

  // Remove italic (*text* or _text_)
  result = result.replace(/\*([^*]+)\*/g, '$1');
  result = result.replace(/_([^_]+)_/g, '$1');

  // Remove links [text](url)
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // ... more cleaning ...

  return result.trim();
}
```

### Ví dụ transformation:

**Input (từ AI):**
```
"Tiết lộ 'góc khuất' gây tranh cãi: Những **điểm yếu iOS** khiến iFan cũng phải ngao ngán!"
```

**After stripMarkdown():**
```
"Tiết lộ 'góc khuất' gây tranh cãi: Những điểm yếu iOS khiến iFan cũng phải ngao ngán!"
```

**Saved to database:**
```sql
INSERT INTO articles (title, ...) 
VALUES ('Tiết lộ góc khuất gây tranh cãi: Những điểm yếu iOS khiến iFan cũng phải ngao ngán!', ...);
```

---

## 🧪 Testing

### Test Case 1: Title với Bold

**Input:**
```json
{
  "title": "iPhone 16 Pro: **Tính năng mới** gây sốt"
}
```

**Expected Output:**
```
"iPhone 16 Pro: Tính năng mới gây sốt"
```

### Test Case 2: Title với Italic

**Input:**
```json
{
  "title": "Samsung Galaxy S24: *Đột phá* về camera"
}
```

**Expected Output:**
```
"Samsung Galaxy S24: Đột phá về camera"
```

### Test Case 3: Title với Link

**Input:**
```json
{
  "title": "Xem [chi tiết](https://example.com) về AI mới"
}
```

**Expected Output:**
```
"Xem chi tiết về AI mới"
```

### Test Case 4: Title sạch (không có Markdown)

**Input:**
```json
{
  "title": "Google Pixel 9: Giá tốt, hiệu năng cao"
}
```

**Expected Output:**
```
"Google Pixel 9: Giá tốt, hiệu năng cao"
```

---

## 📊 Before vs After

### Before Hotfix:

```typescript
return {
  title: parsed.title,  // ❌ Có thể chứa **bold**, *italic*
  content: cleanContentResult,
  summary: cleanSummary,
};
```

**Database:**
```sql
title: "Những **điểm yếu iOS** khiến iFan ngao ngán"
```

**Website Display:**
```html
<h1>Những **điểm yếu iOS** khiến iFan ngao ngán</h1>
```

### After Hotfix:

```typescript
const cleanTitle = stripMarkdown(parsed.title);

return {
  title: cleanTitle,  // ✅ Plain text only
  content: cleanContentResult,
  summary: cleanSummary,
};
```

**Database:**
```sql
title: "Những điểm yếu iOS khiến iFan ngao ngán"
```

**Website Display:**
```html
<h1>Những điểm yếu iOS khiến iFan ngao ngán</h1>
```

---

## 🎯 Benefits

### 1. Clean Database
- ✅ Titles stored as plain text
- ✅ No Markdown syntax in database
- ✅ Easier to search and filter

### 2. Better Display
- ✅ Clean display on website
- ✅ No weird `**` or `*` characters
- ✅ Professional appearance

### 3. SEO Friendly
- ✅ Clean meta titles
- ✅ Better Google Search display
- ✅ Proper Open Graph tags

### 4. Consistent Format
- ✅ All titles follow same format
- ✅ No mixed formatting
- ✅ Predictable output

---

## 🚀 Deployment

### 1. Restart Dev Server
```bash
cd apps/admin
pnpm dev
```

### 2. Test with New Articles
```bash
# Process a new RSS article
curl -X POST http://localhost:3001/api/process-rss/1
```

### 3. Verify in Database
```sql
SELECT title FROM articles ORDER BY created_at DESC LIMIT 5;
-- Should see plain text titles only
```

### 4. Check Website Display
```
Visit: http://localhost:3000/posts/[slug]
Check: Title should display cleanly without ** or *
```

---

## 📝 Summary

### Changes Made:
1. ✅ Import `stripMarkdown` function
2. ✅ Update prompt with clear formatting rules
3. ✅ Apply `stripMarkdown()` to title before return
4. ✅ Ensure title is always plain text

### Files Modified:
- ✅ `apps/admin/lib/ai-processor.ts`

### Impact:
- ✅ All new articles will have clean titles
- ✅ No more Markdown in title field
- ✅ Better user experience
- ✅ Improved SEO

---

## 🔄 For Existing Articles (Optional)

If you want to clean existing articles in database:

```sql
-- Find articles with Markdown in title
SELECT id, title FROM articles 
WHERE title LIKE '%**%' OR title LIKE '%*%' OR title LIKE '%[%]%';

-- Manual cleanup (example)
UPDATE articles 
SET title = REPLACE(REPLACE(title, '**', ''), '*', '')
WHERE title LIKE '%**%' OR title LIKE '%*%';
```

Or create a migration script:

```typescript
// scripts/clean-titles.ts
import { getAllArticles, updateArticle } from '@/lib/db';
import { stripMarkdown } from '@/lib/markdown-utils';

async function cleanTitles() {
  const articles = await getAllArticles();
  
  for (const article of articles) {
    const cleanTitle = stripMarkdown(article.title);
    
    if (cleanTitle !== article.title) {
      await updateArticle(article.id, { title: cleanTitle });
      console.log(`Cleaned: ${article.id}`);
    }
  }
}

cleanTitles();
```

---

**Hotfix by:** Kiro AI Assistant  
**Date:** 22/11/2025  
**Status:** ✅ Completed  
**Priority:** High  
**Impact:** All new articles
