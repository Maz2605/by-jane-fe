"use client";

import { DataTable } from "@/components/admin/news/data-table";
import { columns } from "@/components/admin/news/columns";
import { MOCK_NEWS } from "@/lib/mock-data/news";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewsPage() {
    const router = useRouter();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tin tức</h1>
                    <p className="text-muted-foreground mt-1">Quản lý các bài viết tin tức và blog.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/news/new">
                        <Button variant="orange">
                            <Plus className="mr-2 h-4 w-4" /> Thêm bài viết
                        </Button>
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={MOCK_NEWS}
                onRowClick={(row) => router.push(`/admin/news/${row.id}`)}
            />
        </div>
    );
}
