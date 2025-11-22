import { getLatestArticlesPaginated, getTotalArticlesCount } from "@/lib/db";
import BentoGrid from "@/components/BentoGrid";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";
import HeroSection from "@/components/HeroSection";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Hero Section - Only on first page */}
      {currentPage === 1 && <HeroSection />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Bento Grid */}
          <div className="lg:col-span-3">
            <BentoGrid articles={articles} />
            
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
  );
}
