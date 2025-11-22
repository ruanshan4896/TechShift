# TechShift - Project Context

> Tài liệu tổng hợp toàn bộ ngữ cảnh dự án cho AI Assistant

**Generated:** November 23, 2025  
**Project:** TechShift - AI-Powered Tech News CMS  
**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, Neon Postgres, Google Gemini AI, Three.js & React Three Fiber

---

## 📁 Cấu trúc thư mục

```
techshift/
├── README.md                          # Tài liệu chính
├── package.json                       # Root package config
├── pnpm-workspace.yaml               # Monorepo workspace config
│
├── apps/
│   ├── admin/                        # Admin CMS Application
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # Dashboard with bulk actions
│   │   │   ├── editor/
│   │   │   │   └── [id]/page.tsx    # Article editor
│   │   │   ├── rss/
│   │   │   │   └── page.tsx         # RSS manager with processing logs
│   │   │   └── api/
│   │   │       ├── login/route.ts
│   │   │       ├── logout/route.ts
│   │   │       ├── articles/
│   │   │       │   ├── route.ts
│   │   │       │   ├── [id]/route.ts
│   │   │       │   ├── [id]/publish/route.ts
│   │   │       │   ├── bulk-publish/route.ts
│   │   │       │   └── bulk-delete/route.ts
│   │   │       ├── process-rss/
│   │   │       │   └── [sourceId]/route.ts
│   │   │       ├── rss-sources/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       └── tags/route.ts
│   │   ├── lib/
│   │   │   ├── ai-processor.ts      # AI processing engine (Gemini)
│   │   │   ├── internal-linking.ts  # Smart internal linking
│   │   │   ├── markdown-utils.ts    # Markdown utilities
│   │   │   └── db.ts                # Database functions
│   │   ├── components/
│   │   │   └── TagSelector.tsx
│   │   ├── middleware.ts            # Auth middleware
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── tsconfig.json
│   │
│   └── website/                     # Public Website Application
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx             # Homepage
│       │   ├── posts/
│       │   │   └── [slug]/page.tsx  # Article detail
│       │   ├── category/
│       │   │   └── [slug]/page.tsx  # Category page
│       │   ├── tags/
│       │   │   └── [slug]/page.tsx  # Tag page
│       │   ├── search/
│       │   │   └── page.tsx         # Search page
│       │   ├── sitemap.ts
│       │   ├── robots.ts
│       │   └── api/
│       │       └── increment-view/
│       │           └── [slug]/route.ts
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   ├── Sidebar.tsx
│       │   ├── ArticleContent.tsx
│       │   ├── RelatedPosts.tsx
│       │   ├── Pagination.tsx
│       │   └── ViewCounter.tsx
│       ├── lib/
│       │   └── db.ts                # Database functions (with PUBLISHED filter)
│       ├── scripts/
│       │   └── seed.ts              # Database seeding
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
│
└── .vscode/
    └── settings.json
```

---

## 📄 Nội dung các file quan trọng


## 🔑 Core Files

Dưới đây là nội dung các file quan trọng nhất của dự án:

---

### Configuration Files

#### package.json (Root)

```json
{
  "name": "tech-news-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter \"./apps/*\" dev",
    "build": "pnpm --filter \"./apps/*\" build"
  }
}
```

#### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

### Admin App - Core Libraries

#### apps/admin/lib/ai-processor.ts

**Purpose:** AI processing engine using Google Gemini API

**Key Features:**
- Key rotation system (20 keys support)
- Article analysis and rewriting
- Vietnamese language optimization
- HTML entities decoding
- Markdown stripping for meta fields
- Smart internal linking

**Main Functions:**
- `analyzeArticle()` - Extract keywords, tags, slug
- `rewriteArticle()` - Rewrite content with AI
- `insertInternalLinks()` - Add internal links
- `processArticleWithAI()` - Main orchestrator

---

#### apps/admin/lib/internal-linking.ts

**Purpose:** Smart internal linking with deduplication

**Key Features:**
- Deduplicate related articles
- Calculate optimal link positions
- Validate suitable paragraphs
- Blockquote format for links

**Algorithm:**
1. Remove duplicate articles by slug
2. Calculate even distribution positions
3. Validate paragraphs (skip headers, code, lists)
4. Insert links in blockquote format

---

#### apps/admin/lib/markdown-utils.ts

**Purpose:** Markdown processing utilities

**Key Functions:**
- `stripMarkdown()` - Remove all Markdown syntax
- `truncateText()` - Smart truncation at word boundaries
- `createMetaDescription()` - Create SEO-friendly meta descriptions

---

#### apps/admin/lib/db.ts

**Purpose:** Database functions for admin operations

**Key Features:**
- Article CRUD operations
- Draft/Published status management
- RSS source management
- Tag and category management
- Bulk operations support

**Important:** Includes functions for both DRAFT and PUBLISHED articles

---

### Admin App - API Routes

#### apps/admin/app/api/process-rss/[sourceId]/route.ts

**Purpose:** Fetch and process RSS feeds with AI

