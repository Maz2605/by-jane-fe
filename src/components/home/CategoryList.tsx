import Link from "next/link";

// Đã xóa "Giày Dép" và "Phụ Kiện"
const categories = [
  { id: 1, name: "Áo Nữ", img: "/images/categories/ao-nu.png", link: "/products?cat=woman-shirt" },
  { id: 2, name: "Váy", img: "/images/categories/vay.png", link: "/products?cat=dress" },
  { id: 3, name: "Áo Nam", img: "/images/categories/ao-nam.png", link: "/products?cat=man-shirt" },
  { id: 4, name: "Sơ Mi", img: "/images/categories/so-mi.png", link: "/products?cat=shirt" },
  { id: 5, name: "Quần", img: "/images/categories/quan.png", link: "/products?cat=pants" },
  { id: 6, name: "Áo Khoác", img: "/images/categories/ao-khoac.png", link: "/products?cat=jacket" },
];

export default function CategoryList() {
  return (
    <section className="py-12 bg-white mt-10 md:mt-15">
      <div className="container mx-auto px-4">
        
        {/* SỬA LẠI LAYOUT CHO CÂN ĐỐI VỚI 6 MÓN:
            - Mobile: grid-cols-2 (2 cột) -> 3 hàng
            - Desktop: md:grid-cols-3 (3 cột) -> 2 hàng thẳng tắp
            - Hoặc nếu muốn 1 hàng ngang hết thì dùng md:grid-cols-6
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-6 justify-center">
          
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center group cursor-pointer">
              
              <Link href={cat.link} className="flex flex-col items-center w-full">
                
                {/* Ảnh danh mục */}
                <div className="w-32 h-32 md:w-40 md:h-40 mb-3 relative transition-transform duration-300 group-hover:-translate-y-2">
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>

                {/* Tên danh mục */}
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