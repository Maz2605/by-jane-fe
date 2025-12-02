"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, RefreshCcw } from "lucide-react"; // Đã bỏ X

interface Category {
  id: number;
  name: string;
  slug: string;
}

const PRICE_RANGES = [
  { label: "Dưới 200.000đ", value: "0-200000" },
  { label: "200.000đ - 500.000đ", value: "200000-500000" },
  { label: "500.000đ - 1.000.000đ", value: "500000-1000000" },
  { label: "Trên 1.000.000đ", value: "1000000-99999999" },
];

export default function ProductFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy giá trị hiện tại
  const currentCategory = searchParams.get("category");
  const currentPrice = searchParams.get("price");

  // Chỉ còn 2 section
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    params.delete("page"); 
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Logic xóa riêng (cho nút "Bỏ chọn")
  const clearFilterKey = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push("/products");
  };

  const hasFilters = currentCategory || currentPrice;

  return (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-100 shadow-sm sticky top-24">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
        <h2 className="font-bold text-lg text-gray-800">Bộ lọc</h2>
        {hasFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full transition-colors"
          >
            <RefreshCcw size={10} /> Đặt lại
          </button>
        )}
      </div>

      {/* --- 1. DANH MỤC --- */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <div 
            className="flex justify-between items-center w-full mb-3 cursor-pointer group"
            onClick={() => toggleSection('category')}
        >
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide group-hover:text-[#FF5E4D] transition-colors">
                Danh mục
            </h3>
            <div className="flex items-center gap-2">
                {currentCategory && (
                    <button onClick={(e) => clearFilterKey(e, 'category')} className="text-[10px] text-gray-400 hover:text-red-500 underline">
                        Bỏ chọn
                    </button>
                )}
                {openSections.category ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
        </div>
        
        {openSections.category && (
            <ul className="space-y-1 text-sm pl-1 max-h-60 overflow-y-auto scrollbar-thin">
                <li>
                  <button 
                    onClick={() => handleFilterChange("category", "")} 
                    className={`block w-full text-left py-1.5 px-3 rounded-md transition-colors ${
                      !currentCategory 
                        ? "text-[#FF5E4D] font-bold bg-orange-50" 
                        : "text-gray-600 hover:text-[#FF5E4D] hover:bg-gray-50"
                    }`}
                  >
                    Tất cả sản phẩm
                  </button>
                </li>
                {categories.map((cat) => {
                  const isActive = currentCategory === cat.slug;
                  return (
                    <li key={cat.id}>
                      <button 
                        onClick={() => handleFilterChange("category", cat.slug)}
                        className={`block w-full text-left py-1.5 px-3 rounded-md transition-colors ${
                          isActive 
                            ? "text-[#FF5E4D] font-bold bg-orange-50" 
                            : "text-gray-600 hover:text-[#FF5E4D] hover:bg-gray-50"
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  );
                })}
            </ul>
        )}
      </div>

      {/* --- 2. KHOẢNG GIÁ --- */}
      <div>
        <div 
            className="flex justify-between items-center w-full mb-3 cursor-pointer group"
            onClick={() => toggleSection('price')}
        >
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide group-hover:text-[#FF5E4D] transition-colors">
                Khoảng giá
            </h3>
            <div className="flex items-center gap-2">
                {currentPrice && (
                    <button onClick={(e) => clearFilterKey(e, 'price')} className="text-[10px] text-gray-400 hover:text-red-500 underline">
                        Bỏ chọn
                    </button>
                )}
                {openSections.price ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
        </div>
        
        {openSections.price && (
            <ul className="space-y-1 text-sm pl-1">
                {PRICE_RANGES.map((range) => {
                   const isActive = currentPrice === range.value;
                   return (
                    <li key={range.value}>
                        <button 
                            onClick={() => handleFilterChange("price", range.value)}
                            className={`block w-full text-left py-1.5 px-3 rounded-md transition-colors items-center gap-2 ${
                                isActive ? "text-[#FF5E4D] font-bold bg-orange-50" : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isActive ? 'border-[#FF5E4D]' : 'border-gray-300'}`}>
                                {isActive && <span className="w-2 h-2 rounded-full bg-[#FF5E4D]"></span>}
                            </span>
                            {range.label}
                        </button>
                    </li>
                   )
                })}
            </ul>
        )}
      </div>

    </div>
  );
}