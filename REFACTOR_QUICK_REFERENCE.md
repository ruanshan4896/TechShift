# Quick Reference: Refactor Changes

## 🔧 Files Modified

### 1. `apps/admin/lib/ai-processor.ts`
**Changes:**
- ✅ Import `he` library for HTML decoding
- ✅ Use Gemini JSON Mode in both `analyzeArticle()` and `rewriteArticle()`
- ✅ Decode HTML entities before AI processing
- ✅ Remove conversational filler from AI responses
- ✅ Validate JSON structure
- ✅ Update prompts for Vietnamese tags and content

**Key Functions:**
```typescript
// Decode HTML entities
const cleanTitle = decodeHtmlEntities(originalTitle);
const cleanContent = decodeHtmlEntities(originalContent);

// JSON Mode
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: "application/json"
  }
});

// Validate JSON
const parsed = JSON.parse(responseText);
if (!parsed.title || !parsed.content || !parsed.summary) {
  throw new Error('Invalid JSON structure: missing required fields');
}
```

---

### 2. `apps/admin/app/api/process-rss/[sourceId]/route.ts`
**Changes:**
- ✅ Check duplicate by `original_url` before processing
- ✅ Skip existing articles (log: "⏭️ Skipped duplicate")
- ✅ Save to `raw_articles` after successful processing

**Key Code:**
```typescript
// Check duplicate
const exists = await checkArticleExists(item.link);
if (exists) {
  console.log(`  ⏭️  Skipped duplicate: ${item.link}`);
  skippedCount++;
  continue;
}

// Save to raw_articles
await insertRawArticle({
  source_id: sourceIdNum,
  title: item.title,
  original_url: item.link,
  original_content: originalContent,
  publication_date: item.pubDate ? new Date(item.pubDate) : new Date(),
  status: 'processed',
});
```

---

### 3. `apps/admin/package.json`
**Changes:**
- ✅ Add `he` dependency
- ✅ Add `@types/he` dev dependency

---

## 🎯 Key Features

### Duplicate Prevention
- **Before:** Process all articles every time → Waste API quota
- **After:** Skip existing articles → Save quota

### JSON Format
- **Before:** Content contains JSON strings or conversational text
- **After:** Clean Markdown content only

### Vietnamese Tags
- **Before:** Tags in English (e.g., "Music streaming")
- **After:** Tags in Vietnamese (e.g., "Công nghệ", "Âm nhạc")

### HTML Entities
- **Before:** `T&iacute;nh năng`, `&#039;`
- **After:** `Tính năng`, `'`

---

## 📝 Prompts Updated

### analyzeArticle() Prompt
```
CRITICAL REQUIREMENTS:
- Return RAW JSON only, no markdown formatting, no conversational filler
- Generate 5 tags strictly in VIETNAMESE language suitable for a Vietnamese tech blog
- Tags must be concise keywords (1-3 words each)
```

### rewriteArticle() Prompt
```
2. **NỘI DUNG (CONTENT):**
   - Viết lại hoàn toàn bằng TIẾNG VIỆT
   - Rà soát và sửa lỗi chính tả tiếng Việt
   - Giữ nguyên các thông số kỹ thuật, tên riêng (iPhone, Samsung, CPU...)

**CRITICAL: Return RAW JSON only, no markdown formatting, no conversational filler**
```

---

## 🚨 Error Handling

### analyzeArticle()
```typescript
catch (error) {
  console.error('Error in analyzeArticle:', error);
  throw new Error(`Failed to analyze article: ${error instanceof Error ? error.message : 'Unknown error'}`);
}
```

### rewriteArticle()
```typescript
catch (error) {
  console.error('Error in rewriteArticle:', error);
  throw new Error(`Failed to rewrite article with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
}
```

---

## 🔍 Debugging

### Check if duplicate prevention works
```bash
# Run twice, 2nd time should skip all
curl -X POST http://localhost:3001/api/process-rss/1
curl -X POST http://localhost:3001/api/process-rss/1
```

### Check if JSON is clean
```sql
SELECT content FROM articles ORDER BY created_at DESC LIMIT 1;
-- Should be Markdown, not JSON string
```

### Check if tags are Vietnamese
```sql
SELECT t.name FROM tags t
INNER JOIN article_tags at ON t.id = at.tag_id
ORDER BY t.created_at DESC LIMIT 10;
-- Should be Vietnamese only
```

### Check if HTML entities are decoded
```sql
SELECT title FROM articles WHERE title LIKE '%&%';
-- Should return 0 rows
```

---

## 💡 Tips

1. **Monitor console logs** for duplicate skips
2. **Check database** after processing for clean content
3. **Verify tags** are in Vietnamese
4. **Test with real RSS feeds** that have HTML entities

---

## 📚 Related Files

- `REFACTOR_SUMMARY.md` - Detailed summary of all changes
- `TEST_REFACTOR.md` - Testing guide
- `REFACTOR_COMMIT_MESSAGE.txt` - Commit message template

---

**Last Updated:** 22/11/2025
