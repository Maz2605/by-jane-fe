import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
// Import icon thương hiệu từ react-icons (Chuẩn logo gốc)
import { SiShopee, SiTiktok, SiFacebook, SiInstagram } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-[#FF5E4D]">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* GRID 4 CỘT */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Cột 1: Giới thiệu */}
          <div>
            <Link href="/" className="shrink-0">
                        <Image
                            src="/images/logo/logo.jpg"
                            alt="Logo Shop"
                            width={300}
                            height={100}
                            className="h-28 w-auto object-contain" // Class này sẽ ghi đè kích thước ở trên
                            priority // Báo cho Next.js biết đây là ảnh quan trọng, cần load ngay lập tức
                        />
                    </Link>
            <p className="text-sm leading-relaxed mb-6">
              Thương hiệu thời trang phong cách, mang đến những bộ sưu tập mới nhất, 
              trẻ trung và năng động cho giới trẻ.
            </p>
            
            {/* SOCIAL ICONS (Sửa lại phần này) */}
            <div className="flex gap-3">
              {/* Shopee - Màu cam đặc trưng */}
              <Link href="https://shopee.vn/byjane.hn?entryPoint=ShopBySearch&searchKeyword=by%20jane" className="bg-white p-2 rounded-full text-[#EE4D2D] hover:bg-[#EE4D2D] hover:text-white transition-all duration-300">
                <SiShopee size={20} />
              </Link>

              {/* TikTok - Màu đen đặc trưng */}
              <Link href="https://www.tiktok.com/@byjane.vn?is_from_webapp=1&sender_device=pc" className="bg-white p-2 rounded-full text-black hover:bg-black hover:text-white transition-all duration-300">
                <SiTiktok size={20} />
              </Link>

               
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 uppercase">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#FF5E4D] transition-colors">Giới thiệu</Link></li>
              <li><Link href="/blog" className="hover:text-[#FF5E4D] transition-colors">Tin tức thời trang</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 uppercase">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/policy" className="hover:text-[#FF5E4D] transition-colors">Chính sách đổi trả</Link></li>
              <li><Link href="/faq" className="hover:text-[#FF5E4D] transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="/guide" className="hover:text-[#FF5E4D] transition-colors">Hướng dẫn chọn size</Link></li>
              <li><Link href="/payment" className="hover:text-[#FF5E4D] transition-colors">Phương thức thanh toán</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 uppercase">Liên hệ</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#FF5E4D] mt-0.5 flex-shrink-0" />
                <span>90 Đ. Ngô Gia Tự, Suối Hoa, Bắc Ninh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#FF5E4D] flex-shrink-0" />
                <span>1900 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#FF5E4D] flex-shrink-0" />
                <span>support@byjaneshop.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* DÒNG BẢN QUYỀN */}
        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>© 2024 CreaT Shop. All rights reserved.</p>
          <p className="mt-2">Designed by Jane</p>
        </div>

      </div>
    </footer>
  );
}