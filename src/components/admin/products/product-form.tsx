"use client";

import { useEffect, useState } from "react";
import { Product, ProductSchema } from "@/lib/validations/product";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, ImagePlus, Loader2, Plus, RefreshCw, Trash, X, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { cn, removeVietnameseTones } from "@/lib/utils";

import { showSuccessToast, showErrorToast, dismissToast } from "@/lib/toast-utils";

interface ProductFormProps {
    initialData?: Product | null;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [hasVariants, setHasVariants] = useState(false);

    const title = initialData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm";
    const description = "";
    const toastMessage = initialData ? "Cập nhật sản phẩm thành công." : "Tạo sản phẩm thành công.";
    const action = initialData ? "Lưu thay đổi" : "Tạo sản phẩm";

    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema) as any,
        defaultValues: initialData || {
            name: "",
            description: "",
            price: 0,
            compareAtPrice: 0,
            stock: 0,
            sku: "",
            barcode: "",
            status: "active",
            category: "",
            tags: [],
            images: [],
            videos: [],
            featured: false,
            options: [],
            variants: [],
        },
    });

    const { fields: optionFields, append: appendOption, remove: removeOption, replace: replaceOptions } = useFieldArray({
        control: form.control,
        name: "options",
    });

    const { replace: replaceVariants } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    useEffect(() => {
        if (!hasVariants) {
            replaceVariants([]);
        }
    }, [hasVariants, replaceVariants]);

    // Enforce default options on mount
    useEffect(() => {
        const currentOptions = form.getValues("options");
        if (!currentOptions || currentOptions.length === 0) {
            replaceOptions([
                { name: "Màu sắc", values: [] },
                { name: "Kích thước", values: [] }
            ]);
        }
    }, [replaceOptions]);

    // Helper to generate Cartesian product
    const generateCartesianProduct = (opts: any[]) => {
        return opts.reduce(
            (acc, opt) => {
                if (!opt.values || opt.values.length === 0) return acc;
                const newAcc: any[] = [];
                acc.forEach((existingMeta: any) => {
                    opt.values.forEach((val: string) => {
                        newAcc.push({
                            ...existingMeta,
                            [opt.name]: val,
                            _options: [...(existingMeta._options || []), { name: opt.name, value: val }]
                        });
                    });
                });
                return newAcc;
            },
            [{}]
        );
    };

    // Generate variants when options change
    useEffect(() => {
        if (!hasVariants) {
            return;
        }

        const options = form.getValues("options") || [];
        if (options.length === 0) return;



        const combinations = generateCartesianProduct(options);
        // Remove the initial empty object if combinations were generated
        const validCombinations = combinations.filter((c: any) => c._options && c._options.length > 0);

        const currentSku = form.getValues("sku");

        const newVariants = validCombinations.map((combo: any) => {
            const name = combo._options.map((o: any) => o.value).join(" / ");
            // Calculate SKU suffix
            const suffix = getVariantSuffix(combo._options);
            const variantSku = currentSku ? `${currentSku}-${suffix}` : suffix;

            return {
                name: name,
                price: form.getValues("price"),
                stock: 0,
                sku: variantSku,
                options: combo._options,
            };
        });

        if (newVariants.length > 0) {
            const currentVariants = form.getValues("variants") || [];
            const mergedVariants = newVariants.map((nv: any) => {
                const existing = currentVariants.find((cv) => cv.name === nv.name);
                if (existing) {
                    // Update SKU if Main SKU changed (handled by other effect, but good to be safe)
                    // But here we prioritize keeping existing data
                    return { ...nv, price: existing.price, stock: existing.stock, sku: existing.sku || nv.sku };
                }
                return nv;
            });
            replaceVariants(mergedVariants);
        }
    }, [form.watch("options")]);


    // --- SKU LOGIC ---

    // 1. Helper to generate Variant Suffix: COLOR-SIZE
    const getVariantSuffix = (options: any[]) => {
        const colorOpt = options.find((o: any) => o.name === "Màu sắc");
        const sizeOpt = options.find((o: any) => o.name === "Kích thước");

        let suffixParts = [];

        if (colorOpt) {
            const code = removeVietnameseTones(colorOpt.value || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 3);
            if (code) suffixParts.push(code);
        }
        if (sizeOpt) {
            const code = removeVietnameseTones(sizeOpt.value || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
            if (code) suffixParts.push(code);
        }

        // Fallback for other options
        if (suffixParts.length === 0) {
            suffixParts = options.map((o: any) =>
                removeVietnameseTones(o.value || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 3)
            );
        }

        return suffixParts.join("-");
    };

    // 2. Auto-generate Main SKU from Name
    const generateSkuFromName = (force = false) => {
        const currentSku = form.getValues("sku");
        if (!force && currentSku) return; // Only auto-gen on blur if empty

        const name = form.getValues("name");
        if (!name) {
            if (force) showErrorToast("Vui lòng nhập tên sản phẩm trước");
            return;
        }

        const normalized = removeVietnameseTones(name)
            .replace(/[^a-zA-Z0-9\s]/g, "") // Keep alphanumeric and spaces
            .trim()
            .replace(/\s+/g, "-") // Space to dash
            .toUpperCase();

        // Limit length
        const shortSku = normalized.length > 20 ? normalized.substring(0, 20) : normalized;

        // Add random suffix for uniqueness if forced manual generation to avoid conflict
        const finalSku = force ? `${shortSku}-${Math.floor(Math.random() * 1000)}` : shortSku;

        form.setValue("sku", finalSku, { shouldValidate: true });
        if (force) showSuccessToast(`Đã tạo mã SKU: ${finalSku}`);
    };

    // 3. Sync Main SKU to Variants
    // Watch 'sku' changes. If it changes, we ask user or auto-update?
    // Requirement is "Ensure... variant SKUs are also updated".
    // We'll use a specific function for this to avoid infinite loops with useEffect, 
    // or use a refined useEffect.
    const mainSku = form.watch("sku");

    useEffect(() => {
        if (!hasVariants) return;
        const currentVariants = form.getValues("variants") || [];
        if (currentVariants.length === 0) return;

        // Debounce or just check if meaningful change
        if (!mainSku) return;

        const updatedVariants = currentVariants.map((v: any) => {
            const suffix = getVariantSuffix(v.options || []);
            // New Format: MAIN-SKU-SUFFIX
            const variantSku = mainSku ? `${mainSku}-${suffix}` : suffix;
            return {
                ...v,
                sku: variantSku
            };
        });

        // Use JSON.stringify to compare avoiding loop if identical
        if (JSON.stringify(updatedVariants) !== JSON.stringify(currentVariants)) {
            // Only update fields that need it to avoid losing focus if editing variants
            // unique update
            form.setValue("variants", updatedVariants);
        }

    }, [mainSku, hasVariants, form]); // Dependency on mainSku

    // Calculate total stock from variants
    const variants = form.watch("variants");
    useEffect(() => {
        if (variants && variants.length > 0) {
            const totalStock = variants.reduce((acc, variant) => acc + (Number(variant.stock) || 0), 0);
            form.setValue("stock", totalStock);
        }
    }, [variants, form]);

    const onSubmit = async (data: z.infer<typeof ProductSchema>) => {
        try {
            setLoading(true);
            console.log("Submitting data:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await new Promise((resolve) => setTimeout(resolve, 1000));
            showSuccessToast(toastMessage);
            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            showErrorToast("Đã có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button variant="orange" type="submit" onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {action}
                    </Button>
                </div>
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* LEFT COLUMN - MAIN INFO */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin sản phẩm</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tên sản phẩm</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={loading}
                                                        placeholder="Nhập tên sản phẩm"
                                                        {...field}
                                                        onBlur={(e) => {
                                                            field.onBlur();
                                                            generateSkuFromName();
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mô tả</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        disabled={loading}
                                                        placeholder="Mô tả sản phẩm"
                                                        className="min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Hình ảnh & Video</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="images"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="mb-4 flex items-center gap-4">
                                                    {field.value?.map((url, index) => (
                                                        <div key={index} className="relative h-[200px] w-[200px] overflow-hidden rounded-md border">
                                                            <div className="z-10 absolute top-2 right-2">
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newImages = [...field.value!];
                                                                        newImages.splice(index, 1);
                                                                        field.onChange(newImages);
                                                                    }}
                                                                    variant="destructive"
                                                                    size="icon"
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="relative h-full w-full">
                                                                {/* Just a placeholder if URL is not real in dev */}
                                                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-muted-foreground">
                                                                    IMG {index + 1}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div
                                                        className="flex h-[200px] w-[200px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed hover:bg-gray-50"
                                                        onClick={() => {
                                                            // Mock Upload
                                                            const newUrl = `https://mock.com/image-${Date.now()}.jpg`;
                                                            field.onChange([...(field.value || []), newUrl]);
                                                        }}
                                                    >
                                                        <ImagePlus className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Thêm ảnh</span>
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Separator className="my-4" />
                                    <FormField
                                        control={form.control}
                                        name="videos"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="mb-4">
                                                    <FormLabel className="mb-2 block">Video</FormLabel>
                                                    <div className="gap-4 flex items-center">
                                                        {field.value?.map((url, index) => (
                                                            <div key={index} className="relative h-[100px] w-[150px] overflow-hidden rounded-md border bg-black">
                                                                <div className="absolute top-1 right-1 z-10">
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newVideos = [...field.value!];
                                                                            newVideos.splice(index, 1);
                                                                            field.onChange(newVideos);
                                                                        }}
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        className="h-6 w-6"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                                <div className="flex h-full w-full items-center justify-center text-xs text-white">
                                                                    VIDEO {index + 1}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                // Mock Upload
                                                                const newUrl = `https://mock.com/video-${Date.now()}.mp4`;
                                                                field.onChange([...(field.value || []), newUrl]);
                                                            }}
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" /> Thêm Video
                                                        </Button>
                                                    </div>

                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Biến thể sản phẩm</CardTitle>
                                </CardHeader>
                                <CardContent>

                                    {/* Variant options always visible */}
                                    <div className="space-y-6">
                                        {optionFields.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-12 gap-4 items-start border p-4 rounded-md relative bg-gray-50/50">
                                                <div className="col-span-3">
                                                    <FormLabel>Tên tùy chọn</FormLabel>
                                                    <Select
                                                        disabled={true} // Fixed options
                                                        onValueChange={(value) => {
                                                            form.setValue(`options.${index}.name`, value);
                                                        }}
                                                        value={form.watch(`options.${index}.name`)}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="mt-2 text-black opacity-100 bg-gray-100">
                                                                <SelectValue placeholder="Chọn loại" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Màu sắc">Màu sắc</SelectItem>
                                                            <SelectItem value="Kích thước">Kích thước</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="col-span-9">
                                                    <FormLabel>Giá trị tùy chọn</FormLabel>
                                                    <Input
                                                        className="mt-2"
                                                        disabled={loading}
                                                        placeholder={`Nhập ${field.name?.toLowerCase()}, cách nhau bởi dấu phẩy`}
                                                        onChange={(e) => {
                                                            const rawValues = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
                                                            const uniqueValues = Array.from(new Set(rawValues));
                                                            form.setValue(`options.${index}.values`, uniqueValues);
                                                        }}
                                                    />
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {form.watch(`options.${index}.values`)?.map((val, i) => (
                                                            <Badge key={i} variant="secondary">{val}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Disable removing options as they are fixed */}
                                            </div>
                                        ))}

                                        {/* Remove Add Option Button */}

                                        <Separator className="my-6" />

                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-medium">Danh sách biến thể</h4>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="hover:bg-gray-50 text-gray-700"
                                                onClick={() => {
                                                    const options = form.getValues("options");
                                                    if (!options || options.length === 0) return;

                                                    const combinations = generateCartesianProduct(options);
                                                    // Remove the initial empty object if combinations were generated
                                                    const validCombinations = combinations.filter((c: any) => c._options && c._options.length > 0);

                                                    const currentSku = form.getValues("sku");

                                                    const newVariants = validCombinations.map((combo: any) => {
                                                        const name = combo._options.map((o: any) => o.value).join(" / ");
                                                        // Calculate SKU suffix
                                                        const suffix = getVariantSuffix(combo._options);
                                                        const variantSku = currentSku ? `${currentSku}-${suffix}` : suffix;

                                                        return {
                                                            name: name,
                                                            price: form.getValues("price"),
                                                            stock: 0,
                                                            sku: variantSku,
                                                            options: combo._options,
                                                        };
                                                    });

                                                    replaceVariants(newVariants);
                                                    showSuccessToast("Đã sinh biến thể tự động thành công!");
                                                }}
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" /> Sinh biến thể tự động
                                            </Button>
                                        </div>

                                        <div className="rounded-md border overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-gray-100">
                                                    <TableRow>
                                                        {form.watch("options")?.map((opt, i) => (
                                                            <TableHead key={i} className="min-w-[150px] font-semibold text-black">{opt.name || `Tùy chọn ${i + 1}`}</TableHead>
                                                        ))}
                                                        <TableHead className="min-w-[120px] font-semibold text-black">Giá bán</TableHead>
                                                        <TableHead className="min-w-[120px] font-semibold text-black">Tồn kho</TableHead>
                                                        <TableHead className="min-w-[120px] font-semibold text-black">SKU</TableHead>
                                                        <TableHead className="w-[50px]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {form.watch("variants")?.map((variant, vIndex) => (
                                                        <TableRow key={vIndex}>
                                                            {form.watch("options")?.map((opt, oIndex) => {
                                                                const currentOptValue = form.watch(`variants.${vIndex}.options.${oIndex}.value`);

                                                                return (
                                                                    <TableCell key={oIndex}>
                                                                        <Select
                                                                            value={currentOptValue}
                                                                            onValueChange={(val) => {
                                                                                // Sync Option Name if changed
                                                                                form.setValue(`variants.${vIndex}.options.${oIndex}.name`, opt.name);
                                                                                form.setValue(`variants.${vIndex}.options.${oIndex}.value`, val);

                                                                                // Re-generate name for the variant
                                                                                const updatedOptions = form.getValues(`variants.${vIndex}.options`) || [];
                                                                                const values = updatedOptions.map((o: any) => o.value).filter(Boolean);
                                                                                form.setValue(`variants.${vIndex}.name`, values.join(" / "));
                                                                            }}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder={`Chọn ${opt.name}`} />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {opt.values?.map((val, valIndex) => (
                                                                                    <SelectItem key={valIndex} value={val}>{val}</SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </TableCell>
                                                                );
                                                            })}
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    {...form.register(`variants.${vIndex}.price` as any)}
                                                                    className="w-full"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    {...form.register(`variants.${vIndex}.stock` as any)}
                                                                    className="w-full"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    {...form.register(`variants.${vIndex}.sku` as any)}
                                                                    className="w-full"
                                                                    placeholder="Tự động"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        const newVariants = [...form.getValues("variants")!];
                                                                        newVariants.splice(vIndex, 1);
                                                                        replaceVariants(newVariants);
                                                                    }}
                                                                >
                                                                    <Trash className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {(!form.watch("variants") || form.watch("variants")!.length === 0) && (
                                                        <TableRow>
                                                            <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                                                                Chưa có biến thể nào. Nhấn "Sinh biến thể tự động" để tạo.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Giá cả</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giá bán (Mặc định)</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            disabled={loading}
                                                            placeholder="0"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="whitespace-nowrap"
                                                        onClick={() => {
                                                            const currentPrice = form.getValues("price");
                                                            if (!currentPrice) return;

                                                            const currentVariants = form.getValues("variants") || [];
                                                            if (currentVariants.length === 0) return;

                                                            const updatedVariants = currentVariants.map(v => ({
                                                                ...v,
                                                                price: currentPrice
                                                            }));

                                                            replaceVariants(updatedVariants);
                                                            dismissToast(); // Dismiss previous toasts to avoid spam
                                                            showSuccessToast("Đã cập nhật giá cho tất cả biến thể");
                                                        }}
                                                    >
                                                        Áp dụng cho tất cả
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="compareAtPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giá gốc</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        disabled={loading}
                                                        placeholder="0"
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

                        {/* RIGHT COLUMN - SIDEBAR INFO */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trạng thái</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Trạng thái sản phẩm</FormLabel>
                                                <Select
                                                    disabled={loading}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue="active"
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="active">Hoạt động</SelectItem>
                                                        <SelectItem value="draft">Nháp</SelectItem>
                                                        <SelectItem value="archived">Lưu trữ</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex items-center space-x-2 mt-4">
                                        <Switch
                                            id="featured"
                                            checked={form.watch("featured")}
                                            onCheckedChange={(checked) => form.setValue("featured", checked)}
                                            className="data-[state=checked]:bg-orange-500"
                                        />
                                        <label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Sản phẩm nổi bật
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Phân loại</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Danh mục</FormLabel>
                                                <Select
                                                    disabled={loading}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn danh mục" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="T-Shirt">Áo thun</SelectItem>
                                                        <SelectItem value="Jeans">Quần Jeans</SelectItem>
                                                        <SelectItem value="Accessories">Phụ kiện</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sku"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mã SKU chính</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input
                                                            disabled={loading}
                                                            placeholder="Tự động tạo từ tên..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="whitespace-nowrap"
                                                        onClick={() => generateSkuFromName(true)}
                                                        title="Tạo mã SKU tự động từ tên sản phẩm"
                                                    >
                                                        <Wand2 className="mr-2 h-4 w-4" />
                                                        Tạo mã
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Đồng bộ SKU cho tất cả biến thể"
                                                        onClick={() => {
                                                            const currentSku = form.getValues("sku");
                                                            if (!currentSku) {
                                                                showErrorToast("Vui lòng nhập SKU chính trước");
                                                                return;
                                                            }

                                                            const currentVariants = form.getValues("variants") || [];
                                                            if (currentVariants.length === 0) {
                                                                showErrorToast("Chưa có biến thể nào để đồng bộ");
                                                                return;
                                                            }

                                                            const updatedVariants = currentVariants.map((v: any) => {
                                                                const suffix = getVariantSuffix(v.options || []);
                                                                const variantSku = currentSku ? `${currentSku}-${suffix}` : suffix;
                                                                return {
                                                                    ...v,
                                                                    sku: variantSku
                                                                };
                                                            });

                                                            replaceVariants(updatedVariants);
                                                            dismissToast();
                                                            showSuccessToast("Đã đồng bộ SKU cho tất cả biến thể");
                                                        }}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tổng kho {hasVariants && "(Tự động tính)"}</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            disabled={true}
                                                            placeholder="0"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Cập nhật lại tổng kho"
                                                        onClick={() => {
                                                            const currentVariants = form.getValues("variants") || [];
                                                            const totalStock = currentVariants.reduce((acc, variant) => acc + (Number(variant.stock) || 0), 0);
                                                            form.setValue("stock", totalStock);
                                                            dismissToast(); // Dismiss previous toasts
                                                            showSuccessToast("Đã cập nhật lại tổng kho");
                                                        }}
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
