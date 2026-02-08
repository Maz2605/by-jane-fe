"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, User, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { getCategories } from '@/services/category';
import { getStrapiMedia } from '@/services/base';

// 1. Thêm hooks điều hướng của Next.js
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
    id: number;
    name: string;
    slug: string;
    img: string;
}

// Tách SearchBar ra component con hoặc bọc cả Header trong Suspense 
// vì useSearchParams yêu cầu Suspense boundary trong Next.js App Router
function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State lưu từ khóa tìm kiếm
    const [searchQuery, setSearchQuery] = useState("");

    // Đồng bộ input với URL khi trang load (UX: để người dùng biết mình đang tìm gì)
    useEffect(() => {
        const currentSearch = searchParams.get('search'); // hoặc 'q' tùy backend
        if (currentSearch) {
            setSearchQuery(currentSearch);
        }
    }, [searchParams]);

    // Hàm xử lý tìm kiếm chính
    const handleSearch = () => {
        // 1. Trim khoảng trắng thừa
        const trimmedQuery = searchQuery.trim();

        // 2. Nếu ô tìm kiếm rỗng, không làm gì (hoặc có thể redirect về trang products gốc)
        if (!trimmedQuery) return;

        // 3. Điều hướng sang trang products với tham số search
        // encodeURIComponent để xử lý các ký tự đặc biệt (dấu cách, &, ?, ...)
        router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    };

    // Xử lý khi nhấn Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex-1 max-w-xl relative hidden md:block">
            <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-gray-100 rounded-full py-3 pl-6 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#FF5E4D]/50 transition border border-transparent focus:bg-white focus:border-[#FF5E4D]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#FF5E4D] text-white p-2 rounded-full hover:bg-orange-600 transition-colors shadow-md"
            >
                <Search size={18} />
            </button>
        </div>
    );
}

export default function Header() {
    const { data: session, status } = useSession();
    const totalItems = useCartStore((state) => state.totalItems());
    const [isMounted, setIsMounted] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                setIsLoading(true);
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Header: Failed to load categories", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenuData();
    }, []);

    return (
        <header className="w-full font-sans shadow-sm bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-10">
                <div className="flex items-center justify-between py-6 gap-4 md:gap-8">

                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <Image
                            src="/images/logo/logo.png"
                            alt="Logo Shop"
                            width={160}
                            height={50}
                            className="h-12 md:h-16 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* === SEARCH BAR ĐÃ TÁCH RA COMPONENT RIÊNG ĐỂ TỐI ƯU === */}
                    <Suspense fallback={<div className="flex-1 max-w-xl hidden md:block bg-gray-100 h-10 rounded-full"></div>}>
                        <SearchBar />
                    </Suspense>

                    {/* Icons Area */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* <Link href="/wishlist" className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D] transition-colors group">
                            <Heart size={20} className="group-hover:scale-110 transition-transform"/> 
                            <span className="text-[10px] md:text-xs font-medium">Yêu thích</span>
                        </Link> */}

                        {isMounted && session?.user ? (
                            <Link href="/profile" className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D] transition-colors group">
                                <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 group-hover:border-[#FF5E4D] transition-colors relative">
                                    {(session.user as any).avatar ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={getStrapiMedia((session.user as any).avatar.url) || undefined}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform w-full h-full p-0.5" />
                                    )}
                                </div>
                                <span className="text-[10px] md:text-xs font-medium truncate max-w-20">{session.user.name}</span>
                            </Link>
                        ) : (
                            <Link href="/login" className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D] transition-colors group">
                                <User size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] md:text-xs font-medium">Tài khoản</span>
                            </Link>
                        )}

                        <Link href="/cart" className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D] relative group transition-colors">
                            <div className="relative group-hover:scale-110 transition-transform">
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                {isMounted && totalItems > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[#FF5E4D] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] md:text-xs font-medium">Giỏ hàng</span>
                        </Link>
                        {/* Admin Dashboard Link - Only for Admins */}
                        {isMounted && ['Admin', 'Super Admin', 'admin'].includes((session?.user as any)?.role?.name) && (
                            <Link href="/admin" className="flex flex-col items-center gap-1 cursor-pointer hover:text-[#FF5E4D] transition-colors group">
                                <div className="p-1 rounded-md border border-dashed border-gray-300 group-hover:border-[#FF5E4D] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                                </div>
                                <span className="text-[10px] md:text-xs font-medium">Quản trị</span>
                            </Link>
                        )}

                    </div>
                </div>

                {/* Navigation (Giữ nguyên như cũ) */}
                <nav className="border-t border-gray-100 py-4 relative">
                    <ul className="flex items-center gap-6 md:gap-8 text-sm font-semibold text-gray-700">
                        <li><Link href="/" className="hover:text-[#FF5E4D] transition-colors">Trang chủ</Link></li>
                        <li><Link href="/products" className="hover:text-[#FF5E4D] transition-colors">Sản phẩm</Link></li>

                        <li className="group relative py-2">
                            <Link href="" className="flex items-center gap-1 hover:text-[#FF5E4D] transition-colors cursor-pointer">
                                Danh mục sản phẩm <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                            </Link>
                            <div className="absolute top-full left-0 pt-2 w-[280px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50 transform translate-y-4 group-hover:translate-y-0">
                                <div className="bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden">
                                    {isLoading ? (
                                        <div className="p-4 space-y-3">
                                            {[1, 2, 3].map((i) => <div key={i} className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>)}
                                        </div>
                                    ) : (
                                        <ul className="flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar">
                                            {categories.map((cat) => (
                                                <li key={cat.id}>
                                                    <Link href={`/products?category=${cat.slug}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 hover:text-[#FF5E4D] border-b border-gray-50 last:border-none transition-colors">
                                                        <span className="font-medium">{cat.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </li>
                        <li><Link href="/blog" className="hover:text-[#FF5E4D] transition-colors">Tin tức</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}