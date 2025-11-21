/**
 * Markdown Utilities
 * Helper functions for processing Markdown content
 */

/**
 * Strip all Markdown formatting from text, leaving only plain text
 * Useful for meta descriptions, summaries, etc.
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';

  let result = text;

  // Remove code blocks (```code```)
  result = result.replace(/```[\s\S]*?```/g, '');
  result = result.replace(/`[^`]+`/g, '');

  // Remove headers (# ## ###)
  result = result.replace(/^#{1,6}\s+/gm, '');

  // Remove bold (**text** or __text__)
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
  result = result.replace(/__([^_]+)__/g, '$1');

  // Remove italic (*text* or _text_)
  result = result.replace(/\*([^*]+)\*/g, '$1');
  result = result.replace(/_([^_]+)_/g, '$1');

  // Remove strikethrough (~~text~~)
  result = result.replace(/~~([^~]+)~~/g, '$1');

  // Remove links [text](url)
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove images ![alt](url)
  result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // Remove blockquotes (> text)
  result = result.replace(/^>\s+/gm, '');

  // Remove horizontal rules (---, ***, ___)
  result = result.replace(/^[-*_]{3,}\s*$/gm, '');

  // Remove list markers (-, *, +, 1.)
  result = result.replace(/^[\s]*[-*+]\s+/gm, '');
  result = result.replace(/^[\s]*\d+\.\s+/gm, '');

  // Remove HTML tags
  result = result.replace(/<[^>]+>/g, '');

  // Remove extra whitespace
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.replace(/\s{2,}/g, ' ');

  // Trim
  result = result.trim();

  return result;
}

/**
 * Truncate text to a maximum length, ensuring it ends at a word boundary
 * and adds ellipsis if truncated
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (!text || text.length <= maxLength) return text;

  // Find the last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Create a clean meta description from Markdown text
 * Strips Markdown and truncates to 160 characters
 */
export function createMetaDescription(text: string, maxLength: number = 160): string {
  const plainText = stripMarkdown(text);
  return truncateText(plainText, maxLength);
}
