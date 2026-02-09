import { Table } from "@tanstack/react-table";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();

    // Helper to generate page numbers (Max 3 visible)
    const getPageNumbers = () => {
        const totalPages = pageCount;
        const currentPage = pageIndex + 1;
        const pageNumbers: (number | string)[] = [];

        // Nếu tổng số trang ít (<= 3), hiện tất cả
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
            return pageNumbers;
        }

        // Logic hiển thị tối đa 3 số: [Trang trước] [Hiện tại] [Trang sau]
        // Xử lý các trường hợp biên (đầu/cuối)
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        // Điều chỉnh nếu ở đầu (1, 2, 3)
        if (currentPage === 1) {
            endPage = Math.min(3, totalPages);
        }

        // Điều chỉnh nếu ở cuối (Total-2, Total-1, Total)
        if (currentPage === totalPages) {
            startPage = Math.max(1, totalPages - 2);
        }

        // Thêm dấu ... ở đầu nếu cần (nếu start > 1)
        if (startPage > 1) {
            pageNumbers.push(1);
            if (startPage > 2) pageNumbers.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
            // Tránh duplicate nếu đã push 1 ở trên
            if (i === 1 && pageNumbers.includes(1)) continue;
            pageNumbers.push(i);
        }

        // Thêm dấu ... ở cuối nếu cần (nếu end < total)
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbers.push("...");
            pageNumbers.push(totalPages);
        }

        // RE-EVALUATE: User wanted "Max 3 numbers visible at once" strictly?
        // Let's simplify to standard "compact" view which behaves like:
        // [1] ... [4] [5] [6] ... [10] -> This is 5 numbers.
        // If strict "Max 3 numbers":
        // Maybe just [4] [5] [6] (centered)? 
        // Let's try a very compact logic: Always show 3 numbers centered on current, plus ellipses/first/last only if very far?
        // I will implement: 
        // Always show [Current-1] [Current] [Current+1] (clamped to bounds).
        // Uses Ellipsis to bridge to First/Last if requested, BUT user said "max 3 numbers".
        // Let's stick to logic: [Current-1, Current, Current+1].
        // And relying on Input/Arrows for far jumps.

        const strictPageNumbers: (number | string)[] = [];
        let s = Math.max(1, currentPage - 1);
        let e = Math.min(totalPages, currentPage + 1);

        if (currentPage === 1) e = Math.min(3, totalPages);
        if (currentPage === totalPages) s = Math.max(1, totalPages - 2);

        for (let i = s; i <= e; i++) {
            strictPageNumbers.push(i);
        }

        // Add ellipses merely as indicators if there are more pages, NOT as buttons?
        // Or buttons?
        // Let's stick to the 3-button window.

        return strictPageNumbers;
    };

    return (
        <div className="flex items-center justify-between px-2">
            {/* Left side: Selected count (keep) */}
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} trong số{" "}
                {table.getFilteredRowModel().rows.length} hàng được chọn.
            </div>

            {/* Right side: Controls */}
            <div className="flex items-center space-x-6 lg:space-x-8">
                {/* Rows per page */}
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Hàng mỗi trang</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Page Navigation Buttons */}
                <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Trang trước</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) => (
                        <Button
                            key={index}
                            variant={pageIndex + 1 === page ? "default" : "outline"}
                            className={cn(
                                "h-8 w-8 p-0 rounded-md transition-all duration-200", // Square-ish with rounded corners
                                pageIndex + 1 === page
                                    ? "bg-[#FF5E4D] text-white hover:bg-[#FF5E4D]/90 border-[#FF5E4D]" // Active Orange
                                    : "hover:bg-gray-100"
                            )}
                            onClick={() => table.setPageIndex(Number(page) - 1)}
                        >
                            {page}
                        </Button>
                    ))}

                    {/* Next Button */}
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Trang sau</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Go to Page Input */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium whitespace-nowrap">Đến trang</span>
                    <Input
                        type="number"
                        min={1}
                        max={pageCount}
                        className="h-8 w-16 text-center"
                        placeholder="#"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const target = e.currentTarget as HTMLInputElement;
                                const page = Number(target.value);

                                if (isNaN(page) || page < 1 || page > pageCount) {
                                    toast.error(`Trang không hợp lệ! Vui lòng nhập từ 1 đến ${pageCount}`, {
                                        style: {
                                            border: '1px solid #F87171',
                                            padding: '8px',
                                            color: '#B91C1C',
                                            background: '#FEF2F2',
                                        },
                                        iconTheme: {
                                            primary: '#EF4444',
                                            secondary: '#FFFAEE',
                                        },
                                    });
                                    return;
                                }

                                table.setPageIndex(page - 1);
                                target.value = ""; // Clear after jump
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
