import { Badge } from "@/components/ui/badge";
import { OrderStatus, PaymentStatus } from "@/lib/mock-data/orders";

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

interface PaymentStatusBadgeProps {
    status: PaymentStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const styles: Record<OrderStatus, { label: string; className: string }> = {
        pending: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
        processing: { label: "Đang xử lý", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
        shipping: { label: "Đang giao", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
        completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800 hover:bg-green-100" },
        cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800 hover:bg-red-100" },
    };

    const config = styles[status] || styles.pending;

    return (
        <Badge className={config.className} variant="outline">
            {config.label}
        </Badge>
    );
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
    const styles: Record<PaymentStatus, { label: string; className: string }> = {
        pending: { label: "Chưa thanh toán", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
        paid: { label: "Đã thanh toán", className: "bg-green-100 text-green-800 hover:bg-green-100" },
        failed: { label: "Thất bại", className: "bg-red-100 text-red-800 hover:bg-red-100" },
        refunded: { label: "Hoàn tiền", className: "bg-orange-100 text-orange-800 hover:bg-orange-100" },
    };

    const config = styles[status] || styles.pending;

    return (
        <Badge className={config.className} variant="outline">
            {config.label}
        </Badge>
    );
}
