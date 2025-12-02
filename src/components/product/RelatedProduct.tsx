"use client";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

export default function RelatedProducts({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Dùng state để quản lý việc hiện nút mũi tên thay vì dùng group-hover
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth / 2; 
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div 
      className="mt-20 border-t border-gray-100 pt-10 relative"
      // Khi hover vào vùng này thì mới hiện nút mũi tên
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <h2 className="text-2xl font-bold text-center text-gray-800 uppercase mb-8">
        Sản phẩm liên quan
      </h2>

      {/* Nút Prev - Chỉ hiện khi isHovered = true */}
      <button 
        onClick={() => scroll("left")}
        className={`absolute left-0 top-[60%] z-10 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-[#FF5E4D] transition-opacity duration-300 disabled:opacity-0 hidden md:block ${
            isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <ChevronLeft size={24} />
      </button>

      {/* CONTAINER TRƯỢT NGANG */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-1"
        style={{ scrollBehavior: "smooth" }}
      >
        {products.map((product) => (
          <div key={product.id} className="w-[45%] md:w-[30%] lg:w-[19%] snap-start flex-shrink-0 h-full">
            {/* ProductCard giữ nguyên logic hover của riêng nó */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Nút Next - Chỉ hiện khi isHovered = true */}
      <button 
        onClick={() => scroll("right")}
        className={`absolute right-0 top-[60%] z-10 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-[#FF5E4D] transition-opacity duration-300 hidden md:block ${
            isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <ChevronRight size={24} />
      </button>

    </div>
  );
}