**Response Structure:**
```typescript
{
  success: true,
  source: "Source Name",
  summary: {
    total: 10,
    success: 2,
    skipped: 7,
    failed: 1
  },
  logs: [
    {
      title: "Article Title",
      url: "https://...",
      status: "SUCCESS" | "SKIPPED" | "FAILED",
      message: "Detailed reason..."
    }
  ]
}
```

**Processing Flow:**
1. Fetch RSS feed
2. Check for duplicates (by original_url)
3. Process with AI (if not duplicate)
4. Save as draft
5. Create tags
6. Add internal links
7. Return detailed logs

---

#### apps/admin/app/api/articles/[id]/route.ts

**Purpose:** Single article CRUD operations

**Key Features:**
- GET: Fetch article with tags
- PUT: Update article and tags
- DELETE: Delete article + raw_articles (fuzzy matching)

**Delete Logic:**
- Extract key words from title
- Build ILIKE conditions with AND
- Delete matching raw_articles
- Allows re-fetching from RSS

---

#### apps/admin/app/api/articles/bulk-delete/route.ts

**Purpose:** Bulk delete articles

**Key Features:**
- Accept array of IDs
- Delete all articles
- Delete related raw_articles (fuzzy matching)
- Revalidate cache

---

#### apps/admin/app/api/articles/bulk-publish/route.ts

**Purpose:** Bulk publish articles

**Key Features:**
- Accept array of IDs
- Update all to PUBLISHED status
- Revalidate cache

---

### Admin App - UI Components

#### apps/admin/app/rss/page.tsx

**Purpose:** RSS Manager with processing logs modal

**Key Features:**
- RSS source CRUD
- Fetch & Process button
- Detailed processing logs modal
- Color-coded status (Success/Skipped/Failed)
- Server-side authentication

**Processing Logs Modal:**
- Summary statistics (Total, Success, Skipped, Failed)
- Detailed log list with reasons
- Clickable URLs
- Color-coded cards

---

#### apps/admin/app/dashboard/page.tsx

**Purpose:** Article management dashboard

**Key Features:**
- Draft/Published tabs
- Bulk actions (select all, publish, delete)
- Floating action bar
- Checkbox selection
- Article preview

**Bulk Operations:**
- Select individual or all articles
- Bulk publish (drafts only)
- Bulk delete (all)
- Confirmation dialogs

---

### Website App - Core Libraries

#### apps/website/lib/db.ts

**Purpose:** Database functions for public website

**CRITICAL DIFFERENCE:** All queries filter by `status = 'PUBLISHED'`

**Key Functions:**
- `getLatestArticles()` - Homepage articles
- `getArticleBySlug()` - Article detail (404 if DRAFT)
- `getArticlesByCategory()` - Category pages
- `getArticlesByTag()` - Tag pages
- `searchArticles()` - Search functionality
- `getFeaturedArticles()` - Featured section
- `getRelatedArticlesByTags()` - Related articles

**Security:** Draft articles never visible on public website

---

### Website App - Components

#### apps/website/components/TechBackground.tsx

**Purpose:** 3D particle network background using Three.js

**Features:**
- Particle system with 100 particles
- Neural network-style connections between nearby particles
- Smooth rotation and animation
- Cyan particles with purple connection lines
- Dark gradient background (slate to indigo)
- Performance optimized with React Three Fiber
- Fixed positioning (z-index: -10)

**Tech Stack:**
- Three.js for 3D rendering
- @react-three/fiber for React integration
- @react-three/drei for helpers (Points, PointMaterial)

**Animation:**
- Continuous rotation on Y-axis (0.05 speed)
- Sine wave motion on X-axis
- Smooth 60fps rendering

#### apps/website/components/ArticleCard.tsx

**Purpose:** Glassmorphism article card with hover effects

**Features:**
- Backdrop blur with semi-transparent background
- Cover image with gradient overlay
- Meta information (date, view count)
- Hover effects (scale, glow, color change)
- Responsive design
- Line clamp for title and summary

**Design:**
- Background: `bg-white/10 backdrop-blur-md`
- Border: `border-white/20` → `border-cyan-500/50` on hover
- Shadow: Cyan glow on hover
- Text: White with cyan accent on hover

### Website App - Pages

#### apps/website/app/page.tsx

**Purpose:** Futuristic homepage with 3D background

**Features:**
- **3D Particle Background:** Neural network-style particle system with Three.js
- **Hero Section:** Gradient text (TechShift), glassmorphism subtitle
- **Article Grid:** 2-column responsive grid with glassmorphism cards
- **Sidebar:** Popular tags and categories
- **ISR:** Revalidate every hour
- **Pagination:** Server-side pagination

**Design System:**
- 3D particle network background (cyan/purple theme)
- Glassmorphism cards with backdrop blur
- Dark theme with neon accents
- Futuristic tech aesthetic
- Responsive grid layout

---

#### apps/website/app/posts/[slug]/page.tsx

**Purpose:** Article detail page with Advanced SEO

**Features:**
- Full article content render
- **Advanced SEO:**
  - Full Metadata (Canonical, OpenGraph, Twitter Cards)
  - **JSON-LD Schema:** `NewsArticle` & `BreadcrumbList` implementation
  - Keywords from article tags
  - Author and publisher information
