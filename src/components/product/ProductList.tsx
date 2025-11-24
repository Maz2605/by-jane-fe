"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";
import SectionTitle from "../common/SectionTitle";

// DỮ LIỆU GIẢ (Dùng chung 1 ảnh p1.jpg)
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Quần Jeans Nam Slim Denim Like Cơ Bản ND006",
    price: 380000,
    originalPrice: 450000,
    image: "/images/products/p1.png", 
    discount: 21,
    colors: ["#1F2937", "#3B82F6"],
  },
  {
    id: 2,
    name: "Quần Dài Nữ Dáng Suông Chất Liệu Mềm Mát",
    price: 680000,
    originalPrice: 860000,
    image: "/images/products/p1.png",
    discount: 46,
    colors: ["#E5E7EB", "#FCA5A5"],
  },
  {
    id: 3,
    name: "Quần Jeans Nữ Dáng Crop Thời Thượng",
    price: 780000,
    image: "/images/products/p1.png",
    colors: ["#93C5FD"],
  },
  {
    id: 4,
    name: "Quần Jeans 5 Túi Siêu Co Giãn",
    price: 680000,
    originalPrice: 750000,
    image: "/images/products/p1.png",
    discount: 10,
    colors: ["#374151"],
  },
];

const TABS = ["Hàng mới về", "Giá tốt", "Tìm kiếm nhiều nhất", "Demo"];

export default function ProductList() {
  const [activeTab, setActiveTab] = useState("Hàng mới về");

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* TIÊU ĐỀ & TABS */}
        <div className="text-center mb-10">
          <SectionTitle title="Gợi ý hôm nay"/>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base text-gray-500 font-medium">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 border-b-2 transition-all duration-300 ${
                  activeTab === tab
                    ? "text-black border-[#FF5E4D]"
                    : "border-transparent hover:text-[#FF5E4D]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* LƯỚI SẢN PHẨM */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* NÚT XEM THÊM */}
        <div className="text-center mt-12">
          <button className="px-10 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded hover:bg-[#FF5E4D] hover:text-white hover:border-[#FF5E4D] transition-all">
            Xem thêm
          </button>
        </div>

      </div>
    </section>
  );
}