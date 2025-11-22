"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface BentoGridProps {
  articles: Article[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function BentoGrid({ articles }: BentoGridProps) {
  if (articles.length === 0) return null;

  // Featured article (first one)
  const featured = articles[0];
  const regular = articles.slice(1);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]"
    >
      {/* Featured Article - Takes 2x2 space */}
      <motion.div variants={item} className="md:col-span-2 md:row-span-2">
        <ArticleCard article={featured} featured />
      </motion.div>

      {/* Regular Articles */}
      {regular.slice(0, 6).map((article, index) => (
        <motion.div
          key={article.id}
          variants={item}
          className={cn(
            // Make some cards taller for visual interest
            index === 1 || index === 4 ? "md:row-span-2" : "md:row-span-1"
          )}
        >
          <ArticleCard article={article} />
        </motion.div>
      ))}
    </motion.div>
  );
}

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/posts/${article.slug}`} className="group h-full block">
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative h-full rounded-2xl overflow-hidden",
          "bg-white/80 backdrop-blur-sm",
          "border border-gray-200/50",
          "shadow-lg hover:shadow-2xl hover:shadow-purple-500/20",
          "transition-all duration-300",
          "group-hover:border-purple-500/50"
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getOptimizedCloudinaryUrl(article.cover_image_url, 800)}
            alt={article.title}
            fill
            className="object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full p-6 flex flex-col justify-end">
          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-white/80 mb-3">
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
          <h3
            className={cn(
              "font-bold text-white mb-2 line-clamp-2",
              "group-hover:text-purple-300 transition-colors",
              featured ? "text-2xl md:text-3xl" : "text-lg"
            )}
          >
            {article.title}
          </h3>

          {/* Summary - Only show on featured */}
          {featured && (
            <p className="text-white/90 text-sm line-clamp-2 mb-4">
              {article.summary}
            </p>
          )}

          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
