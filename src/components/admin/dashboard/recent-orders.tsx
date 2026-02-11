"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";

interface Order {
    id: string | number;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

interface RecentOrdersProps {
    orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    // Helper functions removed in favor of OrderStatusBadge

    return (
        <Card className="col-span-3 flex flex-col">
            <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
                <CardDescription>
                    Bạn có {orders.length} đơn hàng mới trong tháng này.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <div className="h-[350px] overflow-y-auto px-6 pb-6 space-y-6">
                    {orders.map((order) => (
                        <Link
                            href={`/admin/orders/${order.id}`}
                            key={order.id}
                            className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-lg transition-colors -mx-2"
                        >
                            <div className="flex items-center gap-4">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.customerName}`} alt="Avatar" />
                                    <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                        {order.customerName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.customerEmail}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <div className="font-medium text-sm">{formatCurrency(order.totalAmount)}</div>
                                <OrderStatusBadge status={order.status} className="text-[10px] px-2 py-0.5 h-auto text-nowrap" />
                            </div>
                        </Link>
                    ))}

                    {orders.length === 0 && (
                        <div className="text-center text-sm text-gray-500 py-4">Chưa có đơn hàng nào</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
