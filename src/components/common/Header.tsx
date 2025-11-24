import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, User, ShoppingBag, ChevronDown } from 'lucide-react';

export default function Header() {
    return (
        <header className="w-full font-sans shadow-sm">

            {/* TOP BANNER: Màu cam */}


            <div className="container mx-auto px-4 md:px-10">

                {/* MAIN HEADER */}
                <div className="flex items-center justify-between py-6 gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <Image
                            src="/images/logo/logo.png"
                            alt="Logo Shop"
                            width={200}
                            height={100}
                            className="h-24 w-auto object-contain" // Class này sẽ ghi đè kích thước ở trên
                            priority // Báo cho Next.js biết đây là ảnh quan trọng, cần load ngay lập tức
                        />
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full bg-gray-100 rounded-full py-3 pl-6 pr-12 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition"
                        />
                        <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#FF5E4D] text-white p-2 rounded-full hover:bg-orange-600">
                            <Search size={18} />
                        </button>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D]">
                            <Heart size={20} /> <span className="text-[10px] md:text-xs">Yêu thích</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D]">
                            <User size={20} /> <span className="text-[10px] md:text-xs">Tài khoản</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D] relative">
                            <ShoppingBag size={20} />
                            <span className="text-[10px] md:text-xs">Giỏ hàng</span>
                            <span className="absolute -top-1 -right-1 bg-[#FF5E4D] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">0</span>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="border-t border-gray-100 py-4 overflow-x-auto">
                    <ul className="flex items-center gap-6 md:gap-8 text-sm font-semibold text-gray-700 whitespace-nowrap">
                        <li><Link href="/" className="text-[#FF5E4D]">Trang chủ</Link></li>
                        <li className="flex items-center gap-1 cursor-pointer hover:text-[#FF5E4D]">Nữ <ChevronDown size={14} /></li>
                        <li className="flex items-center gap-1 cursor-pointer hover:text-[#FF5E4D]">Nam <ChevronDown size={14} /></li>
                        <li><Link href="/news" className="hover:text-[#FF5E4D]">Tin tức</Link></li>
                        <li><Link href="/contact" className="hover:text-[#FF5E4D]">Liên hệ</Link></li>
                        <li><Link href="/store" className="hover:text-[#FF5E4D]">Hệ thống cửa hàng</Link></li>
                    </ul>
                </nav>

            </div>
        </header>
    );
}