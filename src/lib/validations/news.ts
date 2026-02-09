import { z } from "zod";

export const newsSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    slug: z.string(),
    thumbnail: z.string().optional(),
    category: z.string().min(1, "Vui lòng chọn danh mục"),
    content: z.string().optional(),
    author: z.string(),
    status: z.enum(["published", "draft", "archived"]),
    publishedAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type News = z.infer<typeof newsSchema>;
