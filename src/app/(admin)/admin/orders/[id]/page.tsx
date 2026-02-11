"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MOCK_ORDERS } from "@/lib/mock-data/orders";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/orders/order-status-badge";
import { OrderStatusSelect } from "@/components/admin/orders/order-status-select";
import Image from "next/image";

export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const order = MOCK_ORDERS.find((o) => o.id === id);

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Không tìm thấy đơn hàng</h2>
                <Link href="/admin/orders">
                    <Button variant="outline"> <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders" className="print:hidden">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Đơn hàng {order.id}</h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                        <span>•</span>
                        <OrderStatusBadge status={order.status} />
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2 print:hidden">
                    <Button
                        variant="outline"
                        onClick={() => window.print()}
                    >
                        In hóa đơn
                    </Button>
                    <OrderStatusSelect
                        currentStatus={order.status}
                        onStatusChange={async (newStatus) => {
                            // Mock API Call
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    console.log(`Updated status to: ${newStatus}`);
                                    resolve();
                                }, 1000);
                            });
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* LEFT COLUMN - Order Items */}
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Chi tiết sản phẩm</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-start gap-4">
                                        <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-gray-100">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No img</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.productName}</h4>
                                            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                                            <div className="mt-1 flex items-center gap-2 text-sm">
                                                <span>{formatCurrency(item.price)}</span>
                                                <span className="text-muted-foreground">x {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right font-medium">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tạm tính</span>
                                        <span>{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Phí vận chuyển</span>
                                        <span>{formatCurrency(0)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Tổng cộng</span>
                                        <span className="text-orange-600">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN - Customer & Payment Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                                    <User className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-medium">{order.customer.name}</p>
                                    <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Địa chỉ giao hàng</p>
                                    <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium text-sm">Số điện thoại</p>
                                    <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Trạng thái</span>
                                <PaymentStatusBadge status={order.paymentStatus} />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Phương thức</span>
                                <span className="text-sm font-medium">{order.paymentMethod}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

