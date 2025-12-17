"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FeaturedNewsCard from "./FeaturedNewsCard";
import NewsCard from "./NewsCard";
import { Article, Banner } from "@/types/news";

import SectionTitle from "../common/SectionTitle";

// --- MOCK DATA (Quay về 2 tin nhỏ) ---
const MOCK_DATA = {
  featured: {
    id: 1,
    title: "4 món đồ họa tiết đáng sắm để phong cách trẻ trung hơn",
    slug: "4-mon-do-hoa-tiet",
    description: "Thời trang mùa lạnh không nên chỉ giới hạn với những món đồ trơn màu. Khi bổ sung cho tủ đồ các item họa tiết, phong cách của chị em sẽ trở nên đa dạng và trẻ trung hơn.",
    coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    author: "Nguyễn Anh Dũng",
    publishedDate: "18/11/2024",
    mediaType: "video",
  } as Article,

  banner: {
    id: 99,
    title: "BỘ SƯU TẬP THU ĐÔNG 2024",
    subTitle: "SẮP RA MẮT",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    link: "/collections/winter-2024",
  } as Banner,

  list: [
    {
      id: 2,
      title: "5 món thời trang tối giản được phụ nữ Pháp diện mãi không chán",
      slug: "5-mon-thoi-trang-toi-gian",
      publishedDate: "18/11/2024",
      author: "Nguyễn Anh Dũng",
      coverImage: "https://images.unsplash.com/photo-1550614000-4b9519e007ac?q=80&w=500&auto=format&fit=crop",
      mediaType: "standard",
    },
    {
      id: 3,
      title: "4 kiểu áo tối giản được phụ nữ Nhật Bản yêu thích trong mùa thu",
      slug: "4-kieu-ao-toi-gian",
      publishedDate: "18/11/2024",
      author: "Nguyễn Anh Dũng",
      coverImage: "https://images.unsplash.com/photo-1552874869-5c39ec5f842c?q=80&w=500&auto=format&fit=crop",
      mediaType: "standard",
    },
  ] as Article[],
};

export default function HomeNewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        <SectionTitle title="TIN TỨC MỚI NHẤT"/>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* CỘT TRÁI (Featured) */}
          <div className="w-full h-full">
             <FeaturedNewsCard data={MOCK_DATA.featured} />
          </div>

          {/* CỘT PHẢI (Banner + 2 Tin nhỏ) */}
          <div className="flex flex-col justify-between h-full gap-6">
            
            {/* Banner Block */}
            <Link href={MOCK_DATA.banner.link} className="relative w-full aspect-[2.2/1] rounded-2xl overflow-hidden group shadow-sm">
                <Image 
                    src={MOCK_DATA.banner.coverImage}
                    alt="Banner"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={true} 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8 text-white">
                    <span className="bg-white text-black text-[10px] font-bold px-2 py-1 w-fit mb-3 uppercase tracking-wider">
                        {MOCK_DATA.banner.subTitle}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold uppercase leading-none max-w-[80%]">
                        {MOCK_DATA.banner.title}
                    </h3>
                </div>
            </Link>

            {/* List 2 tin nhỏ */}
            <div className="flex flex-col gap-5">
                {MOCK_DATA.list.map((item) => (
                    <div key={item.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <NewsCard data={item} />
                    </div>
                ))}
            </div>

          </div>
        </div>

        {/* Footer Button */}
        <div className="flex justify-center mt-12">
            <Link href="/blog" className="group flex items-center gap-2 text-gray-900 font-semibold hover:text-red-500 transition-colors">
                XEM TẤT CẢ BÀI VIẾT 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
        </div>
      </div>
    </section>
  );
}