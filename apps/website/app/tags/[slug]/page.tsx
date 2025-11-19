import { getTagBySlug, getArticlesByTagPaginated, getTotalArticlesByTag } from '@/lib/db';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Sidebar from '@/components/Sidebar';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, Tag } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return { title: 'Tag not found' };
  }

  return {
    title: `${tag.name} - Tech News`,
    description: `Bài viết về ${tag.name}`,
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const currentPage = Number(search.page) || 1;
  const articlesPerPage = 12;
  const offset = (currentPage - 1) * articlesPerPage;

  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const [articles, totalCount] = await Promise.all([
    getArticlesByTagPaginated(slug, articlesPerPage, offset),
    getTotalArticlesByTag(slug),
  ]);

  const totalPages = Math.ceil(totalCount / articlesPerPage);

  if (!tag) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { label: 'Tags', href: '/tags' },
            { label: tag.name }
          ]} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Tag className="text-blue-700" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">{tag.name}</h1>
            </div>
            
            <p className="text-gray-600 mb-6">
              {totalCount} bài viết được gắn tag này
            </p>
            
            {articles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">Chưa có bài viết nào với tag này.</p>
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

            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
          
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
