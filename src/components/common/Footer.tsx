import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";
// Import icon thương hiệu
import { SiShopee, SiTiktok } from "react-icons/si";

export default function Footer() {
  // Định nghĩa màu brand để dễ quản lý (hoặc dùng trong tailwind.config.js)
  const brandColor = "text-[#FF5E4D]";
  const hoverColor = "hover:text-[#FF5E4D]";

  return (
    <footer className="bg-[#F9F9F9] text-gray-600 pt-20 pb-10 border-t border-gray-200 font-sans">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* Cột 1: Brand & Intro (Chiếm 4/12 cột) */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link href="/" className="inline-block mb-6">
              {/* Lưu ý: Nên dùng logo PNG nền trong suốt thay vì JPG để đẹp nhất trên nền xám nhẹ */}
              <Image
                src="/images/logo/logo.jpg"
                alt="BYJANE Logo"
                width={180}
                height={60}
                className="h-auto w-40 object-contain mix-blend-multiply" 
                // mix-blend-multiply giúp logo JPG tệp vào nền xám nếu logo có nền trắng
                priority
                unoptimized = {true}
              />
            </Link>
            <p className="text-sm leading-7 text-gray-500 mb-8 pr-4">
              BYJANE - Thương hiệu thời trang phong cách, mang đến những bộ sưu tập 
              trẻ trung, hiện đại và đề cao sự thoải mái cho giới trẻ Việt Nam.
            </p>
            
            {/* Social Icons: Minimalist Style */}
            <div className="flex gap-4">
              <SocialLink href="https://shopee.vn/byjane.hn" icon={<SiShopee size={18} />} label="Shopee" />
              <SocialLink href="https://www.tiktok.com/@byjane.vn" icon={<SiTiktok size={18} />} label="TikTok" />
            </div>
          </div>

          {/* Cột 2: Về chúng tôi (Chiếm 2/12 cột) */}
          <div className="md:col-span-2">
            <h4 className="text-gray-900 font-bold text-base mb-6 uppercase tracking-wider">Về BYJANE</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/about">Câu chuyện thương hiệu</FooterLink>
              <FooterLink href="/blog">Tin tức thời trang</FooterLink>
              <FooterLink href="/recruit">Tuyển dụng</FooterLink>
              <FooterLink href="/contact">Liên hệ</FooterLink>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ (Chiếm 3/12 cột) */}
          <div className="md:col-span-3">
            <h4 className="text-gray-900 font-bold text-base mb-6 uppercase tracking-wider">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/policy">Chính sách đổi trả</FooterLink>
              <FooterLink href="/faq">Câu hỏi thường gặp (FAQ)</FooterLink>
              <FooterLink href="/guide">Hướng dẫn chọn size</FooterLink>
              <FooterLink href="/payment">Phương thức thanh toán</FooterLink>
              <FooterLink href="/shipping">Chính sách vận chuyển</FooterLink>
            </ul>
          </div>

          {/* Cột 4: Thông tin liên hệ (Chiếm 3/12 cột) */}
          <div className="md:col-span-3">
            <h4 className="text-gray-900 font-bold text-base mb-6 uppercase tracking-wider">Store</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className={`mt-0.5 shrink-0 ${brandColor}`} />
                <span className="group-hover:text-gray-900 transition-colors duration-200">
                  90 Đ. Ngô Gia Tự, Suối Hoa,<br/> Bắc Ninh, Việt Nam
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={18} className={`shrink-0 ${brandColor}`} />
                <span className="group-hover:text-gray-900 transition-colors duration-200 font-medium">
                  1900 123 456
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={18} className={`shrink-0 ${brandColor}`} />
                <span className="group-hover:text-gray-900 transition-colors duration-200">
                  support@byjaneshop.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- COPYRIGHT SECTION --- */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2025 HIT Maz. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             {/* Thêm các link phụ ở footer bottom thường thấy ở web xịn */}
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- SUB-COMPONENTS (Clean Code Pattern) ---
// Tách nhỏ component để code chính gọn gàng, dễ tái sử dụng và maintain

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-[#FF5E4D] hover:pl-1 transition-all duration-300 flex items-center gap-1 group">
        {/* Hiệu ứng nhỏ: Icon mũi tên hiện ra khi hover */}
        <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#FF5E4D]" />
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href} 
      aria-label={label}
      target="_blank"
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-[#FF5E4D] hover:text-white hover:border-[#FF5E4D] transition-all duration-300 shadow-sm"
    >
      {icon}
    </Link>
  );
}