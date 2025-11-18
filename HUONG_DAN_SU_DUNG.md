# 📖 Hướng Dẫn Sử Dụng - TechShift

## 🚀 Khởi động ứng dụng trên localhost (macOS)

### Bước 1: Mở Terminal

Nhấn `Cmd + Space`, gõ "Terminal" và Enter

### Bước 2: Di chuyển vào thư mục dự án

```bash
cd ~/Desktop/test\ kiro/tech-news
```

### Bước 3: Khởi động ứng dụng

```bash
npm run dev
```

**Hoặc nếu đang có lỗi, dùng lệnh này:**

```bash
# Xóa lock file cũ (nếu có lỗi)
rm -f apps/website/.next/dev/lock
rm -f apps/admin/.next/dev/lock

# Kill process cũ
pkill -f "next dev"

# Khởi động lại
npm run dev
```

### Bước 4: Truy cập ứng dụng

Sau khi khởi động thành công, mở trình duyệt:

- **Website (Public):** http://localhost:3000
- **Admin Dashboard:** http://localhost:3001

**Đăng nhập Admin:**
- Mật khẩu mặc định: `admin123`
- Session có hiệu lực 8 giờ

### Bước 5: Dừng ứng dụng

Trong Terminal, nhấn `Ctrl + C`

---

## 📤 Push code lên GitHub

### Cách 1: Sử dụng Terminal (Khuyên dùng)

```bash
# 1. Kiểm tra trạng thái
git status

# 2. Thêm tất cả thay đổi
git add .

# 3. Commit với message
git commit -m "feat: mô tả thay đổi của bạn"

# 4. Push lên GitHub
git push origin main
```

### Cách 2: Sử dụng Kiro IDE

1. Mở Source Control panel (biểu tượng Git bên trái)
2. Xem các file đã thay đổi
3. Nhập commit message
4. Click "Commit"
5. Click "Push"

### Ví dụ commit messages hay:

```bash
# Thêm tính năng mới
git commit -m "feat: thêm chức năng upload ảnh"

# Sửa lỗi
git commit -m "fix: sửa lỗi hiển thị breadcrumb"

# Cập nhật tài liệu
git commit -m "docs: cập nhật hướng dẫn sử dụng"

# Cải thiện hiệu suất
git commit -m "perf: tối ưu tốc độ load ảnh"

# Refactor code
git commit -m "refactor: tối ưu code authentication"
```

---

## 🔧 Các lệnh hữu ích khác

### Quản lý Dependencies

```bash
# Cài đặt dependencies mới
pnpm install

# Thêm package cho website
pnpm --filter website add package-name

# Thêm package cho admin
pnpm --filter admin add package-name

# Xóa package
pnpm --filter website remove package-name
```

### Database Commands

```bash
# Seed database với sample data
pnpm seed

# Seed RSS sources
pnpm seed:rss

# Seed categories và tags
pnpm seed:categories
```

### Build cho Production

```bash
# Build tất cả apps
pnpm build

# Build riêng website
pnpm --filter website build

# Build riêng admin
pnpm --filter admin build
```

### Kiểm tra lỗi

```bash
# TypeScript type checking
pnpm --filter website tsc --noEmit
pnpm --filter admin tsc --noEmit

# Lint code
pnpm --filter website lint
pnpm --filter admin lint
```

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi: Port đã được sử dụng

```bash
# Kill process đang dùng port 3000
lsof -ti:3000 | xargs kill -9

# Kill process đang dùng port 3001
lsof -ti:3001 | xargs kill -9
```

### Lỗi: Lock file

```bash
# Xóa lock files
rm -f apps/website/.next/dev/lock
rm -f apps/admin/.next/dev/lock
```

### Lỗi: Dependencies

```bash
# Xóa node_modules và cài lại
rm -rf node_modules apps/*/node_modules
pnpm install
```

### Lỗi: Git conflicts

```bash
# Xem conflicts
git status

# Hủy thay đổi local (cẩn thận!)
git reset --hard origin/main

# Hoặc stash thay đổi
git stash
git pull
git stash pop
```

---

## 📁 Cấu trúc thư mục

```
tech-news/
├── apps/
│   ├── website/          # Public website (port 3000)
│   │   ├── app/          # Pages & routes
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities & DB
│   │
│   └── admin/            # Admin dashboard (port 3001)
│       ├── app/          # Admin pages
│       ├── middleware.ts # Auth protection
│       └── lib/          # Admin utilities
│
├── docs/                 # Documentation
├── .env.local           # Environment variables (root)
└── pnpm-workspace.yaml  # Monorepo config
```

---

## 🔐 Environment Variables

### Website (.env.local hoặc apps/website/.env.local)

```bash
DATABASE_URL="your-neon-database-url"
GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

### Admin (apps/admin/.env.local)

```bash
DATABASE_URL="your-neon-database-url"
GEMINI_API_KEY="your-gemini-api-key"
ADMIN_PASSWORD="admin123"
JWT_SECRET="your-secret-key-change-in-production"
CRON_SECRET="your-cron-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## 🌐 Deploy lên Vercel

### Bước 1: Push code lên GitHub

```bash
git add .
git commit -m "feat: ready for deployment"
git push origin main
```

### Bước 2: Import vào Vercel

1. Truy cập https://vercel.com
2. Click "Add New" → "Project"
3. Import repository từ GitHub
4. Tạo 2 projects riêng:
   - **Website**: Root Directory = `apps/website`
   - **Admin**: Root Directory = `apps/admin`

### Bước 3: Thêm Environment Variables

Vào Settings → Environment Variables của mỗi project và thêm các biến môi trường tương ứng.

### Bước 4: Deploy

Vercel sẽ tự động deploy khi bạn push code lên GitHub!

---

## 💡 Tips & Tricks

### 1. Xem logs real-time

```bash
# Trong terminal đang chạy npm run dev
# Logs sẽ hiển thị tự động
```

### 2. Clear cache

```bash
# Xóa .next folders
rm -rf apps/website/.next apps/admin/.next

# Xóa cache của pnpm
pnpm store prune
```

### 3. Kiểm tra version

```bash
node --version    # Nên >= 18
pnpm --version    # Nên >= 8
git --version     # Kiểm tra git đã cài
```

### 4. Mở nhanh trong VS Code

```bash
# Mở thư mục hiện tại
code .

# Mở file cụ thể
code apps/website/app/page.tsx
```

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:

1. Kiểm tra logs trong Terminal
2. Xem file `TROUBLESHOOTING.md` (nếu có)
3. Kiểm tra GitHub Issues
4. Đọc docs trong thư mục `docs/`

---

## 🎯 Workflow khuyên dùng

```bash
# 1. Bắt đầu làm việc
cd ~/Desktop/test\ kiro/tech-news
git pull origin main
npm run dev

# 2. Code & test
# ... làm việc ...

# 3. Commit thường xuyên
git add .
git commit -m "feat: mô tả ngắn gọn"

# 4. Push cuối ngày
git push origin main

# 5. Dừng server
# Ctrl + C trong Terminal
```

---

**Chúc bạn code vui vẻ! 🚀**
