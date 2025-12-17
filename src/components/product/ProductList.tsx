"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import SectionTitle from "@/components/common/SectionTitle";

// QUAN TRỌNG: Import Type từ file service/api gốc
// Đừng tự định nghĩa interface Product ở đây nữa
import { Product } from "@/services/product"; 

interface ProductListProps {
  data: Product[]; // Sử dụng Type chuẩn đồng bộ với API
  title?: string;
}

export default function ProductList({ data, title }: ProductListProps) {
  
  // State quản lý số lượng hiển thị (Mặc định 12)
  const [visibleCount, setVisibleCount] = useState(12);

  // Cắt danh sách từ 0 đến số lượng đang hiển thị
  const displayProducts = data.slice(0, visibleCount);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* Nếu có truyền title thì mới hiện SectionTitle */}
        {title && (
          <div className="mb-10">
             <SectionTitle title={title} />
          </div>
        )}

        {/* Lưới sản phẩm */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-10">Đang cập nhật sản phẩm...</p>
        )}

        {/* Nút Xem thêm */}
        {visibleCount < data.length && (
          <div className="text-center mt-12">
            <button 
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="px-10 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded hover:bg-[#FF5E4D] hover:text-white hover:border-[#FF5E4D] transition-all"
            >
              Xem thêm
            </button>
          </div>
        )}

      </div>
    </section>
  );
}