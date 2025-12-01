import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode; // Cho phép truyền icon khác vào nếu muốn
}

export default function EmptyState({ 
  title = "Không có dữ liệu", 
  description = "Vui lòng thử lại sau.",
  icon 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      
      {/* Nếu có truyền icon thì dùng, không thì dùng mặc định */}
      <div className="text-gray-300 mb-4">
        {icon || <PackageOpen size={48} />}
      </div>
      
      <p className="text-gray-500 font-medium text-lg">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}