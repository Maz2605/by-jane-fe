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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save, ImagePlus, Trash, Loader2, Eye, User, Clock, ChevronLeft, Tag, Maximize2, Minimize2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import ImageCropper from "@/components/ui/ImageCropper";
import ToastNotification from "@/components/ui/ToastNotification";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

const formSchema = z.object({
    title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
    slug: z.string().min(5, "Slug phải có ít nhất 5 ký tự"),
    category: z.string().min(1, "Vui lòng chọn danh mục"),
    content: z.string().optional(),
    thumbnail: z.string().optional(),
    author: z.string().min(1, "Vui lòng nhập tên tác giả"),
    status: z.enum(["published", "draft", "archived"]),
});

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

export default function AddNewsPage() {
    const router = useRouter();
    const [imageLoading, setImageLoading] = useState(false);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [croppedThumbnail, setCroppedThumbnail] = useState<string | null>(null);
    const [toastState, setToastState] = useState<{
        isOpen: boolean;
        message: string;
        type: 'success' | 'error' | 'warning';
    }>({
        isOpen: false,
        message: '',
        type: 'success',
    });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            slug: "",
            category: "",
            content: "",
            thumbnail: "",
            author: "Admin",
            status: "draft",
        },
    });

    // Auto-generate slug from title
    const title = form.watch("title");
    useEffect(() => {
        if (title) {
            const slug = slugify(title);
            form.setValue("slug", slug, { shouldValidate: true });
        }
    }, [title, form]);

    const watchedValues = form.watch();

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setCropImage(url);
        }
    };

    const onCropComplete = (croppedBlob: Blob) => {
        const url = URL.createObjectURL(croppedBlob);
        setCroppedThumbnail(url);
        form.setValue("thumbnail", url);
        setCropImage(null);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Creating news:", values);
        setToastState({
            isOpen: true,
            message: "Tạo bài viết mới thành công!",
            type: "success"
        });
        setTimeout(() => {
            router.push("/admin/news");
        }, 1000);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/news">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Thêm bài viết mới</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Tạo bài viết tin tức, blog hoặc thông báo mới.
                        </p>
                    </div>
                </div>

                {/* Preview Dialog */}
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Eye className="h-4 w-4" /> Xem trước
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={`${isFullScreen ? '!fixed !inset-0 !z-[100] !max-w-none !w-screen !h-screen !p-0 !m-0 !rounded-none !border-none !translate-x-0 !translate-y-0' : 'w-[98vw] h-[98vh] max-w-none rounded-lg'} flex flex-col p-0 overflow-hidden bg-white transition-all duration-200`}>
                        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0 bg-white z-10 shrink-0">
                            <DialogTitle>Xem trước bài viết</DialogTitle>
                            <div className="flex items-center gap-2 mr-8">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setIsFullScreen(!isFullScreen)}
                                >
                                    {isFullScreen ? (
                                        <>
                                            <Minimize2 className="h-4 w-4" /> Thu nhỏ
                                        </>
                                    ) : (
                                        <>
                                            <Maximize2 className="h-4 w-4" /> Toàn màn hình
                                        </>
                                    )}
                                </Button>
                            </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto p-0 bg-white">
                            {/* PREVIEW CONTENT MATCHING SHOP PAGE LAYOUT */}
                            <div className="flex flex-col min-h-full">
                                {/* HERO IMAGE */}
                                <div className="relative w-full h-[50vh] md:h-[60vh] shrink-0">
                                    {watchedValues.thumbnail ? (
                                        <Image
                                            src={watchedValues.thumbnail}
                                            alt={watchedValues.title || "Cover Image"}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700 font-bold">No Cover Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                                        <div className="container mx-auto max-w-6xl">
                                            <div className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] mb-6 font-bold cursor-default">
                                                <ChevronLeft size={16} /> Back to Journal
                                            </div>

                                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-8 max-w-5xl shadow-sm">
                                                {watchedValues.title || "Tiêu đề bài viết"}
                                            </h1>

                                            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold opacity-90">
                                                <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                                    <User size={16} /> {watchedValues.author || "Admin"}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Clock size={16} /> {format(new Date(), "dd/MM/yyyy")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* MAIN LAYOUT */}
                                <div className="container mx-auto px-4 py-16 max-w-6xl">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                                        {/* CỘT TRÁI */}
                                        <div className="lg:col-span-8">

                                            {/* SAPO (Using category as stand-in) */}
                                            {watchedValues.category && (
                                                <div className="text-lg md:text-xl font-semibold text-gray-700 mb-10 border-l-4 border-red-600 pl-6 leading-relaxed bg-gray-50 py-6 rounded-r-lg">
                                                    Danh mục: {watchedValues.category}
                                                </div>
                                            )}

                                            {/* NỘI DUNG CHÍNH */}
                                            <article className="prose prose-lg max-w-none 
                                                prose-headings:font-extrabold prose-headings:text-gray-900 
                                                prose-p:font-medium prose-p:text-gray-700 prose-p:leading-8
                                                prose-img:rounded-xl prose-a:text-red-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline">
                                                {watchedValues.content ? (
                                                    <div className="whitespace-pre-wrap">{watchedValues.content}</div>
                                                ) : (
                                                    <p className="text-gray-400 font-medium bg-gray-50 p-4 rounded text-center">Nội dung bài viết đang được cập nhật...</p>
                                                )}
                                            </article>

                                            {/* FOOTER BÀI VIẾT MOCK */}
                                            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap justify-between items-center gap-4">
                                                <div className="flex gap-2 text-sm font-bold text-gray-600 items-center">
                                                    <Tag size={18} className="text-red-600" /> Fashion, Trends, 2025
                                                </div>

                                                <div className="flex gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-blue-600"></div>
                                                    <div className="h-8 w-8 rounded-full bg-blue-400"></div>
                                                    <div className="h-8 w-8 rounded-full bg-gray-800"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CỘT PHẢI */}
                                        <aside className="lg:col-span-4 space-y-10">
                                            <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100">
                                                <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 overflow-hidden relative border-2 border-gray-100 shadow-sm flex items-center justify-center">
                                                    <span className="text-3xl font-extrabold text-gray-300">
                                                        {(watchedValues.author || "A").charAt(0)}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-2">Written By</p>
                                                <h4 className="text-xl font-extrabold text-gray-900">{watchedValues.author || "Admin"}</h4>
                                                <p className="text-sm font-semibold text-gray-500 mt-2">Fashion Editor & Stylist</p>
                                            </div>
                                        </aside>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 z-10 shrink-0">
                            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                                Đóng Preview
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nội dung bài viết</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tiêu đề</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập tiêu đề bài viết" className="text-lg font-medium" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug (Đường dẫn)</FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-2">
                                                        <Input placeholder="tieu-de-bai-viet" {...field} />
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() => form.setValue("slug", slugify(form.getValues("title")))}
                                                        >
                                                            Tạo lại
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    Đường dẫn URL của bài viết (tự động tạo từ tiêu đề).
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nội dung</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Nhập nội dung bài viết..."
                                                        className="min-h-[300px] resize-y p-4"
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
                                    <CardTitle>Thông tin chung</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Trạng thái</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Bản nháp (Draft)</SelectItem>
                                                        <SelectItem value="published">Công khai (Published)</SelectItem>
                                                        <SelectItem value="archived">Lưu trữ (Archived)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Danh mục</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn danh mục" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Thời trang">Thời trang</SelectItem>
                                                        <SelectItem value="Khuyến mãi">Khuyến mãi</SelectItem>
                                                        <SelectItem value="Bộ sưu tập">Bộ sưu tập</SelectItem>
                                                        <SelectItem value="Tips & Tricks">Tips & Tricks</SelectItem>
                                                        <SelectItem value="Thông báo">Thông báo</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="author"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tác giả</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Tên tác giả" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Hình ảnh thu nhỏ</CardTitle>
                                    <CardDescription>Ảnh bìa cho bài viết (16:9)</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="thumbnail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex flex-col items-center gap-4">
                                                        {field.value ? (
                                                            <div className="relative aspect-video w-full rounded-md overflow-hidden border border-gray-100 shadow-sm group">
                                                                <Image
                                                                    src={field.value}
                                                                    alt="Thumbnail"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        field.onChange("");
                                                                        setCroppedThumbnail(null);
                                                                    }}
                                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash className="h-6 w-6 text-white" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="aspect-video w-full rounded-md border-2 border-dashed flex flex-col items-center justify-center bg-gray-50 text-muted-foreground hover:bg-gray-100 transition-colors relative cursor-pointer gap-2">
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
                                                                aspect={16 / 9}
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
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" variant="orange">
                            <Save className="mr-2 h-4 w-4" /> Lưu bài viết
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
        </div>
    );
}
