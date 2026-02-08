import { z } from "zod";

const OptionSchema = z.object({
    name: z.string().min(1, "Tên tùy chọn không được để trống"),
    values: z.array(z.string()).min(1, "Cần ít nhất một giá trị"),
});

const VariantSchema = z.object({
    name: z.string(),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().min(0),
    sku: z.string().optional(),
    options: z.array(z.object({
        name: z.string(),
        value: z.string(),
    })),
});

export const ProductSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Tên sản phẩm không được để trống"),
    slug: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
    compareAtPrice: z.coerce.number().min(0).optional(),
    costPrice: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().int().min(0),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    status: z.enum(["active", "draft", "archived"]).default("active"),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    featured: z.boolean().default(false),
    options: z.array(OptionSchema).optional(),
    variants: z.array(VariantSchema).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
