"use client";

import { ColumnDef } from "@tanstack/react-table";
import { News } from "@/lib/validations/news";
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
import { MoreHorizontal, Edit, Trash, Copy, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EditableStatusCell } from "@/components/admin/editable-status-cell";
import { format } from "date-fns";

const NEWS_STATUS_OPTIONS = [
    { value: "published", label: "Published", color: "bg-green-100 text-green-800 border-green-200" },
    { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800 border-gray-200" },
    { value: "archived", label: "Archived", color: "bg-red-100 text-red-800 border-red-200" },
];

export const columns: ColumnDef<News>[] = [
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
                <div className="relative h-16 w-24 overflow-hidden rounded-md border bg-gray-100 min-w-[96px]">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={row.getValue("title")}
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
        accessorKey: "title",
        header: "Tiêu đề",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col min-w-[250px] max-w-[400px]">
                    <span className="font-medium line-clamp-2" title={row.getValue("title")}>
                        {row.getValue("title")}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{row.original.slug}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Danh mục",
        cell: ({ row }) => <div className="min-w-[100px] font-medium text-gray-700">{row.getValue("category")}</div>,
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <EditableStatusCell
                    value={status}
                    options={NEWS_STATUS_OPTIONS}
                    onChange={(newVal) => console.log(newVal)} // Mock update
                    referenceText={row.original.title}
                />
            );
        },
    },
    {
        accessorKey: "publishedAt",
        header: "Ngày đăng",
        cell: ({ row }) => {
            const date = row.getValue("publishedAt") as string;
            if (!date) return <span className="text-gray-400 italic">Chưa đăng</span>;
            return (
                <div className="min-w-[100px]">
                    {format(new Date(date), "dd/MM/yyyy")}
                </div>
            );
        },
    },
    {
        accessorKey: "author",
        header: "Tác giả",
        cell: ({ row }) => <div className="min-w-[100px]">{row.getValue("author")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const news = row.original;

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
                            onClick={() => navigator.clipboard.writeText(news.slug || "")}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Sao chép Slug
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/news/${news.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Sửa
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/news/${news.slug}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                Xem trước
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
