import { searchArticles } from '@/lib/db';
import Breadcrumbs from '@/components/Breadcrumbs';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, Search as SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  
  return {
    title: q ? `Tìm kiếm: ${q} - Tech News` : 'Tìm kiếm - Tech News',
    description: q ? `Kết quả tìm kiếm cho "${q}"` : 'Tìm kiếm bài viết',
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q || '';
  const results = query ? await searchArticles(query, 50) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Tìm kiếm' }]} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <SearchIcon className="text-blue-700" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">
                {query ? `Kết quả tìm kiếm: "${query}"` : 'Tìm kiếm'}
              </h1>
            </div>
            
            {!query ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <SearchIcon className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">
                  Nhập từ khóa vào ô tìm kiếm ở trên để bắt đầu.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <SearchIcon className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-2">
                  Không tìm thấy kết quả nào cho "{query}"
                </p>
                <p className="text-gray-500 text-sm">
                  Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Tìm thấy <span className="font-semibold text-gray-900">{results.length}</span> kết quả
                </p>
                
                <div className="space-y-6">
                  {results.map((article) => (
                    <Link
                      key={article.id}
                      href={`/posts/${article.slug}`}
                      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                    >
                      <div className="md:flex">
                        <div className="md:w-64 h-48 md:h-auto relative">
                          <Image
                            src={article.cover_image_url}
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
              </>
            )}
          </div>
          
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
