"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/lib/mock-data/orders";
import { formatCurrency } from "@/lib/utils";
import { EditableStatusCell, ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/components/admin/editable-status-cell";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "id",
        header: "Mã đơn hàng",
        cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
        id: "customer_info",
        accessorFn: (row) => `${row.customer.name} ${row.customer.email} ${row.customer.phone} ${row.customer.id}`,
        header: "Khách hàng",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.customer.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.customer.email}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "shippingAddress",
        header: "Địa chỉ",
        cell: ({ row }) => <span className="text-sm text-muted-foreground truncate max-w-[200px] block" title={row.getValue("shippingAddress")}>{row.getValue("shippingAddress")}</span>,
    },
    {
        accessorKey: "createdAt",
        header: "Ngày đặt",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return <span>{date.toLocaleDateString("vi-VN")}</span>;
        },
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("status")
            return (
                <EditableStatusCell
                    value={status}
                    options={ORDER_STATUS_OPTIONS}
                    onChange={(newVal) => console.log(newVal)} // Mock update
                    referenceText={`Đơn hàng #${row.original.id}`}
                />
            );
        },
    },
    {
        accessorKey: "paymentStatus",
        header: "Thanh toán",
        cell: ({ row }) => {
            const status = row.getValue("paymentStatus") as string;
            return (
                <EditableStatusCell
                    value={status}
                    options={PAYMENT_STATUS_OPTIONS}
                    onChange={(newVal) => console.log(newVal)} // Mock update
                />
            );
        },
    },
    {
        accessorKey: "totalAmount",
        header: () => <div className="text-center">Tổng tiền</div>,
        cell: ({ row }) => <div className="text-center font-bold">{formatCurrency(row.getValue("totalAmount"))}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order.id}`} className="flex items-center cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Cập nhật trạng thái</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
