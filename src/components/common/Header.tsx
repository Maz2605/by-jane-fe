"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, User, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
export default function Header() {

    const { user, isLoggedIn, logout } = useAuthStore(); // Lấy thông tin user

    const totalItems = useCartStore((state) => state.totalItems());
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    return (
        <header className="w-full font-sans shadow-sm">
            <div className="container mx-auto px-4 md:px-10">

                {/* MAIN HEADER */}
                <div className="flex items-center justify-between py-6 gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <Image
                            src="/images/logo/logo.png"
                            alt="Logo Shop"
                            width={300}
                            height={100}
                            className="h-26 w-auto object-contain" // Class này sẽ ghi đè kích thước ở trên
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
                        {isMounted && isLoggedIn ? (
               // ĐÃ ĐĂNG NHẬP
               <div className="flex flex-col items-center gap-1 cursor-pointer group relative hover:text-[#FF5E4D]">
                <Link href={"/profile"}>
                  <User size={20} strokeWidth={1.5} />
                  <span className="text-[10px] md:text-xs font-medium">{user?.username}</span>
                </Link>
                  
                  {/* Menu con: Đăng xuất
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white shadow-lg rounded border border-gray-100 hidden group-hover:block z-50">
                     <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-500"
                     >
                        Đăng xuất
                     </button>
                  </div> */}
               </div>
            ) : (
               // CHƯA ĐĂNG NHẬP
               <Link href="/login" className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D]">
                  <User size={20} strokeWidth={1.5} />
                  <span className="text-[10px] md:text-xs font-medium">Tài khoản</span>
               </Link>
            )}
                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D] relative">
                            <Link href="/cart" className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D] relative group">
                                <div className="relative">
                                    <ShoppingBag size={20} strokeWidth={1.5} />
                                    {/* HIỂN THỊ SỐ LƯỢNG THẬT */}
                                    {isMounted && totalItems > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-[#FF5E4D] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] md:text-xs font-medium">Giỏ hàng</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="border-t border-gray-100 py-4 overflow-x-auto">
                    <ul className="flex items-center gap-6 md:gap-8 text-sm font-semibold text-gray-700 whitespace-nowrap">
                        <li><Link href="/" className="text-[#FF5E4D]">Trang chủ</Link></li>
                        <li><Link href="/products" className="hover:text-[#FF5E4D]">Sản phẩm</Link></li>
                        <li><Link href="/products" className="hover:text-[#FF5E4D]">Danh mục sản phẩm</Link></li>
                        <li><Link href="/news" className="hover:text-[#FF5E4D]">Tin tức</Link></li>
                        <li><Link href="/Footer" className="hover:text-[#FF5E4D]">Liên hệ</Link></li>
                    </ul>
                </nav>

            </div>
        </header>
    );
}