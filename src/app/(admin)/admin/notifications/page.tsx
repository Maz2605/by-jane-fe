"use client";

import { useMemo, useState } from "react";
import { mockNotifications } from "@/lib/mock-data/notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing, Check, Info, Package, User, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { showSuccessToast } from "@/lib/toast-utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [dateFilter, setDateFilter] = useState("all");

    // Filter notifications based on date
    const filteredNotifications = useMemo(() => {
        if (dateFilter === "all") return notifications;

        const now = new Date();
        const cutoff = new Date();

        if (dateFilter === "today") {
            cutoff.setHours(0, 0, 0, 0);
        } else if (dateFilter === "7days") {
            cutoff.setDate(now.getDate() - 7);
        } else if (dateFilter === "30days") {
            cutoff.setDate(now.getDate() - 30);
        }

        return notifications.filter(n => new Date(n.createdAt) >= cutoff);
    }, [notifications, dateFilter]);

    const unreadCount = useMemo(() => filteredNotifications.filter(n => !n.isRead).length, [filteredNotifications]);

    const handleDeleteAll = () => {
        if (confirm("Bạn có chắc chắn muốn xóa tất cả thông báo không?")) {
            setNotifications([]);
            showSuccessToast("Đã xóa tất cả thông báo");
        }
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        showSuccessToast("Đã đánh dấu tất cả là đã đọc");
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "order": return <Package className="h-5 w-5 text-blue-500" />;
            case "customer": return <User className="h-5 w-5 text-green-500" />;
            case "system": return <Info className="h-5 w-5 text-yellow-500" />;
            case "promotion": return <BellRing className="h-5 w-5 text-purple-500" />;
            default: return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    const NotificationList = ({ items }: { items: typeof notifications }) => {
        if (items.length === 0) {
            return (
                <div className="text-center py-10 text-muted-foreground">
                    Không có thông báo nào.
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {items.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${!notification.isRead ? "bg-muted/30 border-primary/20" : "bg-card hover:bg-muted/10"}`}
                    >
                        <div className={`mt-1 h-9 w-9 rounded-full flex items-center justify-center bg-background border shadow-sm shrink-0`}>
                            {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium leading-none ${!notification.isRead ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                                    {notification.title}
                                </p>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {notification.description}
                            </p>
                            <div className="flex items-center gap-2 pt-2">
                                {notification.link && (
                                    <Link href={notification.link}>
                                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleMarkAsRead(notification.id)}>
                                            Xem chi tiết
                                        </Button>
                                    </Link>
                                )}
                                {!notification.isRead && (
                                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleMarkAsRead(notification.id)}>
                                        Đánh dấu đã đọc
                                    </Button>
                                )}
                            </div>
                        </div>
                        {!notification.isRead && (
                            <div className="mt-2 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                    </div>
                ))}
            </div>
        );
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Thông báo</h1>
                    <p className="text-sm text-muted-foreground mt-1">Cập nhật tin tức và hoạt động mới nhất</p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-[#FF5E4D] hover:text-[#FF5E4D] hover:bg-[#FF5E4D]/10">
                        <Check className="mr-2 h-4 w-4" />
                        Đánh dấu tất cả đã đọc
                    </Button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
                <Tabs defaultValue="all" className="w-full">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                        <TabsList className="h-auto p-0 bg-transparent flex flex-wrap gap-2">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 h-9 border border-transparent data-[state=active]:border-primary/20"
                            >
                                Tất cả
                                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1 rounded-full text-[10px] bg-gray-100 text-gray-600 group-data-[state=active]:bg-primary/20 group-data-[state=active]:text-primary">
                                    {filteredNotifications.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger
                                value="unread"
                                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 h-9 border border-transparent data-[state=active]:border-primary/20"
                            >
                                Chưa đọc
                                {unreadCount > 0 && (
                                    <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1 rounded-full text-[10px]">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="order"
                                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 h-9 border border-transparent data-[state=active]:border-primary/20"
                            >
                                Đơn hàng
                            </TabsTrigger>
                            <TabsTrigger
                                value="system"
                                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 h-9 border border-transparent data-[state=active]:border-primary/20"
                            >
                                Hệ thống
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                <SelectTrigger className="w-[160px] h-9 bg-background border-dashed shadow-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <span className="text-xs">Lọc:</span>
                                        <SelectValue placeholder="Chọn thời gian" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem value="all">Tất cả thời gian</SelectItem>
                                    <SelectItem value="today">Hôm nay</SelectItem>
                                    <SelectItem value="7days">7 ngày qua</SelectItem>
                                    <SelectItem value="30days">30 ngày qua</SelectItem>
                                </SelectContent>
                            </Select>

                            {notifications.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeleteAll}
                                    className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Xóa tất cả
                                </Button>
                            )}
                        </div>
                    </div>

                    <TabsContent value="all" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-medium">Tất cả thông báo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <NotificationList items={filteredNotifications} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="unread" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-medium">Thông báo chưa đọc</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <NotificationList items={filteredNotifications.filter(n => !n.isRead)} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="order" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-medium">Đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <NotificationList items={filteredNotifications.filter(n => n.type === "order")} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="system" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-medium">Hệ thống</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <NotificationList items={filteredNotifications.filter(n => n.type === "system")} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
