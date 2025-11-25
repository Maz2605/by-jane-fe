import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import ProductCard from "@/components/product/ProductCard"; // Import Card cũ
import CountDownTimer from "@/components/ui/CountDownTimer"; // Import Đồng hồ

// Dữ liệu giả cho Flash Sale (Giảm giá sâu)
const FLASH_SALE_PRODUCTS = [
  {
    id: 101,
    name: "Áo Khoác Da Lộn Nam 2 Lớp Form Rộng",
    price: 350000,
    originalPrice: 650000,
    image: "/images/products/p1.png", // Dùng tạm ảnh cũ
    discount: 45, // Giảm sâu
    colors: ["#8B4513", "#000000"],
  },
  {
    id: 102,
    name: "Váy Len Nữ Dáng Dài Phối Màu",
    price: 199000,
    originalPrice: 400000,
    image: "/images/products/p1.png",
    discount: 50,
    colors: ["#FFC0CB", "#FFFFFF"],
  },
  {
    id: 103,
    name: "Giày Sneaker Thể Thao Phong Cách",
    price: 250000,
    originalPrice: 500000,
    image: "/images/products/p1.png",
    discount: 50,
  },
  {
    id: 104,
    name: "Túi Xách Nữ Thời Trang Cao Cấp",
    price: 150000,
    originalPrice: 300000,
    image: "/images/products/p1.png",
    discount: 50,
  },
];

const SALE_END_DATE = "2025-12-31T23:59:59";

export default function FlashSale() {
  return (
    <section className="py-10 bg-linear-to-r from-[#FF5E4D] to-[#FF8A65]">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* HEADER: Tiêu đề + Đồng hồ + Nút xem tất cả */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-300 fill-yellow-300 w-8 h-8 animate-pulse" />
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-wider">
                BACK TO SCHOOL
              </h2>
            </div>
            
            {/* Đồng hồ đếm ngược */}
            <div className="hidden md:block pl-8 border-l border-white/30">
                <span className="text-white text-sm mr-2 uppercase font-semibold">Kết thúc trong:</span>
                <div className="inline-block"><CountDownTimer targetDate={SALE_END_DATE}/></div>
            </div>
          </div>

          <Link href="/flash-sale" className="group flex items-center gap-1 text-white font-semibold hover:text-yellow-200 transition-colors">
            Xem tất cả <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>

        {/* LIST SẢN PHẨM */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {FLASH_SALE_PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white p-2 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
               {/* Tái sử dụng ProductCard nhưng bọc trong div trắng để nổi bật trên nền đỏ */}
               <ProductCard product={product} />
               
               {/* Thanh trạng thái "Đã bán" (Đặc trưng của Flash Sale) */}
               <div className="mt-2 px-2">
                 <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-[#FF5E4D] w-[80%]"></div>
                    <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[8px] text-white font-bold uppercase">
                        Đã bán 80%
                    </span>
                 </div>
               </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}