- View counter integration
- Related posts & Tags display
- Breadcrumbs navigation

**SEO Implementation:**
- Canonical URL via `alternates`
- Open Graph with article metadata (publishedTime, modifiedTime, authors, tags)
- Twitter Card (summary_large_image)
- NewsArticle schema with full article data
- BreadcrumbList schema for navigation hierarchy

---

## 🔐 Environment Variables

### Admin (.env.local)

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
ADMIN_PASSWORD="your-password"
JWT_SECRET="your-jwt-secret"

# AI
GEMINI_API_KEYS="key1,key2,key3,..."

# Optional
CRON_SECRET="your-cron-secret"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Website (.env.local)

```bash
# Database
DATABASE_URL="postgresql://..."
```

---

## 🗄️ Database Schema

### articles

```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  published_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category_id INTEGER,
  view_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('DRAFT', 'PUBLISHED')) DEFAULT 'PUBLISHED'
);
```

### raw_articles

```sql
CREATE TABLE raw_articles (
  id SERIAL PRIMARY KEY,
  source_id INTEGER REFERENCES rss_sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_url TEXT UNIQUE NOT NULL,
  original_content TEXT NOT NULL,
  publication_date TIMESTAMP NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processed', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### rss_sources

```sql
CREATE TABLE rss_sources (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rss_url TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### tags & categories

```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE article_tags (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);
```

---

## 🔄 Key Workflows

### 1. RSS Processing Workflow

```
1. Admin clicks "Fetch & Process" on RSS source
2. API fetches 10 latest articles from RSS
3. For each article:
   a. Check if original_url exists in raw_articles
   b. If exists → SKIP (log: "Duplicate URL")
   c. If not exists:
      - Decode HTML entities
      - Send to Gemini AI for analysis
      - Send to Gemini AI for rewriting
      - Generate slug (ensure unique)
      - Insert as DRAFT in articles table
      - Save to raw_articles (status: processed)
      - Create/link tags
      - Add internal links (if related articles found)
      - Log: SUCCESS
   d. If error → Log: FAILED with error message
4. Return detailed report with logs
5. Show processing logs modal to admin
```

### 2. Article Publishing Workflow

```
1. Admin reviews drafts in Dashboard
2. Options:
   a. Single publish: Click ✓ icon
   b. Bulk publish: Select multiple → Click "Xuất bản"
3. API updates status to 'PUBLISHED'
4. Article now visible on public website
5. Revalidate cache
```

### 3. Article Deletion Workflow

```
1. Admin deletes article (single or bulk)
2. API:
   a. Get article title
   b. Delete from articles table
   c. Extract key words from title
   d. Build fuzzy match query
   e. Delete matching raw_articles
3. Result: Can re-fetch from RSS
```

---

## 🎯 Critical Features

### 1. Duplicate Prevention

**Mechanism:** Check `original_url` in `raw_articles` before processing

**Benefits:**
- Save API quota
- Prevent duplicate content
- Fast skip (no AI call)

### 2. Draft Leak Prevention

**Mechanism:** All public queries filter by `status = 'PUBLISHED'`

**Affected Functions:** (15 functions in website/lib/db.ts)
- getLatestArticles
- getArticleBySlug
- getArticlesByCategory
- getArticlesByTag
- searchArticles
- getFeaturedArticles
- getRelatedArticlesByTags
- And more...

### 3. Smart Delete Sync

**Mechanism:** Fuzzy title matching to delete raw_articles

**Algorithm:**
1. Extract 5 key words (> 3 chars)
2. Build: `WHERE title ILIKE '%word1%' AND title ILIKE '%word2%' AND ...`
3. Delete matching records

**Benefits:**
- Can re-fetch deleted articles
- No foreign key needed
- Works with Vietnamese titles

### 4. Detailed Processing Reports

**Features:**
- Summary statistics
- Per-article status and reason
- Color-coded UI (green/yellow/red)
- Clickable URLs
- Professional modal

---

## 🚨 Important Notes

### For AI Assistants

1. **Never expose DRAFT articles on public website**
   - Always filter by `status = 'PUBLISHED'`
   - Check all query functions

2. **Duplicate prevention is critical**
   - Always check `original_url` before processing
   - Save to `raw_articles` after success

3. **Delete must sync with raw_articles**
   - Use fuzzy matching algorithm
   - Extract key words from title
   - Build AND conditions

4. **Vietnamese language optimization**
   - Tags must be Vietnamese
   - Content must be Vietnamese
   - Use `he` library for HTML entities

5. **AI processing is expensive**
   - Use key rotation
   - Skip duplicates early
   - Log all operations

---

## 📚 Additional Resources

- **README.md**: Complete documentation
- **GitHub**: https://github.com/ruanshan4896/TechShift
- **Tech Stack**: Next.js 16, TypeScript, Tailwind CSS, Neon Postgres, Google Gemini AI

---

**Document Version:** 1.0  
**Last Updated:** November 23, 2025  
**Status:** Production Ready ✅

