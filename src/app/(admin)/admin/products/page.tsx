import { DataTable } from "@/components/admin/products/data-table";
import { columns } from "@/components/admin/products/columns";
import { MOCK_PRODUCTS } from "@/lib/mock-data/products";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Xuất file</Button>
                    <Link href="/admin/products/create">
                        <Button variant="orange">
                            <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
                        </Button>
                    </Link>
                </div>
            </div>

            <DataTable columns={columns} data={MOCK_PRODUCTS} />
        </div>
    );
}
