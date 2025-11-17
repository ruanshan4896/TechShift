import { findRelatedArticles } from './db';

interface InternalLink {
  keyword: string;
  url: string;
  title: string;
}

export async function buildInternalLinks(
  content: string,
  keywords: string[],
  currentSlug: string,
  maxLinks: number = 4
): Promise<string> {
  const links: InternalLink[] = [];

  // Tìm bài viết liên quan cho mỗi keyword
  for (const keyword of keywords) {
    if (links.length >= maxLinks) break;

    const relatedArticles = await findRelatedArticles(keyword, currentSlug, 1);
    
    if (relatedArticles.length > 0) {
      const article = relatedArticles[0];
      links.push({
        keyword,
        url: `/posts/${article.slug}`,
        title: article.title,
      });
    }
  }

  // Chèn links vào content
  let updatedContent = content;
  const insertedKeywords = new Set<string>();

  for (const link of links) {
    // Tìm lần xuất hiện đầu tiên của keyword (case-insensitive)
    const regex = new RegExp(`\\b${escapeRegex(link.keyword)}\\b`, 'i');
    const match = updatedContent.match(regex);

    if (match && !insertedKeywords.has(link.keyword.toLowerCase())) {
      // Thay thế lần xuất hiện đầu tiên bằng link
      updatedContent = updatedContent.replace(
        regex,
        `<a href="${link.url}" title="${link.title}" class="internal-link">${match[0]}</a>`
      );
      insertedKeywords.add(link.keyword.toLowerCase());
    }
  }

  return updatedContent;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function countInternalLinks(content: string): number {
  const matches = content.match(/<a[^>]*class="internal-link"[^>]*>/g);
  return matches ? matches.length : 0;
}
