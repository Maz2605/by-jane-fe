import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

import { getArticles, mapStrapiArticleToFrontend } from "@/services/article";


const ITEMS_PER_PAGE = 9;

// --- ĐỊNH NGHĨA TYPE CHO NEXT.JS 15 ---
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function BlogPage(props: {
  searchParams: SearchParams;
}) {
  // 1. FIX LỖI NEXT.JS 15
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  // 2. GỌI API LẤY DỮ LIỆU THẬT
  const { data: rawData, meta } = await getArticles({
    pagination: {
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
    },
  });

  // 3. MAP DATA
  const articles = (rawData || []).map(mapStrapiArticleToFrontend);
  // Đảm bảo totalPages ít nhất là 1 để luôn hiện số 1
  const totalPages = Math.max(1, meta?.pagination?.pageCount || 1);

  // 4. CHIA LAYOUT
  const featuredArticles = currentPage === 1 ? articles.slice(0, 3) : [];
  const listArticles = currentPage === 1 ? articles.slice(3) : articles;

  // --- 5. LOGIC TÍNH TOÁN PHÂN TRANG (Sliding Window) ---
  const MAX_VISIBLE_PAGES = 3;
  
  // Tính toán điểm bắt đầu và kết thúc của dải trang
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

  // Điều chỉnh lại nếu dải trang bị hụt (Ví dụ: Tổng 5, đang đứng trang 5 -> phải hiện 3, 4, 5)
  if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  }

  // Tạo mảng các trang cần hiển thị
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="grow">
        
        {/* TIÊU ĐỀ TRANG */}
        <div className="container mx-auto px-4 pt-12 pb-8">
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
              Tin tức & Sự kiện
            </h1>
            <div className="w-16 h-1 bg-black mt-4"></div>
        </div>

        <section className="container mx-auto px-4 pb-20"> 
            
            {/* --- HERO SECTION (BENTO GRID) --- */}
            {currentPage === 1 && featuredArticles.length >= 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-16 h-auto lg:h-[500px]">
                    
                    {/* Ô TO NHẤT */}
                    <Link href={`/blog/${featuredArticles[0].slug}`} className="group relative lg:col-span-2 h-[300px] lg:h-full rounded-2xl overflow-hidden block">
                        {featuredArticles[0].coverImage ? (
                            <Image 
                                src={featuredArticles[0].coverImage} 
                                alt={featuredArticles[0].title} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority 
                                unoptimized 
                            />
                        ) : (
                             <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                            <h2 className="text-white text-2xl lg:text-4xl font-bold leading-tight mb-2 group-hover:text-red-200 transition-colors">
                                {featuredArticles[0].title}
                            </h2>
                            <p className="text-gray-300 text-sm flex items-center gap-2">
                                <Clock size={14}/> {featuredArticles[0].publishedDate}
                            </p>
                        </div>
                    </Link>

                    {/* 2 Ô NHỎ */}
                    <div className="flex flex-col gap-4 h-full">
                        {featuredArticles.slice(1, 3).map((item: any) => (
                            <Link href={`/blog/${item.slug}`} key={item.id} className="group relative flex-1 h-60 lg:h-auto rounded-2xl overflow-hidden block">
                                {item.coverImage ? (
                                    <Image 
                                        src={item.coverImage} 
                                        alt={item.title} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200"></div>
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
                                    <h3 className="text-white text-lg font-bold leading-snug line-clamp-2 group-hover:underline">
                                        {item.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* --- LIST SECTION --- */}
            {currentPage === 1 && listArticles.length > 0 && (
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    Mới cập nhật <ArrowRight size={20}/>
                </h3>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listArticles.map((item: any) => (
                    <Link href={`/blog/${item.slug}`} key={item.id} className="group flex flex-col gap-3">
                        <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-gray-100">
                            {item.coverImage ? (
                                <Image 
                                    src={item.coverImage} 
                                    alt={item.title} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                                <span>{item.publishedDate}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            {item.description && (
                                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Thông báo nếu không có bài */}
            {articles.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chưa có bài viết nào.</p>
                </div>
            )}

            {/* --- PHÂN TRANG (ĐÃ CẬP NHẬT) --- */}
            {/* Luôn hiển thị nếu totalPages >= 1 */}
            {totalPages > 0 && (
                <div className="flex justify-center items-center py-8 border-t border-gray-100 mt-16">
                    <div className="flex items-center gap-2">
                        {/* Nút Prev */}
                        <Link 
                            href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : "#"}
                            className={`w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-500 bg-white transition-colors
                                ${currentPage <= 1 ? "pointer-events-none opacity-40 bg-gray-50" : "hover:bg-gray-100"}
                            `}
                            aria-disabled={currentPage <= 1}
                        >
                            <ChevronLeft size={18}/>
                        </Link>
                        
                        {/* Render các số trang (đã tính toán ở trên) */}
                        {pageNumbers.map((page) => (
                            <Link
                                key={page}
                                href={`/blog?page=${page}`}
                                className={`w-10 h-10 flex items-center justify-center rounded border text-sm font-medium transition-all
                                    ${currentPage === page 
                                        ? "bg-red-500 border-red-500 text-white shadow-md pointer-events-none" 
                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                    }
                                `}
                            >
                                {page}
                            </Link>
                        ))}

                        {/* Nút Next */}
                        <Link 
                            href={currentPage < totalPages ? `/blog?page=${currentPage + 1}` : "#"}
                            className={`w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-500 bg-white transition-colors
                                ${currentPage >= totalPages ? "pointer-events-none opacity-40 bg-gray-50" : "hover:bg-gray-100"}
                            `}
                            aria-disabled={currentPage >= totalPages}
                        >
                            <ChevronRight size={18}/>
                        </Link>
                    </div>
                </div>
            )}

        </section>
      </main>

      <Footer />
    </div>
  );
}