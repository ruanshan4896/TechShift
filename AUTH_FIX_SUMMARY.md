# Fix: Admin Authentication Issue

## 🐛 Vấn đề
Hệ thống không đọc mật khẩu từ `.env.local` mà vẫn dùng mật khẩu mặc định `admin123`.

## 🔍 Nguyên nhân
Có 2 cách xác thực không đồng nhất:

1. **Client-side** (`apps/admin/app/rss/page.tsx`):
   - Đọc: `process.env.NEXT_PUBLIC_ADMIN_PASSWORD`
   - Fallback: `'admin123'`
   - ✅ Có trong `.env.local`

2. **Server-side** (`apps/admin/app/api/login/route.ts`):
   - Đọc: `process.env.ADMIN_PASSWORD`
   - Fallback: `'admin123'`
   - ❌ KHÔNG có trong `.env.local`

→ Server-side luôn dùng fallback `'admin123'` vì thiếu biến `ADMIN_PASSWORD`

## ✅ Giải pháp

### 1. Thêm biến `ADMIN_PASSWORD` vào `.env.local`

**File:** `apps/admin/.env.local`

```bash
# Admin Password (for RSS management)
# ADMIN_PASSWORD is for server-side authentication
# NEXT_PUBLIC_ADMIN_PASSWORD is for client-side (legacy, will be removed)
ADMIN_PASSWORD="Toibidien@1"
NEXT_PUBLIC_ADMIN_PASSWORD="Toibidien@1"
```

### 2. Sửa RSS page để dùng API login (an toàn hơn)

**File:** `apps/admin/app/rss/page.tsx`

**Trước:**
```typescript
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
    setIsAuthenticated(true);
  } else {
    alert('Mật khẩu không đúng!');
  }
};
```

**Sau:**
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
    } else {
      alert('Mật khẩu không đúng!');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Lỗi đăng nhập. Vui lòng thử lại.');
  } finally {
    setLoading(false);
  }
};
```

## 🎯 Lợi ích

### Trước khi sửa:
- ❌ Client-side check password (không an toàn)
- ❌ Password exposed trong client bundle
- ❌ Server-side không đọc được password từ `.env.local`
- ❌ Luôn fallback về `'admin123'`

### Sau khi sửa:
- ✅ Server-side authentication (an toàn)
- ✅ Password không exposed trong client
- ✅ Đọc đúng password từ `.env.local`
- ✅ JWT token được set trong cookie
- ✅ Session management tốt hơn (8 hours)

## 🧪 Cách test

### 1. Restart dev server
```bash
cd apps/admin
pnpm dev
```

### 2. Truy cập RSS Manager
```
http://localhost:3001/rss
```

### 3. Đăng nhập
- Nhập password: `Toibidien@1` (từ `.env.local`)
- Nhấn "Đăng nhập"
- ✅ Phải đăng nhập thành công

### 4. Test password sai
- Nhập password: `admin123` (password cũ)
- Nhấn "Đăng nhập"
- ❌ Phải báo lỗi "Mật khẩu không đúng!"

### 5. Kiểm tra cookie
- Mở DevTools → Application → Cookies
- Tìm cookie `admin-token`
- ✅ Phải có JWT token

## 🔒 Security Best Practices

### Đã áp dụng:
- ✅ Server-side password verification
- ✅ JWT token với expiration (8 hours)
- ✅ HttpOnly cookie (prevent XSS)
- ✅ Secure flag in production
- ✅ SameSite: lax (prevent CSRF)

### Nên làm thêm (optional):
- 🔄 Rate limiting cho login endpoint
- 🔄 Password hashing (bcrypt)
- 🔄 2FA authentication
- 🔄 Audit logging

## 📝 Environment Variables

### Required in `.env.local`:
```bash
# Server-side authentication (REQUIRED)
ADMIN_PASSWORD="your-secure-password"

# JWT secret (REQUIRED)
JWT_SECRET="your-jwt-secret-key"

# Legacy client-side (will be removed in future)
NEXT_PUBLIC_ADMIN_PASSWORD="your-secure-password"
```

### Recommended values:
- `ADMIN_PASSWORD`: Strong password (min 12 chars, mix of letters, numbers, symbols)
- `JWT_SECRET`: Random string (min 32 chars)

## 🚨 Important Notes

1. **Restart required**: Sau khi thay đổi `.env.local`, phải restart dev server
2. **Production**: Đảm bảo set đúng environment variables trên production
3. **Security**: KHÔNG commit `.env.local` vào git
4. **Legacy code**: `NEXT_PUBLIC_ADMIN_PASSWORD` sẽ được remove trong tương lai

---

**Fixed by:** Kiro AI Assistant  
**Date:** 22/11/2025  
**Status:** ✅ Resolved
