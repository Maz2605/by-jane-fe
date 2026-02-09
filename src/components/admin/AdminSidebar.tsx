"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/common/LogoutButton"; // Import LogoutButton
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Newspaper,
    Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
    className?: string;
}

const sidebarItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Sản phẩm", icon: ShoppingBag },
    { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
    { href: "/admin/customers", label: "Khách hàng", icon: Users },
    { href: "/admin/news", label: "Tin tức", icon: Newspaper },
    { href: "/admin/vouchers", label: "Mã giảm giá", icon: Ticket },
    { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export default function AdminSidebar({ className }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <div className={cn("flex flex-col h-full bg-white text-gray-800", className)}>
            <div className="h-16 flex items-center px-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
                    <span className="text-[#FF5E4D]">ByJane</span> Admin
                </Link>
            </div>

            <div className="flex-1 py-6 overflow-y-auto">
                <nav className="space-y-2 px-4">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors",
                                    isActive
                                        ? "bg-[#FF5E4D1A] text-[#FF5E4D]"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <item.icon size={22} className={isActive ? "text-[#FF5E4D]" : "text-gray-500"} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-5 border-t mt-auto">
                <LogoutButton
                    className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl text-[15px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                    iconSize={22}
                >
                    Đăng xuất
                </LogoutButton>
            </div>
        </div>
    );
}
