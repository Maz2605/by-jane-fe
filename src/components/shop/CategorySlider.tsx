import Link from "next/link";

// Định nghĩa kiểu dữ liệu (Copy từ CategoryList sang cho nhanh)
interface Category {
  id: number;
  name: string;
  slug: string;
  img: string;
}

export default function CategorySlider({ data }: { data: Category[] }) {
  
  // Nếu chưa có dữ liệu thì không hiện gì
  if (!data || data.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="font-bold text-gray-800 mb-4 text-lg">Danh mục nổi bật</h3>
      
      {/* Thanh cuộn ngang */}
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {data.map((cat) => (
          <Link 
            key={cat.id} 
            href={`/category/${cat.slug}`} 
            className="snap-start shrink-0 flex flex-col items-center group min-w-[100px] cursor-pointer"
          >
            {/* Vòng tròn ảnh */}
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-3 border-2 border-transparent group-hover:border-[#FF5E4D] transition-all shadow-sm">
               <img 
                 src={cat.img} 
                 alt={cat.name} 
                 className="w-16 h-16 object-contain" 
               />
            </div>
            
            {/* Tên danh mục */}
            <span className="text-sm font-bold text-gray-600 uppercase group-hover:text-[#FF5E4D] transition-colors text-center px-2">
                {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}