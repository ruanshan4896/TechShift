# Test Critical Fixes - Quick Guide

## 🎯 2 Critical Fixes to Test

1. **Draft Leak Prevention** - Drafts không hiển thị trên website
2. **Delete Sync** - Xóa article cũng xóa raw_articles

---

## ⚡ Test 1: Draft Leak Prevention (5 phút)

### Setup
1. Go to Admin Dashboard: http://localhost:3001/dashboard
2. Go to Drafts tab
3. Note down a draft article slug

### Test Cases

#### Test 1.1: Homepage
```bash
Visit: http://localhost:3000
Expected: ✅ Should NOT see any draft articles
```

#### Test 1.2: Direct Access
```bash
Visit: http://localhost:3000/posts/[draft-slug]
Expected: ✅ Should return 404 or "Article not found"
```

#### Test 1.3: Category Page
```bash
# If draft has a category
Visit: http://localhost:3000/category/[category-slug]
Expected: ✅ Should NOT see the draft article
```

#### Test 1.4: Tag Page
```bash
# If draft has tags
Visit: http://localhost:3000/tags/[tag-slug]
Expected: ✅ Should NOT see the draft article
```

#### Test 1.5: Search
```bash
# Search for unique word in draft title
Visit: http://localhost:3000/search?q=[unique-word]
Expected: ✅ Should NOT find the draft article
```

### ✅ Pass Criteria
- [ ] Homepage shows only published articles
- [ ] Direct access to draft returns 404
- [ ] Category pages don't show drafts
- [ ] Tag pages don't show drafts
- [ ] Search doesn't find drafts

---

## ⚡ Test 2: Delete Sync (5 phút)

### Setup
```bash
# Start dev servers
cd apps/admin && pnpm dev
cd apps/website && pnpm dev
```

### Test 2.1: Single Delete

**Step 1: Process an article**
```bash
curl -X POST http://localhost:3001/api/process-rss/1
```

**Step 2: Check raw_articles**
```sql
SELECT COUNT(*) FROM raw_articles;
-- Should return > 0
```

**Step 3: Delete one article**
1. Go to http://localhost:3001/dashboard
2. Delete any article
3. Confirm deletion

**Step 4: Check raw_articles again**
```sql
SELECT COUNT(*) FROM raw_articles WHERE title LIKE '%[deleted article title]%';
-- Should return 0
```

**Step 5: Re-fetch**
```bash
curl -X POST http://localhost:3001/api/process-rss/1
```

**Expected:**
✅ Should successfully re-fetch the deleted article  
✅ No "Duplicate" error  
✅ Article appears in Drafts again

### Test 2.2: Bulk Delete

**Step 1: Process multiple articles**
```bash
curl -X POST http://localhost:3001/api/process-rss/1
# Wait for completion
```

**Step 2: Note article count**
```sql
SELECT COUNT(*) FROM articles;
SELECT COUNT(*) FROM raw_articles;
-- Note both counts
```

**Step 3: Bulk delete**
1. Go to http://localhost:3001/dashboard
2. Select 3-5 articles
3. Click "Xóa" (Delete)
4. Confirm

**Step 4: Check database**
```sql
SELECT COUNT(*) FROM articles;
-- Should be reduced by deleted count

SELECT COUNT(*) FROM raw_articles;
-- Should also be reduced by deleted count
```

**Step 5: Re-fetch**
```bash
curl -X POST http://localhost:3001/api/process-rss/1
```

**Expected:**
✅ Should successfully re-fetch all deleted articles  
✅ No "Duplicate" errors  
✅ All articles appear in Drafts again

### ✅ Pass Criteria
- [ ] Single delete removes raw_articles
- [ ] Can re-fetch after single delete
- [ ] Bulk delete removes all raw_articles
- [ ] Can re-fetch after bulk delete
- [ ] No duplicate errors

---

## 🐛 Debugging

### Issue: Still seeing drafts on website

**Check 1: Database**
```sql
SELECT slug, status FROM articles WHERE status = 'DRAFT';
```

**Check 2: Clear cache**
```bash
# In website directory
rm -rf .next
pnpm dev
```

**Check 3: Hard refresh browser**
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Issue: raw_articles not deleted

**Check 1: Console logs**
```
Look for: "Deleted raw_articles for: [title]"
```

**Check 2: Manual check**
```sql
SELECT * FROM raw_articles WHERE title LIKE '%[article title]%';
```

**Check 3: Database connection**
```
Verify DATABASE_URL in .env.local
```

### Issue: Cannot re-fetch after delete

**Check 1: raw_articles exists**
```sql
SELECT * FROM raw_articles WHERE original_url = '[url]';
-- Should return 0 rows
```

**Check 2: Check duplicate logic**
```typescript
// In process-rss route
const exists = await checkArticleExists(item.link);
// Should return false after delete
```

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Fix 1: Draft Leak Prevention
- Homepage: ✅ PASS / ❌ FAIL
- Direct Access: ✅ PASS / ❌ FAIL
- Category Page: ✅ PASS / ❌ FAIL
- Tag Page: ✅ PASS / ❌ FAIL
- Search: ✅ PASS / ❌ FAIL

Fix 2: Delete Sync
- Single Delete: ✅ PASS / ❌ FAIL
- Re-fetch after Single: ✅ PASS / ❌ FAIL
- Bulk Delete: ✅ PASS / ❌ FAIL
- Re-fetch after Bulk: ✅ PASS / ❌ FAIL

Overall Status: ✅ ALL PASS / ❌ SOME FAILED

Notes:
_________________________________
_________________________________
```

---

## 🎯 Success Criteria

### Fix 1: Draft Leak
- ✅ No drafts visible on any public page
- ✅ Direct access to draft returns 404
- ✅ Search doesn't find drafts
- ✅ Category/Tag pages don't show drafts

### Fix 2: Delete Sync
- ✅ Deleting article also deletes raw_articles
- ✅ Can re-fetch deleted articles from RSS
- ✅ No duplicate errors after re-fetch
- ✅ Works for both single and bulk delete

---

**Total Test Time:** ~10 minutes  
**Critical:** Yes  
**Must pass before production:** Yes  
**Blocking:** Yes
