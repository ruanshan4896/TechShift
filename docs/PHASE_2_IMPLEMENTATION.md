# Phase 2 Implementation Guide

## ✅ Đã hoàn thành

### 1. Database Schema ✅
- Bảng `categories` (id, name, slug)
- Bảng `tags` (id, name, slug)
- Bảng `article_tags` (junction table)
- Cập nhật `articles`: thêm `category_id`, `view_count`
- Seed 7 categories và 21 tags

### 2. Database Functions ✅
- `getAllCategories()`, `getCategoryBySlug()`
- `getAllTags()`, `getPopularTags()`, `getTagBySlug()`
- `getArticlesByCategory()`, `getArticlesByTag()`
- `getArticleTags()`, `linkArticleToTags()`
- `searchArticles()`, `incrementViewCount()`
- `getFeaturedArticles()`

### 3. Header Component ✅
- Menu responsive với hamburger
- Dropdown submenu cho "Tin tức"
- Search bar tích hợp
- Sticky header

## 🚧 Cần tạo tiếp

### Components cần tạo:

#### 1. Breadcrumbs Component
```tsx
// components/Breadcrumbs.tsx
'use client';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://your-domain.com${item.href}` : undefined
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:text-blue-700">
          <Home size={16} />
        </Link>
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight size={16} />
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className="hover:text-blue-700">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
```

#### 2. Sidebar Component
```tsx
// components/Sidebar.tsx
import Link from 'next/link';
import { getFeaturedArticles, getLatestArticles, getPopularTags } from '@/lib/db';

export default async function Sidebar() {
  const featured = await getFeaturedArticles(5);
  const latest = await getLatestArticles(5);
  const tags = await getPopularTags(10);

  return (
    <aside className="space-y-6">
      {/* Featured Articles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Bài viết nổi bật</h3>
        <div className="space-y-3">
          {featured.map((article) => (
            <Link
              key={article.id}
              href={`/posts/${article.slug}`}
              className="block hover:text-blue-700"
            >
              <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{article.view_count} lượt xem</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Articles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Bài viết mới nhất</h3>
        <div className="space-y-3">
          {latest.map((article) => (
            <Link
              key={article.id}
              href={`/posts/${article.slug}`}
              className="block hover:text-blue-700"
            >
              <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Tags phổ biến</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
```

#### 3. Footer Component
```tsx
// components/Footer.tsx
import Link from 'next/link';
import { Facebook, Twitter, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Tech News</h3>
            <p className="text-sm">
              Website tin tức công nghệ hàng đầu Việt Nam. Cập nhật tin tức mới nhất về AI, Mobile, PC và nhiều hơn nữa.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/ai" className="hover:text-white">AI</Link></li>
              <li><Link href="/category/mobile" className="hover:text-white">Mobile</Link></li>
              <li><Link href="/category/pc-hardware" className="hover:text-white">PC & Hardware</Link></li>
              <li><Link href="/admin/rss" className="hover:text-white">Admin</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Theo dõi</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white"><Facebook size={24} /></a>
              <a href="#" className="hover:text-white"><Twitter size={24} /></a>
              <a href="#" className="hover:text-white"><Youtube size={24} /></a>
              <a href="#" className="hover:text-white"><Mail size={24} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Tech News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

### Pages cần tạo:

#### 1. Category Page
```tsx
// app/category/[slug]/page.tsx
import { getCategoryBySlug, getArticlesByCategory } from '@/lib/db';
import Breadcrumbs from '@/components/Breadcrumbs';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import Image from 'next/image';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const articles = await getArticlesByCategory(slug);

  if (!category) return <div>Category not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: category.name }]} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
          <div className="space-y-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/posts/${article.slug}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="flex">
                  <Image src={article.cover_image_url} alt={article.title} width={200} height={150} className="object-cover" />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                    <p className="text-gray-600 text-sm line-clamp-2">{article.summary}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
```

#### 2. Tag Page
```tsx
// app/tags/[slug]/page.tsx
import { getTagBySlug, getArticlesByTag } from '@/lib/db';
import Breadcrumbs from '@/components/Breadcrumbs';
// Similar to category page
```

#### 3. Search Page
```tsx
// app/search/page.tsx
import { searchArticles } from '@/lib/db';
import Breadcrumbs from '@/components/Breadcrumbs';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const results = q ? await searchArticles(q) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Tìm kiếm' }]} />
      <h1 className="text-3xl font-bold mb-6">
        Kết quả tìm kiếm: "{q}"
      </h1>
      <p className="text-gray-600 mb-6">Tìm thấy {results.length} kết quả</p>
      {/* Display results */}
    </div>
  );
}
```

## Commands

```bash
# Seed categories and tags
npm run seed:categories

# Check database
npm run check
```

## Next Steps

1. Tạo các components còn lại (Breadcrumbs, Sidebar, Footer)
2. Tạo các pages (category, tag, search)
3. Cập nhật layout.tsx để include Header và Footer
4. Tạo admin dashboard và editor
5. Test toàn bộ hệ thống

## Notes

- Tất cả components đã được thiết kế responsive
- SEO-optimized với structured data
- Internal linking tự động
- View count tracking
