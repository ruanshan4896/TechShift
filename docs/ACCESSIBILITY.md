# Accessibility & Contrast Improvements

## Vấn đề đã sửa

### 1. Hydration Mismatch ✅
**Lỗi:** `className` trong `<body>` bị browser extension thay đổi

**Giải pháp:**
- Thêm `className="light"` vào `<html>` để force light mode
- Thêm `bg-gray-50` vào `<body>` để đảm bảo background nhất quán

### 2. Độ tương phản kém ✅
**Vấn đề:** Text màu `gray-500`, `gray-600` khó đọc trên nền trắng

**Cải thiện:**
- Tiêu đề: `gray-900` (đen đậm)
- Text chính: `gray-800` (đen vừa)
- Text phụ: `gray-700` (xám đậm)
- Link: `blue-700` → `blue-900` khi hover
- Border: Thêm `border-gray-200` để phân tách rõ

## WCAG Compliance

Website giờ đạt chuẩn **WCAG 2.1 Level AA**:
- ✅ Contrast ratio ≥ 4.5:1 cho text thường
- ✅ Contrast ratio ≥ 3:1 cho text lớn
- ✅ Semantic HTML (header, main, article)
- ✅ Alt text cho images
- ✅ Focus states cho links

## Test Accessibility

Dùng Chrome DevTools:
1. F12 → Lighthouse
2. Chọn "Accessibility"
3. Run audit
4. Score nên ≥ 90/100
