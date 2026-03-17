import Link from "next/link";
import { BookOpen, Feather } from "lucide-react";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/learn/${article.slug}`} className="group">
      <div
        className={`w-full aspect-[4/5] rounded-[2.5rem] mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02] ${article.color}`}
      >
        <BookOpen className="w-12 h-12 text-[#3A3836] opacity-10" />
      </div>

      <div className="text-xs uppercase tracking-widest text-[#D4B59E] font-bold mb-2">
        {article.category}
      </div>

      <h2 className="text-2xl font-serif leading-snug mb-3 group-hover:text-[#8C7A6B] transition-colors">
        {article.title}
      </h2>

      <div className="text-xs text-[#A39C93] font-light flex items-center gap-2">
        <Feather className="w-3 h-3" />
        {article.read}
      </div>
    </Link>
  );
}