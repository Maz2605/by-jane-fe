"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save, Trash, AlertCircle, Clock, User, BarChart } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ToastNotification from "@/components/ui/ToastNotification";
import { MOCK_VOUCHERS } from "@/lib/mock-data/vouchers";

const formSchema = z.object({
    code: z.string().min(3, "Mã voucher phải có ít nhất 3 ký tự").toUpperCase(),
    description: z.string().optional(),
    discountType: z.enum(["percentage", "fixed"]),
    value: z.coerce.number().min(0, "Giá trị phải lớn hơn 0"),
    minOrderValue: z.coerce.number().min(0).default(0),
    maxDiscountValue: z.coerce.number().min(0).optional(),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Ngày bắt đầu không hợp lệ"),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Ngày kết thúc không hợp lệ"),
    usageLimit: z.number().min(1).nullable().optional(),
    status: z.enum(["active", "disabled", "expired"]),
});

export default function EditVoucherPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    // Find voucher item
    const voucherItem = MOCK_VOUCHERS.find(item => item.id === id);

    const [toastState, setToastState] = useState<{
        isOpen: boolean;
        message: string;
        type: 'success' | 'error' | 'warning';
    }>({
        isOpen: false,
        message: '',
        type: 'success',
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            description: "",
            discountType: "percentage",
            value: 0,
            minOrderValue: 0,
            maxDiscountValue: 0,
            startDate: new Date().toISOString().slice(0, 16),
            endDate: new Date().toISOString().slice(0, 16),
            usageLimit: 100,
            status: "active",
        },
    });

    const discountType = form.watch("discountType");

    useEffect(() => {
        if (voucherItem) {
            form.reset({
                code: voucherItem.code,
                description: voucherItem.description,
                discountType: voucherItem.discountType,
                value: voucherItem.value,
                minOrderValue: voucherItem.minOrderValue || 0,
                maxDiscountValue: voucherItem.maxDiscountValue || 0,
                startDate: new Date(voucherItem.startDate).toISOString().slice(0, 16),
                endDate: new Date(voucherItem.endDate).toISOString().slice(0, 16),
                usageLimit: voucherItem.usageLimit,
                status: voucherItem.status as any,
            });
        }
    }, [voucherItem, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Updating voucher:", { id, ...values });
        setToastState({
            isOpen: true,
            message: "Cập nhật voucher thành công!",
            type: "success"
        });
        setTimeout(() => {
            router.push("/admin/vouchers");
        }, 1000);
    }

    if (!voucherItem) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-2xl font-bold">Không tìm thấy voucher</h2>
                <Link href="/admin/vouchers">
                    <Button variant="outline"> <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách</Button>
                </Link>
            </div>
        );
    }

    const percentageUsed = voucherItem.usageLimit
        ? Math.round((voucherItem.usedCount / voucherItem.usageLimit) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/vouchers">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Chi tiết mã giảm giá</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            ID: {id}
                        </p>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle>Thông tin chi tiết</CardTitle>
                                {/* Mini Dashboard inside the card */}
                                <div className="flex items-center gap-4 text-sm bg-white px-4 py-2 rounded-lg border shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <BarChart className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Đã sử dụng:</span>
                                        <span className="font-bold">{voucherItem.usedCount}</span>
                                        {voucherItem.usageLimit && (
                                            <span className="text-muted-foreground">/ {voucherItem.usageLimit}</span>
                                        )}
                                    </div>
                                    {voucherItem.usageLimit && (
                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${percentageUsed <= 50
                                                    ? "bg-green-500"
                                                    : percentageUsed <= 70
                                                        ? "bg-yellow-500"
                                                        : "bg-gradient-to-r from-yellow-500 to-red-600"
                                                    }`}
                                                style={{ width: `${percentageUsed}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">
                            {/* Block 1: Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mã voucher</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="VD: SUMMER2024"
                                                    className="uppercase font-mono font-bold tracking-wider h-9 text-sm"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Trạng thái</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-9 text-sm">
                                                        <SelectValue placeholder="Chọn trạng thái" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">Hoạt động</SelectItem>
                                                    <SelectItem value="disabled">Vô hiệu hóa</SelectItem>
                                                    <SelectItem value="expired">Đã hết hạn</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mô tả</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Mô tả chi tiết về chương trình khuyến mãi này..."
                                                        className="resize-none text-sm"
                                                        rows={3}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                                    <div className="h-5 w-1 bg-orange-500 rounded-full"></div>
                                    Cấu hình giảm giá
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="discountType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Loại giảm giá</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-9 text-sm">
                                                            <SelectValue placeholder="Chọn loại giảm giá" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="percentage">Theo phần trăm (%)</SelectItem>
                                                        <SelectItem value="fixed">Số tiền cố định (VND)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="value"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giá trị giảm {discountType === "percentage" ? "(%)" : "(VND)"}</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" className="h-9 text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="minOrderValue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Đơn tối thiểu</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" placeholder="0" className="h-9 text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {discountType === "percentage" && (
                                        <FormField
                                            control={form.control}
                                            name="maxDiscountValue"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Giảm tối đa</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min="0" placeholder="0" className="h-9 text-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                                    <div className="h-5 w-1 bg-orange-500 rounded-full"></div>
                                    Thời gian & Giới hạn
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày bắt đầu</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type="datetime-local" {...field} className="pl-9 h-9 text-sm" />
                                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày kết thúc</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type="datetime-local" {...field} className="pl-9 h-9 text-sm" />
                                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="usageLimit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between">
                                                    <FormLabel className="mt-0">Giới hạn lượt dùng</FormLabel>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            id="unlimited"
                                                            className="data-[state=checked]:bg-orange-500 scale-90"
                                                            checked={field.value === null || field.value === undefined}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    field.onChange(null);
                                                                } else {
                                                                    field.onChange(100);
                                                                }
                                                            }}
                                                        />
                                                        <Label
                                                            htmlFor="unlimited"
                                                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-muted-foreground"
                                                        >
                                                            Không giới hạn
                                                        </Label>
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            placeholder={field.value === null || field.value === undefined ? "Không giới hạn" : "Nhập số lượng"}
                                                            className="pl-9 h-9 text-sm"
                                                            value={field.value ?? ""}
                                                            disabled={field.value === null || field.value === undefined}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val === "") {
                                                                    field.onChange(null);
                                                                } else {
                                                                    field.onChange(parseInt(val));
                                                                }
                                                            }}
                                                        />
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 border-t flex items-center justify-between mt-6">
                                <div className="text-xs text-muted-foreground flex gap-4">
                                    {voucherItem && (
                                        <>
                                            <span>
                                                Tạo: <span className="font-medium text-foreground">{new Date(voucherItem.createdAt).toLocaleDateString("vi-VN")}</span>
                                            </span>
                                            <span className="text-gray-300">|</span>
                                            <span>
                                                Cập nhật: <span className="font-medium text-foreground">{new Date(voucherItem.updatedAt).toLocaleDateString("vi-VN")}</span>
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9 text-sm" type="button">
                                        <Trash className="mr-2 h-3.5 w-3.5" /> Xóa
                                    </Button>
                                    <Button type="submit" variant="orange" className="pl-6 pr-6 h-9 text-sm">
                                        <Save className="mr-2 h-3.5 w-3.5" /> Lưu thay đổi
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>

            <ToastNotification
                isOpen={toastState.isOpen}
                onClose={() => setToastState(prev => ({ ...prev, isOpen: false }))}
                message={toastState.message}
                type={toastState.type}
            />
        </div>
    );
}
