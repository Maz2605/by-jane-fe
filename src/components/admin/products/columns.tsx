"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/lib/validations/product";
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
import { MoreHorizontal, Edit, Trash, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EditableStatusCell } from "@/components/admin/editable-status-cell";

const PRODUCT_STATUS_OPTIONS = [
    { value: "active", label: "Active", color: "bg-orange-100 text-orange-800 border-orange-200" },
    { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800 border-gray-200" },
    { value: "archived", label: "Archived", color: "bg-red-100 text-red-800 border-red-200" },
];

export const columns: ColumnDef<Product>[] = [
    {
        id: "select",
        header: ({ table }) => {
            const isAnySelected = table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected();
            const toggleSelectAll = () => table.toggleAllPageRowsSelected(!isAnySelected);

            return (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "thumbnail",
        header: "Hình ảnh",
        cell: ({ row }) => {
            const thumbnail = row.getValue("thumbnail") as string;
            return (
                <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-gray-100 min-w-[64px]">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={row.getValue("name")}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No Img
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        id: "name",
        accessorFn: (row) => `${row.name} ${row.sku}`,
        header: "Tên sản phẩm",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col min-w-[200px] max-w-[300px]">
                    <span className="font-medium truncate" title={row.original.name}>
                        {row.original.name}
                    </span>
                    {row.original.sku && (
                        <span className="text-xs text-muted-foreground">SKU: {row.original.sku}</span>
                    )}
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
                    options={PRODUCT_STATUS_OPTIONS}
                    onChange={(newVal) => console.log(newVal)} // Mock update
                    referenceText={row.original.name}
                />
            );
        },
    },
    {
        accessorKey: "stock",
        header: "Kho hàng",
        cell: ({ row }) => {
            const stock = row.getValue("stock") as number;
            return (
                <div className={`w-[120px] ${stock === 0 ? "text-red-500 font-bold" : ""}`}>
                    {stock} sản phẩm
                </div>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Danh mục",
        cell: ({ row }) => <div className="min-w-[120px]">{row.getValue("category")}</div>,
    },
    {
        accessorKey: "price",
        header: "Giá",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(price);

            return <div className="font-medium min-w-[100px]">{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;

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
                            onClick={() => navigator.clipboard.writeText(product.id || "")}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Sao chép ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>
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
