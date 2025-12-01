"use client"; // Bắt buộc vì có tương tác
import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy giá trị sort hiện tại trên URL để hiển thị đúng (VD: đang chọn giá thấp đến cao)
  const currentSort = searchParams.get("sort") || "default";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    
    // Tạo bản sao của các tham số hiện tại (để không mất filter category)
    const params = new URLSearchParams(searchParams.toString());

    if (sortValue === "default") {
      params.delete("sort"); // Nếu chọn mặc định thì xóa tham số sort đi cho gọn URL
    } else {
      params.set("sort", sortValue);
    }

    // Đẩy URL mới lên (Next.js sẽ tự động gọi lại API ở page.tsx)
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500 hidden sm:inline">Sắp xếp theo:</span>
      <select 
        value={currentSort}
        onChange={handleSortChange}
        className="border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#FF5E4D] bg-white cursor-pointer hover:border-gray-400 transition-colors"
      >
        <option value="default">Mặc định</option>
        <option value="price:asc">Giá tăng dần</option>
        <option value="price:desc">Giá giảm dần</option>
        <option value="createdAt:desc">Mới nhất</option>
      </select>
    </div>
  );
}