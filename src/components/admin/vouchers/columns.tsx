"use client";

// ... imports
import { ColumnDef } from "@tanstack/react-table";
import { Voucher } from "@/lib/validations/voucher";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Copy, Ticket, Tag, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { EditableStatusCell } from "@/components/admin/editable-status-cell";
import { format } from "date-fns";
// Tooltip import removed

const VOUCHER_STATUS_OPTIONS = [
    { value: "active", label: "Đang hoạt động", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    { value: "expired", label: "Đã hết hạn", color: "bg-red-100 text-red-800 border-red-200" },
    { value: "disabled", label: "Vô hiệu hóa", color: "bg-gray-100 text-gray-800 border-gray-200" },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);
};

export const columns: ColumnDef<Voucher>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "code",
        header: "Voucher Code",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <div className="flex items-center gap-2 group">
                        <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-orange-500" />
                            <span className="font-bold text-gray-700 text-base tracking-wider">
                                {row.getValue("code")}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-orange-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(row.getValue("code"));
                            }}
                            title="Copy Code"
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium pl-1 line-clamp-1" title={row.original.description}>
                        {row.original.description}
                    </span>
                </div>
            );
        },
    },
    {
        id: "discount",
        header: "Giảm giá",
        cell: ({ row }) => {
            const voucher = row.original;
            return (
                <div className="flex flex-col gap-1.5 min-w-[140px]">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${voucher.discountType === 'percentage' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            <Tag className="h-4 w-4" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                            {voucher.discountType === "percentage" ? `${voucher.value}%` : formatCurrency(voucher.value)}
                        </span>
                    </div>

                    <div className="space-y-0.5">
                        {(voucher.minOrderValue ?? 0) > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                Min: <span className="font-medium text-gray-700">{formatCurrency(voucher.minOrderValue!)}</span>
                            </div>
                        )}
                        {(voucher.maxDiscountValue ?? 0) > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                Max: <span className="font-medium text-gray-700">{formatCurrency(voucher.maxDiscountValue!)}</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <EditableStatusCell
                    value={status}
                    options={VOUCHER_STATUS_OPTIONS}
                    onChange={(newVal) => console.log(newVal)}
                    referenceText={row.original.code}
                />
            );
        },
    },
    {
        id: "usage",
        header: "Tiến độ sử dụng",
        cell: ({ row }) => {
            const voucher = row.original;
            const percentage = voucher.usageLimit ? Math.round((voucher.usedCount / voucher.usageLimit) * 100) : 0;

            // Color logic based on percentage
            let progressColor = "bg-green-500";
            if (percentage > 75) progressColor = "bg-orange-500";
            if (percentage >= 100) progressColor = "bg-red-500";
            if (!voucher.usageLimit) progressColor = "bg-blue-500";

            return (
                <div className="min-w-[140px] space-y-2">
                    <div className="flex justify-between items-end text-xs">
                        <span className="font-semibold text-gray-700">
                            {voucher.usedCount}
                        </span>
                        <span className="text-muted-foreground">
                            {voucher.usageLimit ? `/ ${voucher.usageLimit}` : "Không giới hạn"}
                        </span>
                    </div>

                    {voucher.usageLimit ? (
                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        </div>
                    ) : (
                        <div className="h-2.5 w-full bg-blue-50 rounded-full overflow-hidden border border-blue-100 flex">
                            <div className="w-full h-full bg-blue-200/50 animate-pulse"></div>
                        </div>
                    )}

                    <div className="text-[10px] text-right text-muted-foreground font-medium">
                        {voucher.usageLimit ? `${percentage}% đã dùng` : "Đang hoạt động"}
                    </div>
                </div>
            );
        },
    },
    {
        id: "validity",
        header: "Thời hạn hiệu lực",
        cell: ({ row }) => {
            const voucher = row.original;
            const startDate = new Date(voucher.startDate);
            const endDate = new Date(voucher.endDate);
            const now = new Date();

            const isExpired = now > endDate;
            const isUpcoming = now < startDate;

            return (
                <div className="flex flex-col min-w-[140px] gap-1">
                    <div className={`flex items-center gap-2 text-sm ${isUpcoming ? 'text-amber-600 font-medium' : 'text-gray-600'}`}>
                        <span className="w-14 text-xs text-muted-foreground">Bắt đầu:</span>
                        {format(startDate, "dd/MM/yyyy")}
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isExpired ? 'text-red-600 font-medium' : 'text-gray-800 font-medium'}`}>
                        <span className="w-14 text-xs text-muted-foreground">Kết thúc:</span>
                        {format(endDate, "dd/MM/yyyy")}
                    </div>

                    {isExpired && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-fit mt-1">
                            <AlertCircle className="h-3 w-3" /> Đã kết thúc
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const voucher = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(voucher.code)}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Sao chép Mã
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/vouchers/${voucher.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Sửa
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Xóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
