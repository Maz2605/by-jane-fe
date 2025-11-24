import { Headset, PackageCheck, Truck, HandCoins } from "lucide-react";

export default function Hero() {
  return (
    // Thêm pb-12 để tạo khoảng trống bên dưới do phần margin âm kéo lên
    <section className="bg-white-50 pb-12">
      
      {/* PHẦN 1: BANNER ẢNH */}
      <div className="w-full relative">
        {/* LƯU Ý QUAN TRỌNG: 
           Bạn CẦN CÓ file ảnh 'banner-full.png' trong thư mục 'public'
           thì ảnh mới hiện ra nhé.
        */}
        <img 
          src="/images/banners/banner-full-1.png"
          alt="Banner Khuyến Mãi" 
          className="w-full h-auto object-cover min-h-[300px] md:min-h-[500px]"
        />
      </div>

      {/* PHẦN 2: TRUST BAR (Thanh trắng trồi lên đè lên ảnh) */}
      <div className="container mx-auto px-4 md:px-10 relative z-10">
        {/* 👉 KEY POINT: 
           -mt-16 (mobile) và md:-mt-24 (desktop) 
           chính là phần kéo nó trồi lên trên ảnh.
        */}
        <div className="bg-white rounded-xl shadow-xl -mt-16 md:-mt-12 py-6 px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Item 1 */}
          <div className="flex items-center gap-3 md:justify-center md:border-r border-gray-100 last:border-0">
            <div className="bg-[#FF8A65] p-2.5 rounded-xl text-white shrink-0">
              <Headset size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-800">Giao hàng toàn quốc</p>
              <p className="text-xs text-gray-500 mt-0.5">Thanh toán (COD) khi nhận hàng</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-3 md:justify-center md:border-r border-gray-100 last:border-0">
            <div className="bg-[#FF8A65] p-2.5 rounded-xl text-white flex-shrink-0">
              <PackageCheck size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-800">Miễn phí giao hàng</p>
              <p className="text-xs text-gray-500 mt-0.5">Theo chính sách</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3 md:justify-center md:border-r border-gray-100 last:border-0">
            <div className="bg-[#FF8A65] p-2.5 rounded-xl text-white flex-shrink-0">
              <Truck size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-800">Đổi trả trong 7 ngày</p>
              <p className="text-xs text-gray-500 mt-0.5">Kể từ ngày mua hàng</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center gap-3 md:justify-center">
            <div className="bg-[#FF8A65] p-2.5 rounded-xl text-white flex-shrink-0">
              <HandCoins size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-800">Hỗ trợ 24/7</p>
              <p className="text-xs text-gray-500 mt-0.5">Theo chính sách</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}