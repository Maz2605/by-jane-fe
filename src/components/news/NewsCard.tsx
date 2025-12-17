// src/components/news/NewsCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Clock, User } from "lucide-react";
import { Article } from "@/types/news";

interface NewsCardProps {
  data: Article;
}

export default function NewsCard({ data }: NewsCardProps) {
  return (
    <Link href={`/blog/${data.slug}`} className="group flex gap-4 cursor-pointer items-start">
      {/* Ảnh Thumbnail bên trái */}
      <div className="relative w-1/3 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
        <Image
          src={data.coverImage}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized = {true}
        />
      </div>

      {/* Thông tin bên phải */}
      <div className="flex flex-col gap-2 w-2/3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {data.publishedDate}
          </span>
          <span className="flex items-center gap-1">
            <User size={12} /> {data.author}
          </span>
        </div>
        <h4 className="text-base font-bold text-gray-900 leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
          {data.title}
        </h4>
      </div>
    </Link>
  );
}