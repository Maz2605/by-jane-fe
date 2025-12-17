"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, User, Play, Tag } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

// --- DỮ LIỆU GIẢ ---
const ARTICLE_DETAIL = {
  id: 1,
  title: "Xu hướng màu sắc Thu Đông 2024: Khi sắc đỏ Cherry thống trị mọi sàn diễn",
  category: "TRENDS",
  author: "Nguyễn Anh Dũng",
  authorRole: "Fashion Editor",
  authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  publishedDate: "18/11/2024",
  coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
  tags: ["Fashion Week", "Fall Winter 2024", "Color Trends", "Street Style"],
  // Nội dung HTML - Tôi đã thêm một số thẻ để test khoảng cách
  content: `
    <p class="lead">Không còn là những gam màu trầm buồn tẻ, mùa đông năm nay đánh dấu sự trở lại ngoạn mục của sắc đỏ rực rỡ. Từ áo khoác dạ, túi xách cho đến những đôi boots da, tất cả đều được phủ lên một vẻ quyến rũ khó cưỡng.</p>
    
    <h2>Sự trỗi dậy của "Cherry Red"</h2>
    <p>Nếu như năm ngoái là sự thống trị của màu hồng Barbie (Barbiecore), thì năm nay, các nhà mốt lớn như Gucci, Ferragamo đều đồng loạt lăng xê sắc đỏ thẫm (Cherry Red). Đây là gam màu tượng trưng cho quyền lực, sự quyến rũ và một chút bí ẩn.</p>
    
    <div class="image-wrapper">
      <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" alt="Mẫu áo khoác đỏ" />
      <span class="caption text-center text-sm text-gray-500 mt-2 block italic">Áo khoác dáng dài là item "must-have" mùa này.</span>
    </div>

    <p>Không quá chói lọi như đỏ tươi, đỏ Cherry mang sắc thái trầm hơn, dễ dàng phối hợp với các gam màu trung tính như đen, trắng, xám hoặc be. Sự kết hợp này tạo nên tổng thể vừa nổi bật vừa tinh tế.</p>

    <h2>Cách phối đồ với sắc đỏ</h2>
    <p>Để mặc đẹp với gam màu này mà không bị "sến", bạn nên áp dụng quy tắc điểm nhấn (Pop of Red). Thay vì diện cả cây đỏ (trừ khi bạn rất tự tin), hãy thử bắt đầu với một chiếc túi xách, một đôi giày hoặc đơn giản là màu son môi.</p>
  `,
  // Video dưới cùng
  featuredVideo: {
    thumbnail: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
    title: "Runway Highlights: Fall Winter 2024 Collection",
    duration: "12:30"
  }
};

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        
        {/* --- 1. HEADER & COVER --- */}
        <div className="container mx-auto px-4 pt-12 max-w-4xl text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-6">
                <Link href="/" className="hover:text-black transition-colors">Trang chủ</Link>
                <span>/</span>
                <span className="text-red-600 font-bold">{ARTICLE_DETAIL.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-8">
                {ARTICLE_DETAIL.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-10">
                <span className="flex items-center gap-2">
                    <User size={16}/> {ARTICLE_DETAIL.author}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="flex items-center gap-2">
                    <Clock size={16}/> {ARTICLE_DETAIL.publishedDate}
                </span>
            </div>
        </div>

        {/* ẢNH BÌA */}
        <div className="container mx-auto px-4 max-w-5xl mb-16">
            <div className="relative w-full aspect-[21/9] md:aspect-[2/1] rounded-2xl overflow-hidden shadow-sm">
                <Image 
                    src={ARTICLE_DETAIL.coverImage} 
                    alt={ARTICLE_DETAIL.title} 
                    fill 
                    className="object-cover"
                    priority
                    unoptimized
                />
            </div>
        </div>

        {/* --- 2. NỘI DUNG BÀI VIẾT (ĐÃ FIX KHOẢNG CÁCH) --- */}
        <div className="container mx-auto px-4 max-w-3xl">
            {/* FIX LỖI DÍNH CHỮ VÀ ẢNH Ở ĐÂY:
                - prose-p:mb-10: Tăng khoảng cách dưới của mỗi đoạn văn lên 40px (cũ là mb-6).
                - prose-img:my-16: Tăng khoảng cách trên và dưới của ảnh lên 64px (cũ là my-12).
                - prose-headings:mt-16 và prose-headings:mb-8: Tăng khoảng cách cho các tiêu đề con (h2, h3...).
                - [&_.image-wrapper]:my-16: Thêm rule riêng để đẩy khoảng cách cho thẻ div bọc ảnh (nếu có).
            */}
            <article className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:font-bold prose-headings:mt-16 prose-headings:mb-8 
                prose-p:mb-10 prose-p:leading-8 text-gray-800
                prose-img:rounded-xl prose-img:my-16 prose-img:w-full
                prose-a:text-red-600 hover:prose-a:text-red-700
                [&_.image-wrapper]:my-16
            ">
                <div dangerouslySetInnerHTML={{ __html: ARTICLE_DETAIL.content }} />
            </article>

            {/* --- 3. TAGS & AUTHOR BIO --- */}
            <div className="mt-20 pt-10 border-t border-gray-100">
                
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-3 mb-12">
                    <Tag size={18} className="text-gray-400" />
                    {ARTICLE_DETAIL.tags.map(tag => (
                        <span key={tag} className="bg-gray-50 text-gray-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 cursor-pointer transition-colors">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Author Bio Box */}
                <div className="flex items-center gap-6 bg-gray-50 p-8 rounded-2xl">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <Image 
                            src={ARTICLE_DETAIL.authorAvatar} 
                            alt={ARTICLE_DETAIL.author} 
                            fill 
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Written by</p>
                        <h4 className="text-lg font-serif font-bold text-gray-900">{ARTICLE_DETAIL.author}</h4>
                        <p className="text-sm text-gray-500 mt-1">{ARTICLE_DETAIL.authorRole}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- 4. VIDEO SECTION --- */}
        <section className="bg-black text-white py-20 mt-20">
            <div className="container mx-auto px-4 max-w-5xl text-center">
                <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase mb-4 block">Multimedia</span>
                <h3 className="text-2xl md:text-4xl font-serif font-bold mb-10">Behind The Scenes & Runway</h3>
                
                {/* Video Player Wrapper */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-800 group cursor-pointer">
                    <Image 
                        src={ARTICLE_DETAIL.featuredVideo.thumbnail} 
                        alt="Video Thumbnail"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                        unoptimized
                    />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Play size={24} className="text-black ml-1 fill-black" />
                            </div>
                        </div>
                    </div>

                    {/* Video Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent text-left">
                        <h4 className="text-xl font-bold mb-1">{ARTICLE_DETAIL.featuredVideo.title}</h4>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Clock size={14}/> {ARTICLE_DETAIL.featuredVideo.duration}
                        </p>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}