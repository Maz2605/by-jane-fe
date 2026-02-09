"use client";

import { DataTable } from "@/components/admin/vouchers/data-table";
import { columns } from "@/components/admin/vouchers/columns";
import { MOCK_VOUCHERS } from "@/lib/mock-data/vouchers";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VouchersPage() {
    const router = useRouter();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mã giảm giá</h1>
                    <p className="text-muted-foreground mt-1">Quản lý mã giảm giá và chương trình khuyến mãi.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/vouchers/new">
                        <Button variant="orange">
                            <Plus className="mr-2 h-4 w-4" /> Thêm voucher
                        </Button>
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={MOCK_VOUCHERS}
                onRowClick={(row) => router.push(`/admin/vouchers/${row.id}`)}
            />
        </div>
    );
}
