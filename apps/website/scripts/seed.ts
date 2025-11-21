import { createArticlesTable, insertArticle } from '../lib/db';

const sampleArticles = [
  {
    title: 'AI và Machine Learning: Xu hướng công nghệ 2025',
    slug: 'ai-machine-learning-xu-huong-2025',
    summary: 'Khám phá những xu hướng mới nhất trong lĩnh vực trí tuệ nhân tạo và học máy sẽ định hình tương lai công nghệ.',
    content: `# AI và Machine Learning: Xu hướng công nghệ 2025

Trí tuệ nhân tạo (AI) và Machine Learning đang thay đổi cách chúng ta làm việc và sống. Năm 2025 hứa hẹn mang đến nhiều đột phá mới.

## Các xu hướng chính

1. **AI tạo sinh (Generative AI)**: Từ văn bản đến hình ảnh, video và âm nhạc
2. **AutoML**: Tự động hóa quy trình phát triển mô hình ML
3. **Edge AI**: Đưa AI xuống thiết bị đầu cuối
4. **Ethical AI**: Tập trung vào đạo đức và minh bạch

Công nghệ AI đang ngày càng trở nên dễ tiếp cận hơn với các nhà phát triển và doanh nghiệp.`,
    cover_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    published_at: new Date('2025-01-15'),
    view_count: 0,
    status: 'PUBLISHED' as const,
  },
  {
    title: 'Next.js 15: Những tính năng mới đáng chú ý',
    slug: 'nextjs-15-tinh-nang-moi',
    summary: 'Tìm hiểu về các tính năng mới và cải tiến trong phiên bản Next.js 15 giúp tối ưu hiệu suất web.',
    content: `# Next.js 15: Những tính năng mới đáng chú ý

Next.js 15 ra mắt với nhiều cải tiến quan trọng giúp phát triển ứng dụng web nhanh hơn và hiệu quả hơn.

## Điểm nổi bật

- **Turbopack**: Công cụ build nhanh hơn Webpack
- **Server Actions**: Xử lý form và mutations dễ dàng hơn
- **Partial Prerendering**: Kết hợp static và dynamic rendering
- **Cải thiện Image Optimization**: Tải ảnh nhanh hơn 30%

Next.js tiếp tục là framework React hàng đầu cho production.`,
    cover_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    published_at: new Date('2025-01-10'),
    view_count: 0,
    status: 'PUBLISHED' as const,
  },
  {
    title: 'Tailwind CSS 4.0: Thiết kế web hiện đại',
    slug: 'tailwind-css-4-thiet-ke-web-hien-dai',
    summary: 'Khám phá Tailwind CSS 4.0 với engine mới, hiệu suất tốt hơn và nhiều utility classes hữu ích.',
    content: `# Tailwind CSS 4.0: Thiết kế web hiện đại

Tailwind CSS 4.0 mang đến trải nghiệm phát triển tốt hơn với engine mới được viết bằng Rust.

## Cải tiến chính

1. **Engine mới**: Nhanh hơn 10x so với phiên bản cũ
2. **CSS-first configuration**: Cấu hình đơn giản hơn
3. **Container queries**: Responsive design linh hoạt hơn
4. **Improved IntelliSense**: Autocomplete thông minh hơn

Tailwind tiếp tục là lựa chọn hàng đầu cho utility-first CSS.`,
    cover_image_url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
    published_at: new Date('2025-01-05'),
    view_count: 0,
    status: 'PUBLISHED' as const,
  },
  {
    title: 'TypeScript 5.5: An toàn kiểu dữ liệu tốt hơn',
    slug: 'typescript-5-5-an-toan-kieu-du-lieu',
    summary: 'TypeScript 5.5 cải thiện type inference và mang đến nhiều tính năng mới cho developer experience.',
    content: `# TypeScript 5.5: An toàn kiểu dữ liệu tốt hơn

TypeScript 5.5 ra mắt với nhiều cải tiến về type system và hiệu suất biên dịch.

## Tính năng mới

- **Inferred Type Predicates**: Type guards thông minh hơn
- **Control Flow Narrowing**: Phân tích luồng điều khiển tốt hơn
- **Performance Improvements**: Biên dịch nhanh hơn 20%
- **Better Error Messages**: Thông báo lỗi rõ ràng hơn

TypeScript giúp code JavaScript an toàn và dễ bảo trì hơn.`,
    cover_image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    published_at: new Date('2024-12-28'),
    view_count: 0,
    status: 'PUBLISHED' as const,
  },
  {
    title: 'Vercel Postgres: Database cho ứng dụng serverless',
    slug: 'vercel-postgres-database-serverless',
    summary: 'Tìm hiểu về Vercel Postgres - giải pháp database được tối ưu cho ứng dụng Next.js và serverless.',
    content: `# Vercel Postgres: Database cho ứng dụng serverless

Vercel Postgres là giải pháp database được thiết kế đặc biệt cho môi trường serverless và edge computing.

## Ưu điểm

1. **Tích hợp sâu với Next.js**: Setup đơn giản, không cần config phức tạp
2. **Connection pooling**: Tự động quản lý kết nối hiệu quả
3. **Edge-ready**: Truy vấn nhanh từ mọi nơi trên thế giới
4. **Pricing linh hoạt**: Chỉ trả tiền cho những gì bạn sử dụng

Vercel Postgres là lựa chọn tuyệt vời cho các ứng dụng Next.js production.`,
    cover_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    published_at: new Date('2024-12-20'),
    view_count: 0,
    status: 'PUBLISHED' as const,
  },
];

async function seed() {
  try {
    console.log('Creating articles table...');
    await createArticlesTable();
    console.log('✓ Table created');

    console.log('Inserting sample articles...');
    for (const article of sampleArticles) {
      await insertArticle(article);
      console.log(`✓ Inserted: ${article.title}`);
    }

    console.log('✓ Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seed();
