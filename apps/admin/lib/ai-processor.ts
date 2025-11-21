import { GoogleGenerativeAI } from '@google/generative-ai';
import { decode as decodeHtmlEntities } from 'he';
import { createMetaDescription, stripMarkdown } from './markdown-utils';
import { insertInternalLinks as insertInternalLinksNew } from './internal-linking';

// API Key Rotation System
class GeminiKeyManager {
  private keys: string[];
  private currentIndex: number = 0;

  constructor() {
    const keysString = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
    this.keys = keysString.split(',').map(k => k.trim()).filter(Boolean);
    
    if (this.keys.length === 0) {
      throw new Error('No Gemini API keys configured');
    }
    
    console.log(`Initialized Gemini Key Manager with ${this.keys.length} keys`);
  }

  getNextKey(): string {
    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return key;
  }

  getGenAI(): GoogleGenerativeAI {
    return new GoogleGenerativeAI(this.getNextKey());
  }
}

const keyManager = new GeminiKeyManager();

// AI Processing Interfaces
export interface AIAnalysisResult {
  mainKeyword: string;
  suggestedSlug: string;
  coverImageUrl: string | null;
  suggestedTags: string[];
}

export interface AIContentResult {
  title?: string;
  content: string;
  summary: string;
}

export interface ProcessedArticle {
  title: string;
  slug: string;
  content: string;
  summary: string;
  coverImageUrl: string;
  tags: string[];
}

/**
 * Step A: AI Analysis & Extraction
 * Analyzes the original article and extracts key information
 */
