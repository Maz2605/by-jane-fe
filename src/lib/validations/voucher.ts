import { z } from "zod";

export const voucherSchema = z.object({
    id: z.string(),
    code: z.string().min(1, "Vui lòng nhập mã voucher"),
    description: z.string().optional(),
    discountType: z.enum(["percentage", "fixed"]),
    value: z.number().min(0, "Giá trị phải lớn hơn 0"),
    minOrderValue: z.number().min(0).optional(),
    maxDiscountValue: z.number().min(0).optional(),
    startDate: z.string(),
    endDate: z.string(),
    usageLimit: z.number().min(1).optional(),
    usedCount: z.number().default(0),
    status: z.enum(["active", "expired", "disabled"]),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Voucher = z.infer<typeof voucherSchema>;
