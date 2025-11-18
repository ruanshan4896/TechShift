import Image from "next/image";
import Link from "next/link";
import { getLatestArticles } from "@/lib/db";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";
import Sidebar from "@/components/Sidebar";
import { Calendar, Eye } from "lucide-react";

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function Home() {
  const articles = await getLatestArticles(12);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tin tức công nghệ mới nhất
          </h1>
          <p className="text-gray-600">
            Cập nhật tin tức AI, Mobile, PC & Hardware và nhiều hơn nữa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/posts/${article.slug}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={getOptimizedCloudinaryUrl(article.cover_image_url, 600)}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(article.published_at).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {article.view_count}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Sidebar />
        </div>
      </div>
    </div>
  );
}
