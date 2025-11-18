import { getCategoryBySlug, getArticlesByCategory } from '@/lib/db';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category not found' };
  }

  return {
    title: `${category.name} - Tech News`,
    description: `Tin tức mới nhất về ${category.name}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const articles = await getArticlesByCategory(slug, 20);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: category.name }]} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{category.name}</h1>
            
            {articles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">Chưa có bài viết nào trong chuyên mục này.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/posts/${article.slug}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                  >
                    <div className="md:flex">
                      <div className="md:w-64 h-48 md:h-auto relative">
                        <Image
                          src={getOptimizedCloudinaryUrl(article.cover_image_url, 400)}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={16} />
                            {new Date(article.published_at).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={16} />
                            {article.view_count} lượt xem
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
