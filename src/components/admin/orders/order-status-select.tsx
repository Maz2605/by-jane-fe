"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus } from "@/lib/mock-data/orders";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface OrderStatusSelectProps {
    currentStatus: OrderStatus;
    onStatusChange: (newStatus: OrderStatus) => Promise<void>;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
    { value: "pending", label: "Chờ xử lý", color: "text-yellow-600" },
    { value: "processing", label: "Đang xử lý", color: "text-blue-600" },
    { value: "shipping", label: "Đang giao", color: "text-purple-600" },
    { value: "completed", label: "Hoàn thành", color: "text-green-600" },
    { value: "refunding", label: "Hoàn tiền", color: "text-orange-600" },
    { value: "cancelled", label: "Đã hủy", color: "text-red-600" },
    { value: "returned", label: "Trả hàng", color: "text-gray-600" },
];

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ["processing", "cancelled"],
    processing: ["shipping", "cancelled"],
    shipping: ["completed", "cancelled"],
    completed: ["returned"],
    returned: ["refunding", "cancelled"],
    refunding: ["cancelled", "completed"],
    cancelled: [],
};

export function OrderStatusSelect({ currentStatus, onStatusChange }: OrderStatusSelectProps) {
    const [status, setStatus] = useState<OrderStatus>(currentStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleValueChange = async (value: string) => {
        const newStatus = value as OrderStatus;
        if (newStatus === status) return;

        // Check if transition is valid
        // NOTE: Allow admins to force update for now, or uncomment to restrict
        // if (!validTransitions[status].includes(newStatus)) {
        //     toast.error("Trạng thái không hợp lệ!");
        //     return;
        // }

        setIsLoading(true);
        setStatus(newStatus); // Optimistic update

        try {
            await onStatusChange(newStatus);
            const label = STATUS_OPTIONS.find(o => o.value === newStatus)?.label;
            toast.success(`Đã cập nhật trạng thái: ${label}`);
        } catch (error) {
            console.error(error);
            setStatus(currentStatus); // Revert on error
            toast.error("Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Select value={status} onValueChange={handleValueChange} disabled={isLoading}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
                {STATUS_OPTIONS.map((option) => {
                    // Start: Optional logic to disable invalid options
                    // const isDisabled = !validTransitions[status].includes(option.value) && option.value !== status;
                    const isDisabled = false; // Enable all for flexibility for now
                    // End

                    return (
                        <SelectItem key={option.value} value={option.value} disabled={isDisabled}>
                            <span className={option.color}>{option.label}</span>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    );
}
