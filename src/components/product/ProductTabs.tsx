"use client";
import { useState } from "react";
// Import thư viện để hiển thị nội dung Rich Text từ Strapi
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export default function ProductTabs({ description }: { description: any }) {
  // State để biết đang bấm vào tab nào (Mặc định là 'desc' - Mô tả)
  const [activeTab, setActiveTab] = useState<"desc" | "policy" | "review">("desc");

  return (
    <div className="mt-16">
      
      {/* 1. THANH TAB (Menu bấm chuyển đổi) */}
      <div className="flex justify-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
        
        {/* Nút Tab: Mô tả */}
        <button 
            onClick={() => setActiveTab("desc")}
            className={`pb-4 text-lg font-bold uppercase transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "desc" 
                ? "text-[#FF5E4D] border-[#FF5E4D]" 
                : "text-gray-500 border-transparent hover:text-gray-800"
            }`}
        >
            Thông tin sản phẩm
        </button>

        {/* Nút Tab: Chính sách */}
        <button 
            onClick={() => setActiveTab("policy")}
            className={`pb-4 text-lg font-bold uppercase transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "policy" 
                ? "text-[#FF5E4D] border-[#FF5E4D]" 
                : "text-gray-500 border-transparent hover:text-gray-800"
            }`}
        >
            Chính sách đổi trả
        </button>

        {/* Nút Tab: Đánh giá
        <button 
            onClick={() => setActiveTab("review")}
            className={`pb-4 text-lg font-bold uppercase transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "review" 
                ? "text-[#FF5E4D] border-[#FF5E4D]" 
                : "text-gray-500 border-transparent hover:text-gray-800"
            }`}
        >
            Đánh giá
        </button> */}
      </div>

      {/* 2. NỘI DUNG TAB (Thay đổi dựa theo activeTab) */}
      <div className="prose max-w-none text-gray-600 leading-relaxed">
        
        {/* Nội dung Tab Mô tả */}
        {activeTab === "desc" && (
            <div className="bg-gray-50 p-6 rounded-lg">
                {description ? (
                    // Logic thông minh: Kiểm tra xem dữ liệu là Chữ thường hay Object Strapi
                    typeof description === 'string' ? (
                        // Nếu là chữ thường (Mock data) -> Hiện luôn
                        <p>{description}</p>
                    ) : (
                        // Nếu là Object (Strapi Blocks) -> Dùng thư viện để vẽ ra HTML đẹp
                        <BlocksRenderer content={description} />
                    )
                ) : (
                    <p className="text-gray-400 italic">Đang cập nhật nội dung chi tiết...</p>
                )}
            </div>
        )}

        {/* Nội dung Tab Chính sách */}
        {activeTab === "policy" && (
            <div className="space-y-4">
                <p><strong>1. Điều kiện đổi trả:</strong> Sản phẩm còn nguyên tem mác, chưa qua sử dụng.</p>
                <p><strong>2. Thời gian:</strong> Trong vòng 7 ngày kể từ khi nhận hàng.</p>
                <p><strong>3. Phí vận chuyển:</strong> Miễn phí nếu lỗi do nhà sản xuất.</p>
            </div>
        )}

        {/* Nội dung Tab Đánh giá
        {activeTab === "review" && (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-400">Chưa có đánh giá nào cho sản phẩm này.</p>
                <button className="mt-4 text-[#FF5E4D] font-medium hover:underline">
                    Viết đánh giá đầu tiên
                </button>
            </div>
        )} */}

      </div>
    </div>
  );
}