export async function analyzeArticle(
  originalTitle: string,
  originalContent: string
): Promise<AIAnalysisResult> {
  // Decode HTML entities before processing
  const cleanTitle = decodeHtmlEntities(originalTitle);
  const cleanContent = decodeHtmlEntities(originalContent);

  const genAI = keyManager.getGenAI();
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `Analyze the following Vietnamese tech news article. Extract key information and return ONLY a valid JSON object.

CRITICAL REQUIREMENTS:
- Return RAW JSON only, no markdown formatting, no conversational filler
- Generate 5 tags strictly in VIETNAMESE language suitable for a Vietnamese tech blog
- Tags must be concise keywords (1-3 words each)

JSON Schema:
{
  "mainKeyword": "string - Primary keyword in Vietnamese",
  "suggestedSlug": "string - URL-friendly slug (lowercase, hyphens)",
  "coverImageUrl": "string or null - Absolute URL of main image",
  "suggestedTags": ["string array - 5 Vietnamese tags"]
}

Article Title: ${cleanTitle}

Article Content:
${cleanContent.substring(0, 3000)}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text;
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const parsed = JSON.parse(jsonText);
    
    return {
      mainKeyword: parsed.mainKeyword || cleanTitle,
      suggestedSlug: parsed.suggestedSlug || generateSlug(cleanTitle),
      coverImageUrl: parsed.coverImageUrl || null,
      suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags.slice(0, 5) : [],
    };
  } catch (error) {
    console.error('Error in analyzeArticle:', error);
    throw new Error(`Failed to analyze article: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Step B: AI Content Rewriting
 * Rewrites the article with SEO optimization and user intent focus
 */
export async function rewriteArticle(
  mainKeyword: string,
  originalContent: string,
  originalTitle: string
): Promise<AIContentResult> {
  // Decode HTML entities before processing
  const cleanTitle = decodeHtmlEntities(originalTitle);
  const cleanContent = decodeHtmlEntities(originalContent);

  const genAI = keyManager.getGenAI();
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `Bạn là biên tập viên chuyên nghiệp của trang tin công nghệ hàng đầu Việt Nam - TechShift.vn.

**CONTEXT QUAN TRỌNG:**
- Input là bài viết công nghệ TIẾNG VIỆT từ nguồn RSS
- Nhiệm vụ: VIẾT LẠI (rewrite/paraphrase) để chuẩn SEO và hấp dẫn hơn
- KHÔNG PHẢI là dịch thuật, KHÔNG được đổi sang tiếng Anh

**YÊU CẦU NGHIÊM NGẶT:**

1. **TIÊU ĐỀ (TITLE):**
   - BẮT BUỘC giữ nguyên TIẾNG VIỆT 100%
   - CẤM TUYỆT ĐỐI dịch sang tiếng Anh
   - Phong cách: "Giật tít" (Clickbait), thu hút, kích thích tò mò
   - Độ dài: 60-100 ký tự (15-20 từ)
   - Nếu tiêu đề gốc đã hay, hãy biến tấu nó hấp dẫn hơn, ĐỪNG tóm tắt
   - Ví dụ tốt: "iPhone 17 Pro Max: Giá 'trên trời' nhưng vẫn cháy hàng tại Việt Nam"
   - Ví dụ XẤU: "iPhone 17 Pro Max review" (tiếng Anh - CẤM!)

2. **NỘI DUNG (CONTENT):**
   - Viết lại hoàn toàn bằng TIẾNG VIỆT
   - Rà soát và sửa lỗi chính tả tiếng Việt
   - Giữ nguyên các thông số kỹ thuật, tên riêng (iPhone, Samsung, CPU...)
   - Độ dài: 600-900 từ
   - Cấu trúc: Dùng ## H2, ### H3, bullet points, **bold**
   - Giọng văn: Chuyên nghiệp nhưng dễ hiểu, trôi chảy
   - SEO: Tự nhiên nhắc đến từ khóa chính "${mainKeyword}"

3. **TÓM TẮT (SUMMARY):**
   - 2-3 câu TIẾNG VIỆT
   - 150-155 ký tự
   - Hấp dẫn, chuẩn SEO

**DỮ LIỆU ĐẦU VÀO:**

Tiêu đề gốc: ${cleanTitle}

Nội dung gốc:
${cleanContent}

**CRITICAL FORMATTING RULES:**
- Return RAW JSON only, no markdown formatting, no conversational filler
- Title and Summary must be PLAIN TEXT ONLY
- Do NOT use Markdown formatting (bold, italic, links) inside title or summary values
- Only content field can contain Markdown

JSON Schema:
{
  "title": "string - Vietnamese title (PLAIN TEXT, no ** or * or [])",
  "content": "string - Vietnamese Markdown content (Markdown allowed here)",
  "summary": "string - Vietnamese summary (PLAIN TEXT, no ** or * or [])"
}`;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    // Extract JSON from response (handle markdown code blocks)
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/```\n?/g, '');
    }

    // Remove any conversational filler at the start
    const conversationalPrefixes = [
      'Chắc chắn rồi',
      'Dạ vâng',
      'Được rồi',
      'Đây là',
      'Sure',
      'Here is',
      'Here\'s'
    ];
    
    for (const prefix of conversationalPrefixes) {
      if (responseText.toLowerCase().startsWith(prefix.toLowerCase())) {
        // Find the first { to start JSON
        const jsonStart = responseText.indexOf('{');
        if (jsonStart !== -1) {
          responseText = responseText.substring(jsonStart);
        }
        break;
      }
    }

    // Parse JSON response
    const parsed = JSON.parse(responseText);
    
    // Validate that we got proper fields
    if (!parsed.title || !parsed.content || !parsed.summary) {
      throw new Error('Invalid JSON structure: missing required fields');
    }

    // Ensure content is clean Markdown, not JSON string
    let cleanContentResult = parsed.content;
    if (typeof cleanContentResult === 'string' && cleanContentResult.trim().startsWith('{')) {
      // Content might be a JSON string, try to parse it
      try {
        const contentParsed = JSON.parse(cleanContentResult);
        if (contentParsed.content) {
          cleanContentResult = contentParsed.content;
        }
      } catch {
        // If parsing fails, use as is
      }
    }
    
    // Clean title: strip any Markdown formatting (bold, italic, etc.)
    const cleanTitle = stripMarkdown(parsed.title);
    
    // Clean summary: strip Markdown and truncate to 160 chars
    const cleanSummary = createMetaDescription(parsed.summary, 160);
    
    return {
      title: cleanTitle,
      content: cleanContentResult,
      summary: cleanSummary,
    };
  } catch (error) {
    console.error('Error in rewriteArticle:', error);
    throw new Error(`Failed to rewrite article with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Step C: Implement Internal Linking
 * Inserts links to related published articles
 * @deprecated Use insertInternalLinksNew from './internal-linking' instead
 */
export function insertInternalLinks(
  content: string,
  relatedArticles: Array<{ title: string; slug: string }>,
  maxLinks: number = 3
): string {
  // Use the new improved implementation
  return insertInternalLinksNew(content, relatedArticles, maxLinks);
}

/**
 * Generate URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

/**
 * Get default cover image from Unsplash
 */
export function getDefaultCoverImage(keyword: string): string {
  // Use a tech-related default image
  return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80';
}

/**
 * Main processing function that orchestrates all AI steps
 */
export async function processArticleWithAI(
  originalTitle: string,
  originalContent: string,
  relatedArticles: Array<{ title: string; slug: string }> = []
): Promise<ProcessedArticle> {
  console.log(`Processing article: ${originalTitle}`);

  // Step A: Analyze and extract
  console.log('  Step A: Analyzing article...');
  const analysis = await analyzeArticle(originalTitle, originalContent);
  console.log(`  Main keyword: ${analysis.mainKeyword}`);
  console.log(`  Suggested tags: ${analysis.suggestedTags.join(', ')}`);

  // Step B: Rewrite content
  console.log('  Step B: Rewriting content...');
  const rewritten = await rewriteArticle(analysis.mainKeyword, originalContent, originalTitle);

  // Step C: Insert internal links
  console.log('  Step C: Inserting internal links...');
  const contentWithLinks = insertInternalLinks(rewritten.content, relatedArticles, 3);

  // Use title from AI rewrite, fallback to original or main keyword
  const finalTitle = rewritten.title || originalTitle || analysis.mainKeyword;

  return {
    title: finalTitle,
    slug: analysis.suggestedSlug,
    content: contentWithLinks,
    summary: rewritten.summary,
    coverImageUrl: analysis.coverImageUrl || getDefaultCoverImage(analysis.mainKeyword),
    tags: analysis.suggestedTags,
  };
}
