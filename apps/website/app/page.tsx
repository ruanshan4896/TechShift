import { getLatestArticlesPaginated, getTotalArticlesCount } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";
import TechBackground from "@/components/TechBackground";
import ArticleCard from "@/components/ArticleCard";

export const revalidate = 3600; // ISR: Revalidate every hour

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const articlesPerPage = 12;
  const offset = (currentPage - 1) * articlesPerPage;

  const [articles, totalCount] = await Promise.all([
    getLatestArticlesPaginated(articlesPerPage, offset),
    getTotalArticlesCount(),
  ]);

  const totalPages = Math.ceil(totalCount / articlesPerPage);

  return (
    <>
      {/* 3D Background */}
      <TechBackground />

      <div className="relative z-10 min-h-screen">
        {/* Hero Section - Only on first page */}
        {currentPage === 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="text-center">
              {/* Main Heading with Gradient */}
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  TechShift
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto backdrop-blur-sm bg-black/20 rounded-2xl p-6">
                Khám phá xu hướng công nghệ mới nhất với nội dung được AI tối ưu hóa
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Articles Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
