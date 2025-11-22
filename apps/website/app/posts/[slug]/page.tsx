import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleTags } from "@/lib/db";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";
import type { Metadata } from "next";
import ArticleContent from "@/components/ArticleContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import Sidebar from "@/components/Sidebar";
import ViewCounter from "@/components/ViewCounter";
import RelatedPosts from "@/components/RelatedPosts";
import { Calendar, Eye, Tag } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Không tìm thấy bài viết",
    };
  }

  // Get article tags for metadata
  const tags = await getArticleTags(article.id);
  const tagNames = tags.map(tag => tag.name);

  // Get absolute URL for images
  const imageUrl = article.cover_image_url.startsWith('http') 
    ? article.cover_image_url 
    : `https://technews.vn${article.cover_image_url}`;

  const canonicalUrl = `https://technews.vn/posts/${article.slug}`;

  return {
    title: `${article.title} - TechShift`,
    description: article.summary,
    keywords: tagNames.join(', '),
    authors: [{ name: 'TechShift' }],
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      title: article.title,
      description: article.summary,
      url: canonicalUrl,
      siteName: 'TechShift',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'vi_VN',
      type: 'article',
      publishedTime: new Date(article.published_at).toISOString(),
      modifiedTime: new Date(article.published_at).toISOString(),
      authors: ['TechShift'],
      tags: tagNames,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [imageUrl],
      creator: '@TechShift',
      site: '@TechShift',
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get article tags
  const tags = await getArticleTags(article.id);

  // Prepare data for structured data
  const imageUrl = article.cover_image_url.startsWith('http') 
    ? article.cover_image_url 
    : `https://technews.vn${article.cover_image_url}`;
  
  const canonicalUrl = `https://technews.vn/posts/${article.slug}`;

  // JSON-LD: NewsArticle Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [imageUrl],
    datePublished: new Date(article.published_at).toISOString(),
    dateModified: new Date(article.published_at).toISOString(),
    author: {
      '@type': 'Organization',
      name: 'TechShift',
      url: 'https://technews.vn',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechShift',
      logo: {
        '@type': 'ImageObject',
        url: 'https://technews.vn/logo.png',
      },
    },
    description: article.summary,
    articleBody: article.content,
    keywords: tags.map(tag => tag.name).join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  // JSON-LD: BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://technews.vn',
      },
      ...(article.category_slug && article.category_name
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: article.category_name,
              item: `https://technews.vn/category/${article.category_slug}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: article.title,
              item: canonicalUrl,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 2,
              name: article.title,
              item: canonicalUrl,
            },
          ]),
    ],
  };

  // Breadcrumb items for UI
  const breadcrumbItems = article.category_slug && article.category_name
    ? [
        { label: article.category_name, href: `/category/${article.category_slug}` },
        { label: article.title.substring(0, 50) + (article.title.length > 50 ? '...' : '') }
      ]
    : [{ label: article.title.substring(0, 50) + (article.title.length > 50 ? '...' : '') }];

  return (
    <div className="bg-gray-50">
      {/* Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ViewCounter slug={slug} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96 w-full">
                <Image
                  src={getOptimizedCloudinaryUrl(article.cover_image_url, 1200)}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(article.published_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {article.view_count} lượt xem
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight title-case">
                  {article.title}
                </h1>

                <p className="text-xl text-gray-700 mb-6 italic border-l-4 border-blue-600 pl-4">
                  {article.summary}
                </p>

                {tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <Tag size={16} className="text-gray-500" />
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.slug}`}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6">
                  <ArticleContent content={article.content} />
                </div>
              </div>
            </article>

            <RelatedPosts articleId={article.id} />
          </div>

          <Sidebar />
        </div>
      </div>
    </div>
  );
}
