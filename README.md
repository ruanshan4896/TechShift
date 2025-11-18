# TechShift - Tech News Platform

A modern tech news platform built with Next.js 15, featuring a public website and admin dashboard.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

**Access:**
- Website: http://localhost:3000
- Admin: http://localhost:3001 (password: admin123)

## 📁 Structure

```
tech-news/
├── apps/
│   ├── website/    # Public website (port 3000)
│   └── admin/      # Admin dashboard (port 3001)
└── pnpm-workspace.yaml
```

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` in each app and configure:

- `DATABASE_URL` - Neon PostgreSQL connection
- `GEMINI_API_KEY` - Google Gemini API key
- `ADMIN_PASSWORD` - Admin login password

## 📦 Features

- **Website**: Article browsing, search, categories, tags
- **Admin**: Article management, RSS feeds, image uploads
- **Auth**: JWT-based session authentication
- **SEO**: Sitemap, robots.txt, meta tags
- **Images**: Cloudinary integration for optimization

## 🚀 Deploy

Deploy to Vercel as 2 separate projects:
1. Website: Root Directory = `apps/website`
2. Admin: Root Directory = `apps/admin`

Both will auto-deploy when you push to GitHub.
