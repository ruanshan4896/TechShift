import { MetadataRoute } from 'next';
import { getLatestArticles, getAllCategories, getAllTags } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://techshift.vn'; // Replace with your actual domain

  // Fetch all articles
  const articles = await getLatestArticles(1000); // Get up to 1000 articles
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/posts/${article.slug}`,
    lastModified: new Date(article.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch all categories
  const categories = await getAllCategories();
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Fetch all tags
  const tags = await getAllTags();
  const tagUrls = tags.map((tag) => ({
    url: `${baseUrl}/tags/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];

  return [...staticPages, ...articleUrls, ...categoryUrls, ...tagUrls];
}
