import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, User, ChevronLeft, Tag } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Montserrat } from "next/font/google";

// Import Service & Component
import { getArticleBySlug, mapStrapiArticleToFrontend } from "@/services/article";
import RichText from "@/components/news/RichText";

// 1. IMPORT COMPONENT SHARE MỚI
import ShareButton from "@/components/news/ShareButton";

// Cấu hình Font
const montserrat = Montserrat({
  subsets: ["vietnamese"],
  weight: ["400", "500", "700", "800"],
});

type Params = Promise<{ slug: string }>;

export default async function ArticleDetailPage(props: { params: Params }) {
  const params = await props.params;
  const { slug } = params;

  const rawData = await getArticleBySlug(slug);
  const article = mapStrapiArticleToFrontend(rawData);

  if (!article) {
    return (
      <div className={`flex flex-col min-h-screen ${montserrat.className}`}>
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center pt-20 pb-20">
            <h1 className="text-6xl font-extrabold mb-4 text-gray-200">404</h1>
            <p className="text-gray-500 mb-8 font-medium">Bài viết không tồn tại hoặc đã bị xóa.</p>
            <Link href="/blog" className="text-red-600 hover:underline font-bold uppercase tracking-widest text-sm">Quay lại Blog</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen bg-white text-gray-900 ${montserrat.className}`}>
      <Header />

      <main className="flex-grow">
        
        {/* HERO IMAGE */}
        <div className="relative w-full h-[60vh] md:h-[75vh]">
            {article.coverImage ? (
                <Image 
                    src={article.coverImage} 
                    alt={article.title} 
                    fill 
                    className="object-cover" 
                    priority 
                    unoptimized
                />
            ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700 font-bold">No Cover Image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                <div className="container mx-auto max-w-6xl">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] mb-6 hover:text-red-400 transition font-bold">
                        <ChevronLeft size={16}/> Back to Journal
                    </Link>
                    
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-8 max-w-5xl shadow-sm">
                        {article.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm font-semibold opacity-90">
                        <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                            <User size={16}/> {article.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={16}/> {article.publishedDate}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* CỘT TRÁI */}
                <div className="lg:col-span-8">
                    
                    {/* SAPO */}
                    {article.description && (
                        <div className="text-lg md:text-xl font-semibold text-gray-700 mb-10 border-l-4 border-red-600 pl-6 leading-relaxed bg-gray-50 py-6 rounded-r-lg">
                            {article.description}
                        </div>
                    )}

                    {/* VIDEO */}
                    {article.video && (
                        <div className="mb-12 group relative rounded-xl overflow-hidden shadow-2xl bg-black aspect-video">
                             <video 
                                controls 
                                className="w-full h-full object-contain"
                                poster={article.coverImage || undefined}
                             >
                                <source src={article.video} type="video/mp4" />
                                Trình duyệt của bạn không hỗ trợ thẻ video.
                            </video>
                        </div>
                    )}

                    {/* NỘI DUNG CHÍNH */}
                    <article className="prose prose-lg max-w-none 
                        prose-headings:font-extrabold prose-headings:text-gray-900 
                        prose-p:font-medium prose-p:text-gray-700 prose-p:leading-8
                        prose-img:rounded-xl prose-a:text-red-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline">
                        {article.content ? (
                            <RichText content={article.content} />
                        ) : (
                            <p className="text-gray-400 font-medium bg-gray-50 p-4 rounded text-center">Nội dung bài viết đang được cập nhật...</p>
                        )}
                    </article>

                    {/* GALLERY */}
                    {article.gallery && article.gallery.length > 0 && (
                        <div className="mt-16 pt-10 border-t border-gray-100">
                            <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-3 uppercase tracking-wide">
                                <span className="w-8 h-[4px] bg-red-600"></span> Lookbook Gallery
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {article.gallery.map((img: string, idx: number) => (
                                    <div 
                                        key={idx} 
                                        className={`relative rounded-xl overflow-hidden shadow-sm aspect-[3/4] cursor-pointer group ${idx === 0 ? 'md:col-span-2 md:aspect-[2/1]' : ''}`}
                                    >
                                        <Image 
                                            src={img} 
                                            alt={`Gallery Image ${idx + 1}`} 
                                            fill 
                                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                            unoptimized 
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FOOTER BÀI VIẾT */}
                    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex gap-2 text-sm font-bold text-gray-600 items-center">
                             <Tag size={18} className="text-red-600" /> Fashion, Trends, 2025
                        </div>
                        
                        {/* 2. SỬ DỤNG COMPONENT SHAREBUTTON Ở ĐÂY */}
                        <ShareButton title={article.title} slug={article.slug} />
                        
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <aside className="lg:col-span-4 space-y-10">
                    <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100">
                        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 overflow-hidden relative border-2 border-gray-100 shadow-sm flex items-center justify-center">
                             <span className="text-3xl font-extrabold text-gray-300">
                                {article.author.charAt(0)}
                             </span>
                        </div>
                        <p className="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-2">Written By</p>
                        <h4 className="text-xl font-extrabold text-gray-900">{article.author}</h4>
                        <p className="text-sm font-semibold text-gray-500 mt-2">Fashion Editor & Stylist</p>
                    </div>
                </aside>
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}