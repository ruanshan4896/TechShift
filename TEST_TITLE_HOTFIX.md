# Test Title Hotfix - Quick Guide

## 🎯 Objective
Verify that titles are saved as plain text without Markdown formatting.

---

## ⚡ Quick Test (2 minutes)

### Step 1: Process a new article
```bash
# Start dev server
cd apps/admin
pnpm dev

# In another terminal, trigger RSS processing
curl -X POST http://localhost:3001/api/process-rss/1
```

### Step 2: Check database
```sql
-- Get latest article title
SELECT id, title FROM articles 
ORDER BY created_at DESC 
LIMIT 1;
```

### Step 3: Verify result

**✅ PASS if:**
```
title: "iPhone 16 Pro: Tính năng mới gây sốt"
```

**❌ FAIL if:**
```
title: "iPhone 16 Pro: **Tính năng mới** gây sốt"
```

---

## 🧪 Detailed Test Cases

### Test 1: Bold Formatting

**Scenario:** AI returns title with bold

**Mock AI Response:**
```json
{
  "title": "Những **điểm yếu iOS** khiến iFan ngao ngán",
  "content": "...",
  "summary": "..."
}
```

**Expected in DB:**
```
"Những điểm yếu iOS khiến iFan ngao ngán"
```

**Test:**
```sql
SELECT title FROM articles WHERE title LIKE '%điểm yếu iOS%';
-- Should NOT contain **
```

---

### Test 2: Italic Formatting

**Scenario:** AI returns title with italic

**Mock AI Response:**
```json
{
  "title": "Samsung Galaxy S24: *Đột phá* về camera"
}
```

**Expected in DB:**
```
"Samsung Galaxy S24: Đột phá về camera"
```

**Test:**
```sql
SELECT title FROM articles WHERE title LIKE '%Samsung Galaxy S24%';
-- Should NOT contain *
```

---

### Test 3: Mixed Formatting

**Scenario:** AI returns title with multiple Markdown types

**Mock AI Response:**
```json
{
  "title": "**iPhone 16** vs *Samsung S24*: [So sánh chi tiết](/compare)"
}
```

**Expected in DB:**
```
"iPhone 16 vs Samsung S24: So sánh chi tiết"
```

**Test:**
```sql
SELECT title FROM articles WHERE title LIKE '%iPhone 16 vs Samsung%';
-- Should be plain text only
```

---

### Test 4: Clean Title (No Markdown)

**Scenario:** AI returns clean title

**Mock AI Response:**
```json
{
  "title": "Google Pixel 9: Giá tốt, hiệu năng cao"
}
```

**Expected in DB:**
```
"Google Pixel 9: Giá tốt, hiệu năng cao"
```

**Test:**
```sql
SELECT title FROM articles WHERE title LIKE '%Google Pixel 9%';
-- Should remain unchanged
```

---

## 🔍 Manual Verification

### Check 1: Console Logs

Look for this in console during processing:

```
Processing: [Original Title]
  Step A: Analyzing article...
  Step B: Rewriting content...
  ✓ Saved as draft: [Clean Title]  ← Should be clean here
```

### Check 2: Admin Dashboard

1. Go to http://localhost:3001/dashboard
2. Check Drafts tab
3. Look at titles in the list
4. ✅ Should NOT see `**` or `*` characters

### Check 3: Website Display

1. Publish an article
2. Go to http://localhost:3000/posts/[slug]
3. Check page title and H1
4. ✅ Should display cleanly

### Check 4: Meta Tags

1. View page source
2. Check meta tags:
```html
<title>Clean Title - TechShift</title>
<meta property="og:title" content="Clean Title" />
<meta name="twitter:title" content="Clean Title" />
```
3. ✅ Should NOT contain Markdown

---

## 🐛 Debugging

### If titles still have Markdown:

**Check 1: Import statement**
```typescript
// apps/admin/lib/ai-processor.ts
import { stripMarkdown } from './markdown-utils';  // ✅ Must be imported
```

**Check 2: stripMarkdown is called**
```typescript
const cleanTitle = stripMarkdown(parsed.title);  // ✅ Must be called

return {
  title: cleanTitle,  // ✅ Must use cleanTitle, not parsed.title
  // ...
};
```

**Check 3: Restart server**
```bash
# Stop server (Ctrl+C)
# Start again
pnpm dev
```

**Check 4: Clear cache**
```bash
# Delete .next folder
rm -rf .next
pnpm dev
```

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Test 1: Bold Formatting
- AI Response: "Những **điểm yếu iOS** khiến iFan ngao ngán"
- DB Result: _______________________________
- Status: ✅ PASS / ❌ FAIL

Test 2: Italic Formatting
- AI Response: "Samsung Galaxy S24: *Đột phá* về camera"
- DB Result: _______________________________
- Status: ✅ PASS / ❌ FAIL

Test 3: Mixed Formatting
- AI Response: "**iPhone 16** vs *Samsung S24*: [So sánh](/compare)"
- DB Result: _______________________________
- Status: ✅ PASS / ❌ FAIL

Test 4: Clean Title
- AI Response: "Google Pixel 9: Giá tốt, hiệu năng cao"
- DB Result: _______________________________
- Status: ✅ PASS / ❌ FAIL

Overall Status: ✅ ALL PASS / ❌ SOME FAILED
```

---

## ✅ Success Criteria

Hotfix is successful if:

- [ ] All new articles have plain text titles
- [ ] No `**` or `*` in database titles
- [ ] Titles display cleanly on website
- [ ] Meta tags are clean
- [ ] No console errors during processing

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] All tests passed
- [ ] Manual verification completed
- [ ] No console errors
- [ ] Database queries return clean titles
- [ ] Website displays correctly
- [ ] Meta tags verified
- [ ] RSS processing works smoothly

---

**Test Duration:** ~5 minutes  
**Critical:** Yes  
**Can skip:** No  
**Must pass before production:** Yes
