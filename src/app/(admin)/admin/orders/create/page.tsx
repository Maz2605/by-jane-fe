"use client";

import { OrderForm } from "@/components/admin/orders/order-form";

export default function CreateOrderPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tạo đơn hàng mới</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Tạo đơn hàng mới cho khách hàng
                </p>
            </div>
            <OrderForm />
        </div>
    );
}
