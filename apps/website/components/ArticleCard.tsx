import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye } from "lucide-react";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  cover_image_url: string;
  published_at: Date;
  view_count: number;
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/posts/${article.slug}`}
      className="group block h-full transition-transform hover:scale-[1.02] duration-300"
    >
      <div className="h-full rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={getOptimizedCloudinaryUrl(article.cover_image_url, 600)}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-white/70 mb-3">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(article.published_at).toLocaleDateString("vi-VN")}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {article.view_count}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
            {article.title}
          </h3>

          {/* Summary */}
          <p className="text-white/80 text-sm line-clamp-3">{article.summary}</p>
        </div>
      </div>
    </Link>
  );
}
