# Quick Test Guide - 3 Features

## 🚀 Chuẩn bị

```bash
cd apps/admin
pnpm dev
```

---

## ✅ Test 1: Meta Description (2 phút)

### Mục tiêu
Verify summary không còn Markdown

### Các bước
1. Process 1 bài viết mới từ RSS
2. Vào database:
```sql
SELECT title, summary FROM articles ORDER BY created_at DESC LIMIT 1;
```

### ✅ Pass nếu:
- Summary là plain text
- Không có `**`, `*`, `[`, `]`
- Độ dài ≤ 160 ký tự

### ❌ Fail nếu:
- Vẫn thấy `**bold**` hoặc `*italic*`
- Summary > 160 chars

---

## ✅ Test 2: Internal Linking (3 phút)

### Mục tiêu
Verify links không trùng lặp và format đúng

### Các bước
1. Process 1 bài viết có related articles
2. Vào database:
```sql
SELECT content FROM articles ORDER BY created_at DESC LIMIT 1;
```

3. Tìm các dòng có `> **Xem thêm:**`

### ✅ Pass nếu:
- Links sử dụng format blockquote:
  ```markdown
  > **Xem thêm:** [Title](/posts/slug)
  ```
- Mỗi bài viết chỉ xuất hiện 1 lần
- Links nằm giữa các đoạn văn (không nối vào cuối)
- Tối đa 3 links

### ❌ Fail nếu:
- Vẫn thấy format cũ: `text [Xem thêm: ...]`
- Cùng 1 bài xuất hiện 2 lần
- Links nối vào cuối đoạn văn

---

## ✅ Test 3: Bulk Actions (5 phút)

### Test 3.1: Select All
1. Go to http://localhost:3001/dashboard
2. Click checkbox ở header (Select All)
3. ✅ Tất cả bài phải được chọn
4. Click lại
5. ✅ Tất cả phải bỏ chọn

### Test 3.2: Floating Action Bar
1. Select 2-3 bài viết
2. ✅ Floating Action Bar phải xuất hiện ở bottom center
3. ✅ Hiển thị: "Đã chọn X bài viết"
4. ✅ Có buttons: Xuất bản (nếu Drafts), Xóa, Hủy

### Test 3.3: Bulk Publish
1. Go to Drafts tab
2. Select 3 bài viết
3. Click "Xuất bản"
4. Confirm dialog
5. ✅ Success message
6. ✅ 3 bài phải chuyển sang Published tab
7. ✅ Selection cleared

### Test 3.4: Bulk Delete
1. Select 2 bài viết
2. Click "Xóa"
3. Confirm dialog (warning: không thể hoàn tác)
4. ✅ Success message
5. ✅ 2 bài phải biến mất
6. ✅ Selection cleared

### Test 3.5: Cancel
1. Select vài bài viết
2. Click "Hủy" trong Floating Action Bar
3. ✅ Selection cleared
4. ✅ Floating Action Bar biến mất

---

## 🎯 Success Criteria

### Task 1: Meta Description
- [ ] Summary là plain text
- [ ] Không có Markdown syntax
- [ ] Độ dài ≤ 160 chars

### Task 2: Internal Linking
- [ ] Format blockquote đúng
- [ ] Không có link trùng lặp
- [ ] Links giữa các đoạn văn
- [ ] Tối đa 3 links

### Task 3: Bulk Actions
- [ ] Select All works
- [ ] Floating Action Bar appears
- [ ] Bulk Publish works
- [ ] Bulk Delete works
- [ ] Cancel works
- [ ] UI responsive & smooth

---

## 🐛 Common Issues

### Issue 1: Summary vẫn có Markdown
**Fix:** Check import trong `ai-processor.ts`
```typescript
import { createMetaDescription } from './markdown-utils';
```

### Issue 2: Links vẫn format cũ
**Fix:** Check import trong `ai-processor.ts`
```typescript
import { insertInternalLinks as insertInternalLinksNew } from './internal-linking';
```

### Issue 3: Bulk actions không hoạt động
**Fix:** 
1. Check API routes exist
2. Check console for errors
3. Restart dev server

---

## 📊 Test Results Template

```
✅ Task 1: Meta Description
   - Plain text: ✅/❌
   - No Markdown: ✅/❌
   - Length ≤ 160: ✅/❌

✅ Task 2: Internal Linking
   - Blockquote format: ✅/❌
   - No duplicates: ✅/❌
   - Between paragraphs: ✅/❌
   - Max 3 links: ✅/❌

✅ Task 3: Bulk Actions
   - Select All: ✅/❌
   - Floating Bar: ✅/❌
   - Bulk Publish: ✅/❌
   - Bulk Delete: ✅/❌
   - Cancel: ✅/❌
```

---

**Total Test Time:** ~10 minutes  
**All tests passed?** Ready for production! 🚀
