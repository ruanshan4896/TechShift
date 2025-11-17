import { GoogleGenerativeAI } from '@google/generative-ai';

// API Keys rotation system
const API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
  process.env.GEMINI_API_KEY_8,
  process.env.GEMINI_API_KEY_9,
  process.env.GEMINI_API_KEY_10,
  process.env.GEMINI_API_KEY_11,
  process.env.GEMINI_API_KEY_12,
  process.env.GEMINI_API_KEY_13,
  process.env.GEMINI_API_KEY_14,
  process.env.GEMINI_API_KEY_15,
  process.env.GEMINI_API_KEY_16,
  process.env.GEMINI_API_KEY_17,
  process.env.GEMINI_API_KEY_18,
  process.env.GEMINI_API_KEY_19,
  process.env.GEMINI_API_KEY_20,
  process.env.GEMINI_API_KEY, // Fallback to original
].filter(Boolean) as string[];

let currentKeyIndex = 0;

function getNextApiKey(): string {
  if (API_KEYS.length === 0) {
    throw new Error('No Gemini API keys configured');
  }
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

function getGenAI(): GoogleGenerativeAI {
  return new GoogleGenerativeAI(getNextApiKey());
}

export interface ProcessedArticle {
  content: string;
  summary: string;
  suggestedTitles: string[];
}

export async function processArticleWithGemini(
  originalTitle: string,
  originalContent: string,
  originalUrl: string
): Promise<ProcessedArticle> {
  // Use Gemini 2.5 Flash - latest free model with key rotation
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Prompt A: Tạo bài viết tổng hợp
  const promptA = `Dựa trên nội dung từ bài viết gốc tại ${originalUrl} với tiêu đề "${originalTitle}", hãy viết một bài viết mới, đầy đủ và chi tiết về chủ đề này.

Nội dung gốc:
${originalContent}

**Yêu cầu:**
- Viết bài viết hoàn chỉnh bằng tiếng Việt
- Bổ sung thêm các thông tin nền
- Giải thích các thuật ngữ kỹ thuật cho người mới
- Đưa ra góc nhìn so sánh với các công nghệ/sản phẩm tương tự (nếu có)
- Giữ văn phong chuyên nghiệp nhưng dễ tiếp cận
- Không sao chép nguyên văn
- Độ dài: 500-800 từ
- Format: Markdown với heading (##), bullet points, và đoạn văn rõ ràng

Hãy viết bài viết:`;

  const resultA = await model.generateContent(promptA);
  const content = resultA.response.text();

  // Prompt B: Tạo tóm tắt và tiêu đề
  const promptB = `Từ nội dung bài viết sau:

${content}

Hãy:
1. Viết một đoạn tóm tắt (meta description) trong khoảng 150-155 ký tự, hấp dẫn và chuẩn SEO
2. Đề xuất 3 tiêu đề mới hấp dẫn, chuẩn SEO (dưới 60 ký tự mỗi tiêu đề)

Format trả về:
SUMMARY: [tóm tắt ở đây]
TITLE1: [tiêu đề 1]
TITLE2: [tiêu đề 2]
TITLE3: [tiêu đề 3]`;

  const resultB = await model.generateContent(promptB);
  const metaText = resultB.response.text();

  // Parse kết quả
  const summaryMatch = metaText.match(/SUMMARY:\s*(.+)/);
  const title1Match = metaText.match(/TITLE1:\s*(.+)/);
  const title2Match = metaText.match(/TITLE2:\s*(.+)/);
  const title3Match = metaText.match(/TITLE3:\s*(.+)/);

  const summary = summaryMatch ? summaryMatch[1].trim() : originalTitle.substring(0, 155);
  const suggestedTitles = [
    title1Match ? title1Match[1].trim() : originalTitle,
    title2Match ? title2Match[1].trim() : originalTitle,
    title3Match ? title3Match[1].trim() : originalTitle,
  ];

  return {
    content,
    summary,
    suggestedTitles,
  };
}

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

export function getDefaultCoverImage(title: string): string {
  // Sử dụng Unsplash với keyword từ title
  const keywords = title.split(' ').slice(0, 3).join(',');
  return `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80`;
}

export async function extractKeywords(content: string, title: string): Promise<string[]> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Từ bài viết sau với tiêu đề "${title}":

${content.substring(0, 1000)}

Hãy trích xuất 5-7 từ khóa hoặc thực thể quan trọng nhất (tên công nghệ, sản phẩm, công ty, khái niệm kỹ thuật).

Yêu cầu:
- Chỉ trả về danh sách từ khóa, mỗi từ khóa trên một dòng
- Không giải thích, không đánh số
- Từ khóa nên là cụm từ ngắn (1-3 từ)
- Ưu tiên các từ khóa xuất hiện nhiều lần trong bài

Ví dụ format:
iPhone 17
AI
OpenAI
chip xử lý
machine learning`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // Parse keywords từ response
  const keywords = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.match(/^\d+\./)) // Remove numbered lines
    .slice(0, 7); // Max 7 keywords

  return keywords;
}
