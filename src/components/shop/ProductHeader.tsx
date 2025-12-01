import SortDropdown from "./SortDropdown";

interface ProductHeaderProps {
  title: string;
  count: number;
}

// Đây là Server Component (Không có "use client") -> Tốt cho SEO
export default function ProductHeader({ title, count }: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100">
      
      {/* Tiêu đề + Số lượng */}
      <h1 className="text-2xl font-bold text-gray-800 uppercase flex items-center gap-2">
        {title}
        
      </h1>

      {/* Gọi Component SortDropdown (Client) vào trong Component Server */}
      <div className="mt-4 sm:mt-0">
        <SortDropdown />
      </div>

    </div>
  );
}