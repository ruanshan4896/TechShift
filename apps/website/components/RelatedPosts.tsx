import Image from 'next/image';
import Link from 'next/link';
import { getRelatedArticlesByTags } from '@/lib/db';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
import { Calendar, Eye } from 'lucide-react';

interface RelatedPostsProps {
  articleId: number;
}

export default async function RelatedPosts({ articleId }: RelatedPostsProps) {
  const relatedArticles = await getRelatedArticlesByTags(articleId, 4);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 title-case">
        Bài viết liên quan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/posts/${article.slug}`}
            className="group flex gap-4 hover:bg-gray-50 rounded-lg p-3 transition"
          >
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={getOptimizedCloudinaryUrl(article.cover_image_url, 200)}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition mb-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(article.published_at).toLocaleDateString('vi-VN')}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {article.view_count}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
