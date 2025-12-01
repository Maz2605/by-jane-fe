"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  pageCount: number; // Tổng số trang
  page: number;      // Trang hiện tại
  pageSize: number;  // Số lượng mỗi trang
}

export default function Pagination({ pageCount, page, pageSize }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hàm chuyển trang hoặc đổi limit
  const handlePageChange = (newPage: number | string, type: "page" | "limit" = "page") => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (type === "page") {
      params.set("page", newPage.toString());
    } else {
      // Nếu đổi limit thì reset về trang 1
      params.set("limit", newPage.toString());
      params.set("page", "1"); 
    }

    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Không hiện gì nếu chỉ có 1 trang và không cần chỉnh limit
  if (pageCount <= 1 && pageSize === 12) return null;

  return (
    <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100 pt-6">
      
      {/* 1. Chọn số lượng hiển thị (Limit) */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Hiển thị:</span>
        <select 
          value={pageSize}
          onChange={(e) => handlePageChange(e.target.value, "limit")}
          className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#FF5E4D] bg-white cursor-pointer"
        >
          <option value="12">12 / trang</option>
          <option value="20">20 / trang</option>
          <option value="50">50 / trang</option>
          <option value="100">100 / trang</option>
        </select>
      </div>

      {/* 2. Danh sách số trang (Pagination) */}
      <div className="flex items-center gap-1">
        {/* Nút Prev */}
        <button 
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Render các số trang */}
        {/* Đây là logic đơn giản: Render từ 1 đến pageCount */}
        {/* Nếu nhiều trang quá (>7) thì cần logic phức tạp hơn, nhưng tạm thời map hết */}
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`w-8 h-8 flex items-center justify-center rounded border transition-colors font-medium text-sm ${
              page === p
                ? "bg-[#FF5E4D] border-[#FF5E4D] text-white" // Active
                : "border-gray-200 text-gray-600 hover:border-[#FF5E4D] hover:text-[#FF5E4D]" // Normal
            }`}
          >
            {p}
          </button>
        ))}

        {/* Nút Next */}
        <button 
          disabled={page >= pageCount}
          onClick={() => handlePageChange(page + 1)}
          className="w-8 h-8 flex items-center justify-center rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}