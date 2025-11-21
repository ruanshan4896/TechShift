# Tóm Tắt Refactor: AI Processing & RSS Fetching

## Ngày thực hiện: 22/11/2025

### 🎯 Mục tiêu
Khắc phục 4 vấn đề nghiêm trọng trong luồng xử lý AI và RSS Fetching của `apps/admin`.

---

## ✅ Các thay đổi đã thực hiện

### 1. **Ngăn chặn trùng lặp bài viết (Duplicate Prevention)**

**Vấn đề:** Bài viết đã tồn tại vẫn bị AI xử lý lại, tốn quota.

**Giải pháp:**
- ✅ Kiểm tra `original_url` trong bảng `raw_articles` trước khi xử lý AI
- ✅ Nếu URL đã tồn tại → **Skip hoàn toàn**, không gọi API Gemini
- ✅ Log rõ ràng: `⏭️ Skipped duplicate: [URL]`
- ✅ Lưu `original_url` vào `raw_articles` sau khi xử lý thành công với status `processed`

**File thay đổi:**
- `apps/admin/app/api/process-rss/[sourceId]/route.ts`

**Code:**
```typescript
// Check duplicate trước khi xử lý
const exists = await checkArticleExists(item.link);
if (exists) {
  console.log(`  ⏭️  Skipped duplicate: ${item.link}`);
  skippedCount++;
  continue;
}

// Lưu vào raw_articles sau khi xử lý thành công
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

### 2. **Ép buộc định dạng JSON và loại bỏ "Văn phong giao tiếp"**

**Vấn đề:** 
- AI trả lời kèm câu dẫn: *"Chắc chắn rồi, đây là..."*
- Nội dung lưu DB chứa chuỗi JSON thay vì Markdown sạch

**Giải pháp:**
- ✅ Sử dụng **JSON Mode** của Gemini: `responseMimeType: "application/json"`
- ✅ Thêm chỉ thị rõ ràng: `Return RAW JSON only, no markdown formatting, no conversational filler`
- ✅ Implement logic loại bỏ conversational prefixes (Chắc chắn rồi, Sure, Here is...)
- ✅ Parse JSON đúng cách với `JSON.parse()`
- ✅ Validate cấu trúc JSON (kiểm tra `title`, `content`, `summary`)
- ✅ Xử lý trường hợp content bị wrap trong JSON string
- ✅ Error handling: Throw error rõ ràng nếu JSON không hợp lệ

**File thay đổi:**
- `apps/admin/lib/ai-processor.ts` - Hàm `analyzeArticle()` và `rewriteArticle()`

**Code:**
```typescript
// Cấu hình JSON Mode
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: "application/json"
  }
});

// Loại bỏ conversational filler
const conversationalPrefixes = [
  'Chắc chắn rồi', 'Dạ vâng', 'Được rồi', 
  'Đây là', 'Sure', 'Here is', 'Here\'s'
];

for (const prefix of conversationalPrefixes) {
  if (responseText.toLowerCase().startsWith(prefix.toLowerCase())) {
    const jsonStart = responseText.indexOf('{');
    if (jsonStart !== -1) {
      responseText = responseText.substring(jsonStart);
    }
    break;
  }
}

// Parse và validate
const parsed = JSON.parse(responseText);
if (!parsed.title || !parsed.content || !parsed.summary) {
  throw new Error('Invalid JSON structure: missing required fields');
}
```

---

### 3. **Sửa lỗi Tag tiếng Anh & Nội dung**

**Vấn đề:** Blog tiếng Việt nhưng AI sinh tag tiếng Anh (VD: "Music streaming").

**Giải pháp:**
- ✅ Cập nhật System Prompt với yêu cầu rõ ràng:
  - *"Generate 5 tags strictly in VIETNAMESE language suitable for a Vietnamese tech blog"*
  - *"Tags must be concise keywords (1-3 words each)"*
- ✅ Thêm yêu cầu rà soát lỗi chính tả tiếng Việt trong nội dung
- ✅ Nhấn mạnh KHÔNG dịch sang tiếng Anh trong prompt

**File thay đổi:**
- `apps/admin/lib/ai-processor.ts` - Prompt trong `analyzeArticle()` và `rewriteArticle()`

**Code:**
```typescript
// Trong analyzeArticle()
const prompt = `...
CRITICAL REQUIREMENTS:
- Return RAW JSON only, no markdown formatting, no conversational filler
- Generate 5 tags strictly in VIETNAMESE language suitable for a Vietnamese tech blog
- Tags must be concise keywords (1-3 words each)
...`;

