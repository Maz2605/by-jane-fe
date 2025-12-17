"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

// --- DỮ LIỆU GIẢ ---
const ALL_ARTICLES = Array.from({ length: 24 }).map((_, index) => ({
  id: index + 1,
  title: index === 0 
    ? "BST Thu Đông 2024: Bản giao hưởng của những gam màu trung tính" 
    : `Xu hướng thời trang 2024: Phối đồ phong cách Minimalist số ${index}`,
  slug: `bai-viet-${index + 1}`,
  publishedDate: "18/11/2024",
  category: index % 2 === 0 ? "TRENDS" : "LIFESTYLE",
  author: "Nguyễn Anh Dũng",
  coverImage: index === 0 
    ? "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop" 
    : `https://images.unsplash.com/photo-${index % 2 === 0 ? '1515886657613-9f3515b0c78f' : '1485230946404-61dbac8669b6'}?q=80&w=600&auto=format&fit=crop`,
}));

const ITEMS_PER_PAGE = 9; 

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Logic cắt dữ liệu
  const totalPages = Math.ceil(ALL_ARTICLES.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = ALL_ARTICLES.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const featuredArticles = currentPage === 1 ? currentArticles.slice(0, 3) : [];
  const listArticles = currentPage === 1 ? currentArticles.slice(3) : currentArticles;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // FIX 1: Đổi thành div wrapper với min-h-screen để footer luôn ở đáy
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* FIX 2: Thẻ main thêm flex-grow để đẩy footer xuống */}
      <main className="flex-grow">
        
        {/* Header Text */}
        <div className="container mx-auto px-4 pt-12 pb-8">
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
            Tin tức & Sự kiện
            </h1>
            <div className="w-16 h-1 bg-black mt-4"></div>
        </div>

        <section className="container mx-auto px-4 pb-20"> 
            {/* Note: Tôi chuyển pb-20 vào đây để khoảng cách nội dung vẫn thoáng, nhưng không đẩy footer */}
            
            {/* --- 1. HERO SECTION (BENTO GRID) --- */}
            {currentPage === 1 && featuredArticles.length >= 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-16 h-auto lg:h-[500px]">
                    <Link href={`/blog/${featuredArticles[0].slug}`} className="group relative lg:col-span-2 h-[300px] lg:h-full rounded-2xl overflow-hidden">
                        <Image 
                            src={featuredArticles[0].coverImage} 
                            alt={featuredArticles[0].title} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 w-fit mb-3 rounded">{featuredArticles[0].category}</span>
                            <h2 className="text-white text-2xl lg:text-4xl font-bold leading-tight mb-2 group-hover:text-red-200 transition-colors">
                                {featuredArticles[0].title}
                            </h2>
                            <p className="text-gray-300 text-sm flex items-center gap-2">
                                <Clock size={14}/> {featuredArticles[0].publishedDate}
                            </p>
                        </div>
                    </Link>

                    <div className="flex flex-col gap-4 h-full">
                        {featuredArticles.slice(1, 3).map((item) => (
                            <Link href={`/blog/${item.slug}`} key={item.id} className="group relative flex-1 h-[240px] lg:h-auto rounded-2xl overflow-hidden">
                                <Image 
                                    src={item.coverImage} 
                                    alt={item.title} 
                                    fill 
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
                                    <span className="text-red-400 text-xs font-bold mb-1">{item.category}</span>
                                    <h3 className="text-white text-lg font-bold leading-snug line-clamp-2 group-hover:underline">
                                        {item.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* --- 2. LIST SECTION --- */}
            {currentPage === 1 && <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">Mới cập nhật <ArrowRight size={20}/></h3>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listArticles.map((item) => (
                    <Link href={`/blog/${item.slug}`} key={item.id} className="group flex flex-col gap-3">
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                            <Image 
                                src={item.coverImage} 
                                alt={item.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                unoptimized
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                                <span className="text-red-500">{item.category}</span>
                                <span>•</span>
                                <span>{item.publishedDate}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>

            {/* --- 3. THANH PHÂN TRANG (CĂN GIỮA) --- */}
            <div className="flex justify-center items-center py-8 border-t border-gray-100 mt-16">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-colors"
                    >
                        <ChevronLeft size={18}/>
                    </button>
                    
                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 flex items-center justify-center rounded border text-sm font-medium transition-all
                                ${currentPage === page 
                                    ? "bg-red-500 border-red-500 text-white shadow-md" 
                                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                }
                            `}
                        >
                            {page}
                        </button>
                    ))}

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-colors"
                    >
                        <ChevronRight size={18}/>
                    </button>
                </div>
            </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}