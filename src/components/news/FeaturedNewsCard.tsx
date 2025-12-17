// src/components/news/FeaturedNewsCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Play, Clock, User } from "lucide-react";
import { Article } from "@/types/news";

interface FeaturedProps {
  data: Article;
}

export default function FeaturedNewsCard({ data }: FeaturedProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Khối Ảnh bìa + Nút Play */}
      <Link 
        href={`/blog/${data.slug}`} 
        className="relative group w-full overflow-hidden rounded-2xl aspect-[16/10] border border-gray-100 block"
      >
        <Image
          src={data.coverImage}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority // Ưu tiên load ảnh này trước vì nó to nhất
          unoptimized = {true}
        />
        
        {/* Logic: Nếu là Video thì hiện nút Play */}
        {data.mediaType === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-1" />
            </div>
          </div>
        )}
      </Link>

      {/* Thông tin bài viết */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={14} /> {data.publishedDate}
          </span>
          <span className="flex items-center gap-1">
            <User size={14} /> {data.author}
          </span>
        </div>

        <Link href={`/blog/${data.slug}`}>
          <h3 className="text-2xl font-bold text-gray-900 hover:text-red-500 transition-colors leading-tight">
            {data.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
          {data.description}
        </p>
      </div>
    </div>
  );
}