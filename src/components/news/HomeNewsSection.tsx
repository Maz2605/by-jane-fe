import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Import Font (Cho đồng bộ giao diện Tạp chí)
import { Montserrat } from "next/font/google";

// Import Service & Mappers
import { getArticles, mapStrapiArticleToFrontend } from "@/services/article";

// Import UI Components
import FeaturedNewsCard from "./FeaturedNewsCard";
import NewsCard from "./NewsCard";
import SectionTitle from "../common/SectionTitle";

// Cấu hình Font
const montserrat = Montserrat({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

// --- BANNER TĨNH (Giữ nguyên hoặc lấy từ API Global sau này) ---
const STATIC_BANNER = {
  id: 99,
  title: "BỘ SƯU TẬP THU ĐÔNG 2025",
  subTitle: "SẮP RA MẮT",
  coverImage: "/images/products/banner_article.jpg",
  link: "/blog", // Tạm thời link về blog
};

export default async function HomeNewsSection() {
  // 1. GỌI API: Lấy 3 bài viết mới nhất
  const { data: rawData } = await getArticles({
    pagination: {
      page: 1,
      pageSize: 3, // Lấy 3 bài (1 bài to + 2 bài nhỏ)
    },
  });

  // 2. MAP DATA: Chuyển đổi dữ liệu Strapi sang chuẩn Frontend
  const articles = (rawData || []).map(mapStrapiArticleToFrontend);

  // 3. CHIA LAYOUT
  // Bài đầu tiên là Featured
  const featuredArticle = articles[0];
  // 2 bài tiếp theo là List
  const listArticles = articles.slice(1, 3);

  // Xử lý trường hợp chưa có bài viết nào
  if (!featuredArticle) return null;

  return (
    <section className={`py-16 bg-white ${montserrat.className}`}>
      <div className="container mx-auto px-4">
        
        <SectionTitle title="TIN TỨC MỚI NHẤT"/>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* CỘT TRÁI (Featured - Bài mới nhất) */}
          <div className="w-full h-full">
             {/* Adapter: Truyền thêm mediaType để Card hiển thị icon video nếu có */}
             <FeaturedNewsCard 
                data={{
                    ...featuredArticle,
                    mediaType: featuredArticle.video ? "video" : "standard"
                }} 
             />
          </div>

          {/* CỘT PHẢI (Banner + 2 Tin nhỏ) */}
          <div className="flex flex-col justify-between h-full gap-6">
            
            {/* Banner Block (Tĩnh) */}
            <Link href={STATIC_BANNER.link} className="relative w-full aspect-[2.2/1] rounded-2xl overflow-hidden group shadow-sm">
                <Image 
                    src={STATIC_BANNER.coverImage}
                    alt="Banner"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={true} 
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent flex flex-col justify-center p-8 text-white">
                    <span className="bg-white text-black text-[10px] font-extrabold px-2 py-1 w-fit mb-3 uppercase tracking-wider">
                        {STATIC_BANNER.subTitle}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold uppercase leading-none max-w-[80%]">
                        {STATIC_BANNER.title}
                    </h3>
                </div>
            </Link>

            {/* List 2 tin nhỏ (Lấy từ API) */}
            <div className="flex flex-col gap-5">
                {listArticles.length > 0 ? (
                    listArticles.map((item: any) => (
                        <div key={item.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <NewsCard 
                                data={{
                                    ...item,
                                    mediaType: item.video ? "video" : "standard"
                                }} 
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm italic">Đang cập nhật thêm tin tức...</p>
                )}
            </div>

          </div>
        </div>

        {/* Footer Button */}
        <div className="flex justify-center mt-12">
            <Link href="/blog" className="group flex items-center gap-2 text-gray-900 font-bold hover:text-red-600 transition-colors uppercase tracking-wide text-sm">
                XEM TẤT CẢ BÀI VIẾT 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
        </div>
      </div>
    </section>
  );
}