// Trong rewriteArticle()
const prompt = `...
2. **NỘI DUNG (CONTENT):**
   - Viết lại hoàn toàn bằng TIẾNG VIỆT
   - Rà soát và sửa lỗi chính tả tiếng Việt
   - Giữ nguyên các thông số kỹ thuật, tên riêng (iPhone, Samsung, CPU...)
...`;
```

---

### 4. **Xử lý lỗi hiển thị ký tự lạ (HTML Entities Decoding)**

**Vấn đề:** Tiêu đề/nội dung bị lỗi: `t&iacute;nh năng`, `&#039;`.

**Giải pháp:**
- ✅ Cài đặt thư viện `he` và `@types/he`
- ✅ Decode HTML Entities cho **tất cả input** trước khi gửi cho AI:
  - `originalTitle` → `decodeHtmlEntities(originalTitle)`
  - `originalContent` → `decodeHtmlEntities(originalContent)`
- ✅ Đảm bảo dữ liệu sạch sẽ trước khi xử lý và lưu DB

**File thay đổi:**
- `apps/admin/package.json` - Thêm dependencies
- `apps/admin/lib/ai-processor.ts` - Import và sử dụng `he.decode()`

**Code:**
```typescript
import { decode as decodeHtmlEntities } from 'he';

// Trong analyzeArticle()
const cleanTitle = decodeHtmlEntities(originalTitle);
const cleanContent = decodeHtmlEntities(originalContent);

// Trong rewriteArticle()
const cleanTitle = decodeHtmlEntities(originalTitle);
const cleanContent = decodeHtmlEntities(originalContent);
```

---

## 📦 Dependencies mới

```json
{
  "dependencies": {
    "he": "^1.2.0"
  },
  "devDependencies": {
    "@types/he": "^1.2.3"
  }
}
```

---

## 🧪 Cách kiểm tra

### Test 1: Duplicate Prevention
```bash
# Chạy process RSS 2 lần cho cùng 1 source
# Lần 2 phải skip tất cả bài viết đã xử lý
curl -X POST http://localhost:3001/api/process-rss/1
curl -X POST http://localhost:3001/api/process-rss/1
```

**Kết quả mong đợi:**
- Lần 1: `processed: 10, skipped: 0`
- Lần 2: `processed: 0, skipped: 10`
- Console log: `⏭️ Skipped duplicate: [URL]`

### Test 2: JSON Format & Vietnamese Tags
```bash
# Kiểm tra bài viết mới tạo trong database
# Xem cột content, tags
```

**Kết quả mong đợi:**
- `content`: Markdown sạch, KHÔNG chứa JSON string
- `tags`: Toàn tiếng Việt (VD: "Công nghệ", "Điện thoại", "AI")
- KHÔNG có tag tiếng Anh (VD: "Technology", "Smartphone")

### Test 3: HTML Entities Decoding
```bash
# Fetch RSS có HTML entities trong title/content
# VD: "Tính năng mới" thay vì "T&iacute;nh năng mới"
```

**Kết quả mong đợi:**
- Title và Content hiển thị đúng tiếng Việt có dấu
- KHÔNG còn ký tự lạ: `&iacute;`, `&#039;`, `&amp;`

---

## 🎉 Kết quả

✅ **Duplicate Prevention**: Tiết kiệm quota API Gemini, tránh spam database  
✅ **JSON Format**: Nội dung sạch sẽ, không còn lỗi format  
✅ **Vietnamese Tags**: Tags chuẩn tiếng Việt, phù hợp với blog Việt Nam  
✅ **HTML Entities**: Hiển thị tiếng Việt chính xác, không còn ký tự lạ  

---

## 📝 Lưu ý

1. **Database Migration**: Đảm bảo bảng `raw_articles` đã được tạo với cột `original_url` UNIQUE
2. **API Keys**: Kiểm tra `GEMINI_API_KEYS` trong `.env.local`
3. **Testing**: Nên test với RSS feed thật để đảm bảo tất cả edge cases được xử lý
4. **Monitoring**: Theo dõi console logs để phát hiện lỗi JSON parsing sớm

---

**Người thực hiện:** Kiro AI Assistant  
**Ngày hoàn thành:** 22/11/2025
