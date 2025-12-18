import React from "react";
import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;   // Icon tùy chỉnh (nếu không truyền sẽ lấy mặc định)
  action?: React.ReactNode; // Nút bấm hành động (ví dụ: "Quay lại", "Xóa bộ lọc")
}

export default function EmptyState({ 
  title = "Không có dữ liệu", 
  description = "Hiện tại chưa có dữ liệu nào ở đây.",
  icon,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-center w-full h-full min-h-[400px]">
      
      {/* 1. Icon Area: Có nền trắng và bóng nhẹ để nổi bật */}
      <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-sm mb-6 text-gray-300">
        {icon || <PackageOpen size={40} strokeWidth={1.5} />}
      </div>
      
      {/* 2. Content Area */}
      <h3 className="text-gray-900 font-semibold text-xl mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 text-base max-w-sm mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      
      {/* 3. Action Area (Nếu có nút bấm thì hiển thị) */}
      {action && (
        <div className="animate-fade-in-up">
          {action}
        </div>
      )}
    </div>
  );
}