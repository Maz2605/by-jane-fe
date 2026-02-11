"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardStatsProps {
    totalRevenue: number;
    totalOrders: number;
    lowStockProducts: number;
    newCustomers: number;
}

export function DashboardStats({
    totalRevenue,
    totalOrders,
    lowStockProducts,
    newCustomers,
}: DashboardStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className="text-green-600 flex items-center mr-1 bg-green-100 px-1 rounded">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            20.1%
                        </span>
                        so với tháng trước
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đơn hàng mới</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{totalOrders}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className="text-green-600 flex items-center mr-1 bg-green-100 px-1 rounded">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            180
                        </span>
                        so với tuần trước
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sản phẩm tồn kho thấp</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{lowStockProducts}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className="text-red-600 flex items-center mr-1 bg-red-100 px-1 rounded">
                            <ArrowDownRight className="h-3 w-3 mr-0.5" />
                            Cần nhập
                        </span>
                        sản phẩm
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{newCustomers}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className="text-green-600 flex items-center mr-1 bg-green-100 px-1 rounded">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            4
                        </span>
                        so với hôm qua
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
