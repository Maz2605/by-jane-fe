"use client";

import { DataTable } from "@/components/admin/orders/data-table";
import { columns } from "@/components/admin/orders/columns";
import { MOCK_ORDERS } from "@/lib/mock-data/orders";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/components/admin/editable-status-cell";
import Link from "next/link";

export default function OrdersPage() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Đơn hàng</h1>
                    <p className="text-sm text-muted-foreground mt-1">Quản lý danh sách đơn hàng của cửa hàng</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Xuất file
                    </Button>
                    <Link href="/admin/orders/create">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Tạo đơn hàng
                        </Button>
                    </Link>
                </div>
            </div>



            <DataTable
                columns={columns}
                data={MOCK_ORDERS}
                searchKey="id"
                searchPlaceholder="Tìm kiếm Mã đơn, Khách hàng..."
                onRowClick={(row) => router.push(`/admin/orders/${row.id}`)}
                enableDateFilter={true}
                facetedFilters={[
                    {
                        column: "status",
                        title: "Trạng thái đơn",
                        options: ORDER_STATUS_OPTIONS,
                    },
                    {
                        column: "paymentStatus",
                        title: "Thanh toán",
                        options: PAYMENT_STATUS_OPTIONS,
                    },
                ]}
            />
        </div>
    );
}
