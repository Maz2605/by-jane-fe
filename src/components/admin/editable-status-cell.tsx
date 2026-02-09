"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface EditableStatusCellProps {
    value: string;
    options: { label: string; value: string; color?: string }[];
    onChange: (value: string) => void;
    iconRenderer?: (value: string) => React.ReactNode;
}

export function EditableStatusCell({ value, options, onChange, iconRenderer, referenceText = "mục này" }: EditableStatusCellProps & { referenceText?: string }) {
    const [internalValue, setInternalValue] = React.useState(value);

    // Sync internal state if prop changes (e.g. from real backend refresh)
    React.useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const currentOption = options.find((opt) => opt.value === internalValue);

    const handleValueChange = (val: string) => {
        const newOption = options.find(o => o.value === val);

        // 1. Optimistic Update
        setInternalValue(val);

        // 2. Trigger parent handler
        onChange(val);

        // 3. Custom Toast (Matching ToastNotification style with Framer Motion)
        toast.custom((t) => (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{
                    opacity: t.visible ? 1 : 0,
                    y: t.visible ? 0 : -50,
                    scale: t.visible ? 1 : 0.95
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                className="pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg min-w-[320px] max-w-md backdrop-blur-sm bg-emerald-50 border-emerald-200"
            >
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5 text-emerald-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-emerald-800">
                        Cập nhật thành công
                    </h3>
                    <p className="text-sm mt-1 leading-relaxed text-emerald-800 font-medium">
                        Đã đổi trạng thái của <b>{referenceText}</b> sang {newOption?.label}
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="flex-shrink-0 -mr-1 -mt-1 p-1 rounded-md hover:bg-black/10 transition-colors text-emerald-800"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </motion.div>
        ), { duration: 4000 });
    };

    return (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
            {iconRenderer && iconRenderer(internalValue)}
            <Select value={internalValue} onValueChange={handleValueChange}>
                <SelectTrigger className="h-8 w-fit border-none shadow-none bg-transparent hover:bg-muted/50 focus:ring-0 focus:ring-offset-0 p-0 px-2 gap-2">
                    <SelectValue>
                        <Badge variant="outline" className={currentOption?.color}>
                            {currentOption?.label}
                        </Badge>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export const ORDER_STATUS_OPTIONS = [
    { value: "pending", label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { value: "processing", label: "Đang xử lý", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { value: "shipping", label: "Đang giao", color: "bg-purple-100 text-purple-800 border-purple-200" },
    { value: "completed", label: "Hoàn thành", color: "bg-green-100 text-green-800 border-green-200" },
    { value: "cancelled", label: "Đã hủy", color: "bg-red-100 text-red-800 border-red-200" },
];

export const PAYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "Chưa thanh toán", color: "bg-gray-100 text-gray-800 border-gray-200" },
    { value: "paid", label: "Đã thanh toán", color: "bg-green-100 text-green-800 border-green-200" },
    { value: "failed", label: "Thất bại", color: "bg-red-100 text-red-800 border-red-200" },
    { value: "refunded", label: "Hoàn tiền", color: "bg-orange-100 text-orange-800 border-orange-200" },
];

export const CUSTOMER_STATUS_OPTIONS = [
    { value: "active", label: "Hoạt động", color: "bg-green-100 text-green-800 border-green-200" },
    { value: "blocked", label: "Bị chặn", color: "bg-red-100 text-red-800 border-red-200" },
];
