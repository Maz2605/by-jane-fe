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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, ImagePlus, Trash, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import ImageCropper from "@/components/ui/ImageCropper";
import ToastNotification from "@/components/ui/ToastNotification";

const formSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(10, "Số điện thoại không hợp lệ"),
    address: z.string().optional(),
    avatar: z.string().optional(),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    rank: z.string().default("Bronze"),
    status: z.string().default("active"),
});

export default function AddCustomerPage() {
    const router = useRouter();
    const [imageLoading, setImageLoading] = useState(false);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [croppedAvatar, setCroppedAvatar] = useState<string | null>(null);
    const [toastState, setToastState] = useState<{
        isOpen: boolean;
        message: string;
        type: 'success' | 'error' | 'warning';
    }>({
        isOpen: false,
        message: '',
        type: 'success',
    });

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setCropImage(url);
        }
    };

    const onCropComplete = (croppedBlob: Blob) => {
        const url = URL.createObjectURL(croppedBlob);
        setCroppedAvatar(url);
        form.setValue("avatar", url); // In real app, you'd upload blob here and get URL
        setCropImage(null);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            avatar: "",
            password: "",
            rank: "Bronze",
            status: "active",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Here you would typically make an API call to save the customer
        console.log(values);
        setToastState({
            isOpen: true,
            message: "Thêm khách hàng thành công!",
            type: "success"
        });
        setTimeout(() => {
            router.push("/admin/customers");
        }, 1000);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/customers">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Thêm khách hàng mới</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Nhập thông tin chi tiết để tạo khách hàng mới
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Thông tin cơ bản</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tên khách hàng</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nguyễn Văn A" className="h-12 text-base" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="example@gmail.com" className="h-12 text-base" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Số điện thoại</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0901234567" className="h-12 text-base" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mật khẩu</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="******" className="h-12 text-base" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Địa chỉ</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Số 123, Đường ABC, Phường XYZ..."
                                                        className="resize-none text-base p-4"
                                                        rows={6}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ảnh đại diện</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="avatar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex flex-col items-center gap-4">
                                                        {field.value ? (
                                                            <div className="relative h-40 w-40 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                                                                <Image
                                                                    src={field.value}
                                                                    alt="Avatar"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        field.onChange("");
                                                                        setCroppedAvatar(null);
                                                                    }}
                                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash className="h-6 w-6 text-white" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="h-40 w-40 rounded-full border-2 border-dashed flex flex-col items-center justify-center bg-gray-50 text-muted-foreground hover:bg-gray-100 transition-colors relative cursor-pointer gap-2">
                                                                {imageLoading ? (
                                                                    <Loader2 className="h-8 w-8 animate-spin" />
                                                                ) : (
                                                                    <ImagePlus className="h-8 w-8" />
                                                                )}
                                                                <span className="text-sm font-medium">Tải ảnh lên</span>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                    disabled={imageLoading}
                                                                    onChange={onFileChange}
                                                                />
                                                            </div>
                                                        )}
                                                        {cropImage && (
                                                            <ImageCropper
                                                                image={cropImage}
                                                                onCropComplete={onCropComplete}
                                                                onCancel={() => setCropImage(null)}
                                                            />
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-center" />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Trạng thái</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Trạng thái hoạt động</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="active">Hoạt động</SelectItem>
                                                        <SelectItem value="blocked">Bị chặn</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="rank"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hạng thành viên</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn hạng" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Bronze">Bronze (Đồng)</SelectItem>
                                                        <SelectItem value="Silver">Silver (Bạc)</SelectItem>
                                                        <SelectItem value="Gold">Gold (Vàng)</SelectItem>
                                                        <SelectItem value="Platinum">Platinum (Bạch kim)</SelectItem>
                                                        <SelectItem value="Diamond">Diamond (Kim cương)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" variant="orange">
                            <Save className="mr-2 h-4 w-4" /> Lưu khách hàng
                        </Button>
                    </div>
                </form>
            </Form>

            <ToastNotification
                isOpen={toastState.isOpen}
                onClose={() => setToastState(prev => ({ ...prev, isOpen: false }))}
                message={toastState.message}
                type={toastState.type}
            />
        </div >
    );
}
