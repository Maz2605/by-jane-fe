import Link from "next/link";

// Danh sách danh mục (Nhớ thay đúng tên file ảnh bạn đã có)
const categories = [
  { id: 1, name: "Áo Nữ", img: "/images/categories/ao-nu.png", link: "/products?cat=woman-shirt" },
  { id: 2, name: "Váy", img: "/images/categories/vay.png", link: "/products?cat=dress" },
  { id: 3, name: "Áo Nam", img: "/images/categories/ao-nam.png", link: "/products?cat=man-shirt" },
  { id: 4, name: "Sơ Mi", img: "/images/categories/so-mi.png", link: "/products?cat=shirt" },
  { id: 5, name: "Quần", img: "/images/categories/quan.png", link: "/products?cat=pants" },
  { id: 6, name: "Áo Khoác", img: "/images/categories/ao-khoac.png", link: "/products?cat=jacket" },
  { id: 7, name: "Giày Dép", img: "/images/categories/giay.png", link: "/products?cat=shoes" },
  { id: 8, name: "Phụ Kiện", img: "/images/categories/phu-kien.png", link: "/products?cat=accessories" },
];

export default function CategoryList() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Grid chia cột: Mobile 2 cột, PC 4 cột */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center group cursor-pointer">
              
              <Link href={cat.link} className="flex flex-col items-center w-full">
                
                {/* --- PHẦN ẢNH (Đã thay đổi) --- */}
                {/* Không còn bg-gray hay rounded-full bằng CSS nữa */}
                {/* Chỉ cần một cái khung (div) để giới hạn kích thước ảnh */}
                <div className="w-32 h-32 md:w-44 md:h-44 mb-3 relative transition-transform duration-300 group-hover:-translate-y-2">
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-contain" 
                  />
                  {/* object-contain: Giúp ảnh hiển thị trọn vẹn, không bị cắt xén dù khung hình vuông */}
                </div>

                {/* --- PHẦN TÊN DANH MỤC --- */}
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