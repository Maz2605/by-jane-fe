"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { mockNotifications } from "@/lib/mock-data/notifications";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function AdminHeader() {
    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger Placeholder */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Search removed as requested */}

                {/* Back to Shop Link */}
                <a
                    href="/"
                    target="_blank"
                    className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#FF5E4D] transition-colors border px-3 py-1.5 rounded-md hover:bg-gray-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
                    Xem Cửa hàng
                </a>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-full">
                            <Bell className="h-5 w-5 text-gray-500" />
                            {mockNotifications.filter(n => !n.isRead).length > 0 && (
                                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-0">
                        <DropdownMenuLabel className="px-4 py-3 font-semibold border-b flex justify-between items-center">
                            <span>Thông báo</span>
                            <span className="text-xs font-normal text-muted-foreground">{mockNotifications.filter(n => !n.isRead).length} chưa đọc</span>
                        </DropdownMenuLabel>
                        <div className="max-h-[300px] overflow-y-auto">
                            {mockNotifications.slice(0, 5).map((notification) => (
                                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer border-b last:border-0 rounded-none focus:bg-muted/50" asChild>
                                    <Link href={notification.link || "#"}>
                                        <div className="flex justify-between w-full">
                                            <span className={`font-medium text-sm ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                                                {notification.title}
                                            </span>
                                            {!notification.isRead && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>}
                                        </div>
                                        <span className="text-xs text-muted-foreground line-clamp-1">{notification.description}</span>
                                        <span className="text-[10px] text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                                        </span>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>
                        <div className="p-2 border-t text-center">
                            <Link href="/admin/notifications">
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground w-full">Xem tất cả</Button>
                            </Link>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border select-none">
                    <Avatar className="h-9 w-9 cursor-default pointer-events-none">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
