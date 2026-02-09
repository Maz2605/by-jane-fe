"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import { useRouter } from "next/navigation";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey?: string;
    searchPlaceholder?: string;
    onRowClick?: (row: TData) => void;
    facetedFilters?: {
        column: string;
        title: string;
        options: { label: string; value: string; color?: string }[];
    }[];
    enableDateFilter?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey = "id",
    searchPlaceholder = "Tìm kiếm...",
    onRowClick,
    facetedFilters,
    enableDateFilter,
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [date, setDate] = useState<string | undefined>();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
            globalFilter,
        },
    });

    // Date Filter Logic
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDate(val);
        if (val) {
            table.getColumn("createdAt")?.setFilterValue(val);
        } else {
            table.getColumn("createdAt")?.setFilterValue(undefined);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 py-4 bg-white p-4 rounded-xl border shadow-sm">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {facetedFilters?.map((filter) => (
                        table.getColumn(filter.column) && (
                            <DataTableFacetedFilter
                                key={filter.column}
                                column={table.getColumn(filter.column)}
                                title={filter.title}
                                options={filter.options}
                            />
                        )
                    ))}

                    {enableDateFilter && (
                        <Input
                            type="date"
                            value={date || ""}
                            onChange={handleDateChange}
                            className="w-[150px] sm:w-[180px]"
                        />
                    )}

                    {(columnFilters.length > 0 || globalFilter || date) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setColumnFilters([]);
                                setGlobalFilter("");
                                setDate(undefined);
                                table.resetColumnFilters();
                                table.resetGlobalFilter();
                            }}
                            className="h-8 px-2 lg:px-3"
                        >
                            Xóa lọc
                            <Search className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="font-semibold text-gray-700">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={`hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
                                    onClick={() => onRowClick && onRowClick(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có kết quả.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
