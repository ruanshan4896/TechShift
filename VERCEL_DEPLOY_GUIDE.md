# 🚀 Hướng Dẫn Deploy Monorepo lên Vercel

## ⚠️ Quan trọng: Cần 2 Projects riêng biệt!

Vì đây là **monorepo** với 2 ứng dụng độc lập, bạn cần tạo **2 Vercel projects**:
1. **TechShift-Website** (cho public website)
2. **TechShift-Admin** (cho admin dashboard)

---

## 📋 Bước 1: Tạo Project cho Website

### 1.1. Truy cập Vercel Dashboard
- Vào https://vercel.com/dashboard
- Click **"Add New"** → **"Project"**

### 1.2. Import Repository
- Chọn repository: `ruanshan4896/TechShift`
- Click **"Import"**

### 1.3. Cấu hình Project
```
Project Name: techshift-website (hoặc tên bạn muốn)
Framework Preset: Next.js
Root Directory: apps/website  ⚠️ QUAN TRỌNG!
Build Command: (để mặc định)
Output Directory: (để mặc định)
Install Command: (để mặc định)
```

### 1.4. Thêm Environment Variables
Click **"Environment Variables"** và thêm:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_...
GEMINI_API_KEY=AIzaSyC...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### 1.5. Deploy
Click **"Deploy"** và đợi build hoàn tất.

---

## 📋 Bước 2: Tạo Project cho Admin

### 2.1. Quay lại Dashboard
- Click **"Add New"** → **"Project"** lần nữa

### 2.2. Import CÙNG Repository
- Chọn lại repository: `ruanshan4896/TechShift`
- Click **"Import"**

### 2.3. Cấu hình Project (KHÁC với Website!)
```
Project Name: techshift-admin (hoặc tên bạn muốn)
Framework Preset: Next.js
Root Directory: apps/admin  ⚠️ KHÁC VỚI WEBSITE!
Build Command: (để mặc định)
Output Directory: (để mặc định)
Install Command: (để mặc định)
```

### 2.4. Thêm Environment Variables
Click **"Environment Variables"** và thêm:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_...
GEMINI_API_KEY=AIzaSyC...
ADMIN_PASSWORD=admin123
JWT_SECRET=your-secret-key-change-in-production
CRON_SECRET=your-cron-secret-key

# Cloudinary (cho upload ảnh)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2.5. Deploy
Click **"Deploy"** và đợi build hoàn tất.

---

## ✅ Kiểm tra Deploy thành công

Sau khi cả 2 projects deploy xong:

### Website Project:
- URL: `https://techshift-website.vercel.app` (hoặc domain của bạn)
- Kiểm tra: Trang chủ hiển thị bài viết

### Admin Project:
- URL: `https://techshift-admin.vercel.app` (hoặc domain của bạn)
- Kiểm tra: Trang login hiển thị
- Đăng nhập với password: `admin123`

---

## 🔄 Auto Deploy khi Push Code

Sau khi setup xong, **cả 2 projects** sẽ tự động deploy khi bạn push code lên GitHub!

### Cách hoạt động:
1. Bạn push code: `git push origin main`
2. Vercel phát hiện thay đổi
3. **Website project** build từ `apps/website/`
4. **Admin project** build từ `apps/admin/`
5. Cả 2 deploy song song

### Kiểm tra Deployment:
- Vào Vercel Dashboard
- Xem tab **"Deployments"** của mỗi project
- Kiểm tra status: ✅ Ready hoặc ⏳ Building

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi 1: Admin không deploy khi push code

**Nguyên nhân:** Chưa tạo project riêng cho admin

**Giải pháp:**
1. Tạo project mới trên Vercel
2. Import cùng repository
3. Set **Root Directory = apps/admin**
4. Deploy

### Lỗi 2: Build failed - "No database connection"

**Nguyên nhân:** Thiếu environment variables

**Giải pháp:**
1. Vào Settings → Environment Variables
2. Thêm `DATABASE_URL` và các biến khác
3. Redeploy

### Lỗi 3: Cả 2 projects deploy cùng code

**Nguyên nhân:** Root Directory không đúng

**Giải pháp:**
1. Vào Settings → General
2. Kiểm tra **Root Directory**:
   - Website: `apps/website`
   - Admin: `apps/admin`
3. Save và redeploy

### Lỗi 4: JWT/Auth không hoạt động

**Nguyên nhân:** Thiếu JWT_SECRET

**Giải pháp:**
1. Vào Admin project → Settings → Environment Variables
2. Thêm:
   ```
   JWT_SECRET=your-secret-key-minimum-32-characters
   ADMIN_PASSWORD=admin123
   ```
3. Redeploy

---

## 📊 Monitoring Deployments

### Xem Logs:
1. Vào project → Deployments
2. Click vào deployment mới nhất
3. Xem **Build Logs** để debug

### Xem Runtime Logs:
1. Vào project → Logs
2. Xem real-time logs của ứng dụng đang chạy

---

## 🎯 Checklist Deploy thành công

### Website Project:
- [ ] Root Directory = `apps/website`
- [ ] Environment Variables đã thêm
- [ ] Build thành công (✅ Ready)
- [ ] Truy cập URL được
- [ ] Hiển thị bài viết

### Admin Project:
- [ ] Root Directory = `apps/admin`
- [ ] Environment Variables đã thêm (bao gồm JWT_SECRET)
- [ ] Build thành công (✅ Ready)
- [ ] Truy cập URL được
- [ ] Login page hiển thị
- [ ] Đăng nhập được với password

### Auto Deploy:
- [ ] Push code lên GitHub
- [ ] Cả 2 projects tự động trigger deployment
- [ ] Kiểm tra Deployments tab thấy build mới

---

## 💡 Tips

### 1. Đặt tên Project rõ ràng
```
✅ Good:
- techshift-website
- techshift-admin

❌ Bad:
- my-project
- test-123
```

### 2. Sử dụng Production Branch
Nếu muốn test trước khi deploy production:
1. Tạo branch `develop`
2. Trong Vercel Settings → Git
3. Set Production Branch = `main`
4. Preview Deployments = `develop`

### 3. Custom Domains
Sau khi deploy thành công:
1. Vào Settings → Domains
2. Thêm domain của bạn:
   - Website: `techshift.vn`
   - Admin: `admin.techshift.vn`

### 4. Environment Variables cho nhiều môi trường
Vercel hỗ trợ 3 môi trường:
- **Production**: Khi deploy từ main branch
- **Preview**: Khi deploy từ PR hoặc branch khác
- **Development**: Khi chạy `vercel dev` local

Bạn có thể set biến khác nhau cho mỗi môi trường!

---

## 🔗 Links hữu ích

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Monorepo Guide: https://vercel.com/docs/monorepos

---

**Chúc bạn deploy thành công! 🚀**
