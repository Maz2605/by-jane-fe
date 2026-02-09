"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/lib/mock-data/customers";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Mail, Phone, CheckCircle2, UserX } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditableStatusCell, CUSTOMER_STATUS_OPTIONS } from "@/components/admin/editable-status-cell";

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'active':
            return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        case 'blocked':
            return <UserX className="h-4 w-4 text-red-600" />;
        default:
            return null;
    }
};

export const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: "name",
        header: "Khách hàng",
        cell: ({ row }) => {
            const customer = row.original;
            return (
                <Link href={`/admin/customers/${customer.id}`} className="flex items-center gap-3 hover:bg-muted/50 p-1 rounded-md transition-colors group">
                    <Avatar>
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium group-hover:text-primary transition-colors">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.id}</span>
                    </div>
                </Link>
            );
        },
    },
    {
        id: "contact",
        accessorFn: (row) => `${row.email} ${row.phone}`,
        header: "Liên hệ",
        cell: ({ row }) => {
            const customer = row.original;
            return (
                <div className="flex flex-col text-sm">
                    <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{customer.phone}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "totalOrders",
        header: () => <div className="text-center">Số đơn hàng</div>,
        cell: ({ row }) => <div className="text-center font-medium">{row.getValue("totalOrders")}</div>,
    },
    {
        accessorKey: "rank",
        header: () => <div className="text-center">Hạng thành viên</div>,
        cell: ({ row }) => {
            const rank = row.getValue("rank") as string;
            let color = "bg-gray-100 text-gray-800";
            if (rank === "Gold") color = "bg-yellow-100 text-yellow-800 border-yellow-200";
            if (rank === "Platinum") color = "bg-cyan-100 text-cyan-800 border-cyan-200";
            if (rank === "Diamond") color = "bg-purple-100 text-purple-800 border-purple-200";
            if (rank === "Silver") color = "bg-slate-200 text-slate-700 border-slate-300";

            return (
                <div className="text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
                        {rank}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "totalSpent",
        header: () => <div className="text-center">Tổng chi tiêu</div>,
        cell: ({ row }) => <div className="text-center font-semibold">{formatCurrency(row.getValue("totalSpent"))}</div>,
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <EditableStatusCell
                    value={status}
                    options={CUSTOMER_STATUS_OPTIONS}
                    onChange={(newVal) => console.log(newVal)} // Mock update
                    referenceText={row.original.name}
                    iconRenderer={getStatusIcon}
                />
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const customer = row.original;

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
                            <Link href={`/admin/customers/${customer.id}`}>Xem chi tiết</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/customers/${customer.id}`}>Lịch sử mua hàng</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Chặn khách hàng</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
