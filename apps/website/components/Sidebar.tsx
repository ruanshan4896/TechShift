import Link from 'next/link';
import { getFeaturedArticles, getLatestArticles, getPopularTags } from '@/lib/db';
import { Eye, Clock, Tag } from 'lucide-react';

export default async function Sidebar() {
  const featured = await getFeaturedArticles(5);
  const latest = await getLatestArticles(5);
  const tags = await getPopularTags(10);

  return (
    <aside className="space-y-6 sticky top-24 self-start">
      {/* Featured Articles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="text-blue-700" size={20} />
          <h3 className="text-xl font-bold text-gray-900 title-case">Bài viết nổi bật</h3>
        </div>
        <div className="space-y-4">
          {featured.map((article) => (
            <Link
              key={article.id}
              href={`/posts/${article.slug}`}
              className="block group"
            >
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-700 transition">
                {article.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Eye size={12} />
                {article.view_count} lượt xem
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Articles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-blue-700" size={20} />
          <h3 className="text-xl font-bold text-gray-900 title-case">Bài viết mới nhất</h3>
        </div>
        <div className="space-y-4">
          {latest.map((article) => (
            <Link
              key={article.id}
              href={`/posts/${article.slug}`}
              className="block group"
            >
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-700 transition">
                {article.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(article.published_at).toLocaleDateString('vi-VN')}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="text-blue-700" size={20} />
          <h3 className="text-xl font-bold text-gray-900 title-case">Tags phổ biến</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
