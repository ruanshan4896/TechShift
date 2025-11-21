/**
 * Internal Linking Utilities
 * Smart insertion of internal links between paragraphs
 */

export interface RelatedArticle {
  title: string;
  slug: string;
}

/**
 * Remove duplicate articles from the list
 * Ensures each article appears only once
 */
function deduplicateArticles(articles: RelatedArticle[]): RelatedArticle[] {
  const seen = new Set<string>();
  return articles.filter(article => {
    if (seen.has(article.slug)) {
      return false;
    }
    seen.add(article.slug);
    return true;
  });
}

/**
 * Calculate optimal positions for inserting links
 * Distributes links evenly throughout the content
 */
function calculateLinkPositions(
  totalParagraphs: number,
  numLinks: number
): number[] {
  if (totalParagraphs < 3 || numLinks === 0) return [];

  const positions: number[] = [];
  
  // Avoid first and last paragraph
  const availableRange = totalParagraphs - 2;
  
  if (availableRange <= 0) return [];

  // Calculate spacing between links
  const spacing = Math.floor(availableRange / (numLinks + 1));

  for (let i = 1; i <= numLinks; i++) {
    const position = Math.min(
      spacing * i,
      totalParagraphs - 2 // Ensure we don't go past the second-to-last paragraph
    );
    positions.push(position);
  }

  return positions;
}

/**
 * Check if a paragraph is suitable for inserting a link after it
 * Avoids headers, code blocks, lists, etc.
 */
function isSuitableParagraph(paragraph: string): boolean {
  if (!paragraph || paragraph.trim().length < 50) return false;
  
  // Skip headers
  if (/^#{1,6}\s/.test(paragraph.trim())) return false;
  
  // Skip code blocks
  if (paragraph.includes('```')) return false;
  
  // Skip lists
  if (/^[\s]*[-*+]\s/.test(paragraph)) return false;
  if (/^[\s]*\d+\.\s/.test(paragraph)) return false;
  
  // Skip blockquotes (to avoid nested blockquotes)
  if (/^>\s/.test(paragraph.trim())) return false;
  
  // Skip if already contains a link
  if (paragraph.includes('[') && paragraph.includes('](')) return false;
  
  return true;
}

/**
 * Insert internal links between paragraphs using blockquote format
 * 
 * Features:
 * - Deduplicates related articles
 * - Inserts links between paragraphs (not at the end)
 * - Uses blockquote format for clear separation
 * - Distributes links evenly throughout content
 * - Avoids unsuitable paragraphs (headers, code, lists)
 * 
 * @param content - The article content in Markdown
 * @param relatedArticles - Array of related articles to link to
 * @param maxLinks - Maximum number of links to insert (default: 3)
 * @returns Modified content with internal links
 */
export function insertInternalLinks(
  content: string,
  relatedArticles: RelatedArticle[],
  maxLinks: number = 3
): string {
  if (!content || relatedArticles.length === 0) return content;

  // Step 1: Deduplicate articles
  const uniqueArticles = deduplicateArticles(relatedArticles);
  
  if (uniqueArticles.length === 0) return content;

  // Step 2: Split content into paragraphs
  const paragraphs = content.split('\n\n');
  
  if (paragraphs.length < 3) return content; // Too short to insert links

  // Step 3: Determine how many links to insert
  const numLinksToInsert = Math.min(maxLinks, uniqueArticles.length);

  // Step 4: Calculate optimal positions
  const positions = calculateLinkPositions(paragraphs.length, numLinksToInsert);

  if (positions.length === 0) return content;

  // Step 5: Insert links at calculated positions
  let linksInserted = 0;
  const result: string[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    // Add the current paragraph
    result.push(paragraphs[i]);

    // Check if we should insert a link after this paragraph
    const positionIndex = positions.indexOf(i);
    
    if (positionIndex !== -1 && linksInserted < numLinksToInsert) {
      // Verify this is a suitable paragraph
      if (isSuitableParagraph(paragraphs[i])) {
        const article = uniqueArticles[linksInserted];
        
        // Insert link in blockquote format
        const linkBlock = `\n> **Xem thêm:** [${article.title}](/posts/${article.slug})\n`;
        result.push(linkBlock);
        
        linksInserted++;
      }
    }
  }

  return result.join('\n\n');
}

/**
 * Legacy function for backward compatibility
 * Redirects to the new insertInternalLinks function
 */
export function insertInternalLinksLegacy(
  content: string,
  relatedArticles: Array<{ title: string; slug: string }>,
  maxLinks: number = 3
): string {
  return insertInternalLinks(content, relatedArticles, maxLinks);
}
