"use client";

import { DataTable } from "@/components/admin/orders/data-table"; // Reuse generic table
import { columns } from "@/components/admin/customers/columns";
import { MOCK_CUSTOMERS } from "@/lib/mock-data/customers";
import { CustomerStats } from "@/components/admin/customers/customer-stats";
import { Button } from "@/components/ui/button";
import { Download, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CUSTOMER_STATUS_OPTIONS } from "@/components/admin/editable-status-cell";

export default function CustomersPage() {
    const router = useRouter();
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Khách hàng</h1>
                    <p className="text-sm text-muted-foreground mt-1">Quản lý thông tin khách hàng thân thiết</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Xuất file
                    </Button>
                    <Button variant="orange" onClick={() => router.push('/admin/customers/new')}>
                        <UserPlus className="mr-2 h-4 w-4" /> Thêm khách hàng
                    </Button>
                </div>
            </div>


            <DataTable
                columns={columns}
                data={MOCK_CUSTOMERS}
                searchKey="name"
                searchPlaceholder="Tìm kiếm Tên, Email, SĐT..."
                onRowClick={(row) => router.push(`/admin/customers/${row.id}`)}
                facetedFilters={[
                    {
                        column: "status",
                        title: "Trạng thái",
                        options: CUSTOMER_STATUS_OPTIONS,
                    },
                ]}
            />
        </div>
    );
}
