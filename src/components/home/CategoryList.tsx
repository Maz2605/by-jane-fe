import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  img: string;
}

export default function CategoryList({ data }: { data: Category[] }) {
  
  if (!data || data.length === 0) return null;

  // CẮT DỮ LIỆU: Chỉ lấy 6 phần tử đầu tiên
  const displayCategories = data.slice(0, 6);

  return (
    <section className="py-12 bg-white mt-10 md:mt-20">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-6 justify-center">
          
          {/* Map trên danh sách đã cắt (displayCategories) thay vì data gốc */}
          {displayCategories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center group cursor-pointer">
              
              <Link href={`/products?category=${cat.slug}`} className="flex flex-col items-center w-full">
                
                <div className="w-32 h-32 md:w-40 md:h-40 mb-3 relative transition-transform duration-300 group-hover:-translate-y-2">
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>

                <h3 className="font-bold text-gray-800 text-sm md:text-base uppercase tracking-wide group-hover:text-[#FF5E4D] transition-colors">
                  {cat.name}
                </h3>
                
              </Link>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}