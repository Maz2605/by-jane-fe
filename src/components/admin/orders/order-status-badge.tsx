import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/components/admin/editable-status-cell";

interface OrderStatusBadgeProps {
    status: string;
    className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
    const statusOption = ORDER_STATUS_OPTIONS.find((s) => s.value === status.toLowerCase()) || {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-200"
    };

    return (
        <Badge variant="outline" className={`${statusOption.color} ${className} font-normal`}>
            {statusOption.label}
        </Badge>
    );
}

interface PaymentStatusBadgeProps {
    status: string;
    className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
    const statusOption = PAYMENT_STATUS_OPTIONS.find((s) => s.value === status.toLowerCase()) || {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-200"
    };

    return (
        <Badge variant="outline" className={`${statusOption.color} ${className} font-normal`}>
            {statusOption.label}
        </Badge>
    );
}
