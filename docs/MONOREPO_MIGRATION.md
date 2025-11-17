# Monorepo Migration Guide

## ⚠️ Important Notice

Việc migrate sang monorepo là một thay đổi lớn. Đề xuất backup toàn bộ project trước khi thực hiện.

## Current Status

✅ Created:
- `pnpm-workspace.yaml`
- `apps/` directory
- `packages/ui/` directory
- `packages/lib/` directory
- `migrate-to-monorepo.sh` script

## Manual Migration Steps

### Step 1: Backup Current Project

```bash
cd ..
cp -r tech-news tech-news-backup
cd tech-news
```

### Step 2: Run Migration Script

```bash
./migrate-to-monorepo.sh
```

OR manually:

```bash
# Move main app to apps/website
mkdir -p apps/website
mv app components lib public scripts .env.local .gitignore \
   eslint.config.mjs next.config.ts next-env.d.ts package.json \
   postcss.config.mjs tailwind.config.ts tsconfig.json vercel.json \
   apps/website/

# Move docs
mkdir -p docs
mv *.md docs/
```

### Step 3: Create Root package.json

```json
{
  "name": "tech-news-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter \"./apps/*\" dev",
    "dev:website": "pnpm --filter website dev",
    "dev:admin": "pnpm --filter admin dev",
    "build": "pnpm --filter \"./apps/*\" build",
    "build:website": "pnpm --filter website build",
    "build:admin": "pnpm --filter admin build",
    "lint": "pnpm --filter \"./apps/*\" lint"
  }
}
```

### Step 4: Update apps/website/package.json

Add name field:
```json
{
  "name": "website",
  ...
}
```

### Step 5: Create apps/admin

```bash
mkdir -p apps/admin/app apps/admin/components apps/admin/lib
```

Create `apps/admin/package.json`:
```json
{
  "name": "admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start --port 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "16.0.3",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "lucide-react": "latest",
    "@neondatabase/serverless": "^0.10.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.0.3",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### Step 6: Move Admin Code

```bash
# Move admin routes
mv apps/website/app/admin apps/admin/app/

# Move admin API routes
mkdir -p apps/admin/app/api
mv apps/website/app/api/articles apps/admin/app/api/
mv apps/website/app/api/categories apps/admin/app/api/
mv apps/website/app/api/rss-sources apps/admin/app/api/

# Keep shared APIs in website
# - /api/fetch-rss
# - /api/process-articles
```

### Step 7: Copy Shared Files

```bash
# Copy lib to admin
cp -r apps/website/lib apps/admin/

# Copy .env.local to admin
cp apps/website/.env.local apps/admin/

# Copy config files
cp apps/website/next.config.ts apps/admin/
cp apps/website/tsconfig.json apps/admin/
cp apps/website/postcss.config.mjs apps/admin/
cp apps/website/tailwind.config.ts apps/admin/
```

### Step 8: Create Admin Layout

`apps/admin/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin - Tech News",
  description: "Admin dashboard for Tech News",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
```

`apps/admin/app/page.tsx`:
```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRoot() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
```

### Step 9: Update Import Paths in Admin

Search and replace in `apps/admin/`:
- `@/lib/` → `@/lib/` (no change needed if using same alias)
- `@/components/` → `@/components/`

### Step 10: Install Dependencies

```bash
# Install pnpm if not installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

### Step 11: Test Both Apps

```bash
# Terminal 1: Website
pnpm dev:website
# Access: http://localhost:3000

# Terminal 2: Admin
pnpm dev:admin
# Access: http://localhost:3001
```

## Final Structure

```
tech-news/
├── apps/
│   ├── website/          # Public website (port 3000)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   └── admin/            # Admin dashboard (port 3001)
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── package.json
├── packages/
│   ├── ui/               # Shared components (future)
│   └── lib/              # Shared utilities (future)
├── docs/                 # Documentation
├── pnpm-workspace.yaml
└── package.json          # Root package.json
```

## Benefits

### Security
- ✅ Admin on separate port (3001)
- ✅ Can deploy to different domains
- ✅ Separate authentication
- ✅ No admin code in public bundle

### Performance
- ✅ Smaller bundle size for website
- ✅ Independent builds
- ✅ Faster development

### Maintainability
- ✅ Clear separation of concerns
- ✅ Easier to manage dependencies
- ✅ Shared code in packages/

## Deployment

### Website (Vercel)
```bash
# Deploy from apps/website
vercel --cwd apps/website
```

### Admin (Vercel)
```bash
# Deploy from apps/admin
vercel --cwd apps/admin
```

Or use separate Vercel projects for each app.

## Troubleshooting

### pnpm not found
```bash
npm install -g pnpm
```

### Module not found
```bash
pnpm install
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Import errors
Check tsconfig.json paths are correct:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Rollback

If migration fails:
```bash
cd ..
rm -rf tech-news
mv tech-news-backup tech-news
cd tech-news
```

## Next Steps

1. Move shared components to `packages/ui/`
2. Move shared utilities to `packages/lib/`
3. Setup shared TypeScript config
4. Add shared ESLint config
5. Setup Turborepo for better caching (optional)

## Notes

- This is a major refactor
- Test thoroughly before deploying
- Consider doing this in a separate branch
- Update CI/CD pipelines accordingly
