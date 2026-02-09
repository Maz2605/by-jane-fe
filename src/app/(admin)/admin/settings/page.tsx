"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CreditCard, Globe, Store, Truck, Save } from "lucide-react";
import { useState } from "react";
import ToastNotification from "@/components/ui/ToastNotification";

const settingsTabs = [
    { id: "general", label: "Cài đặt chung", icon: Store },
    { id: "shipping", label: "Vận chuyển", icon: Truck },
    { id: "payment", label: "Thanh toán", icon: CreditCard },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);
    const [toastState, setToastState] = useState<{
        isOpen: boolean;
        message: string;
        type: 'success' | 'error' | 'warning';
    }>({
        isOpen: false,
        message: '',
        type: 'success',
    });

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setToastState({
                isOpen: true,
                message: "Đã lưu cài đặt thành công",
                type: "success"
            });
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cài đặt</h1>
                <p className="text-sm text-muted-foreground mt-1">Quản lý cấu hình cửa hàng</p>
            </div>
            <Separator />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        {settingsTabs.map((item) => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                className={cn(
                                    "justify-start hover:bg-transparent hover:underline",
                                    activeTab === item.id ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline"
                                )}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Button>
                        ))}
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-2xl">
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Thông tin cửa hàng</h3>
                                <p className="text-sm text-muted-foreground">
                                    Thông tin này sẽ hiển thị trên trang web và hóa đơn.
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="storeName">Tên cửa hàng</Label>
                                    <Input id="storeName" defaultValue="ByJane Shop" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="storeEmail">Email liên hệ</Label>
                                    <Input id="storeEmail" defaultValue="contact@byjanestudio.com" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="storePhone">Số điện thoại</Label>
                                    <Input id="storePhone" defaultValue="0901234567" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="storeAddress">Địa chỉ</Label>
                                    <Textarea id="storeAddress" defaultValue="123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleSave} disabled={loading} variant="orange">
                                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === "shipping" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Vận chuyển</h3>
                                <p className="text-sm text-muted-foreground">
                                    Cấu hình phí vận chuyển và khu vực giao hàng.
                                </p>
                            </div>
                            <Separator />
                            <Card>
                                <CardHeader>
                                    <CardTitle>Phí vận chuyển mặc định</CardTitle>
                                    <CardDescription>Áp dụng cho tất cả đơn hàng nếu không có cấu hình khác.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Input type="number" defaultValue="30000" className="w-[200px]" />
                                        <span className="text-sm text-muted-foreground">VND</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button onClick={handleSave} disabled={loading} variant="orange">
                                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === "payment" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Thanh toán</h3>
                                <p className="text-sm text-muted-foreground">
                                    Quản lý các phương thức thanh toán được chấp nhận.
                                </p>
                            </div>
                            <Separator />
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thanh toán khi nhận hàng (COD)</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center space-x-2 justify-between">
                                    <Label htmlFor="cod" className="flex flex-col space-y-1">
                                        <span>Kích hoạt</span>
                                    </Label>
                                    <Switch id="cod" defaultChecked />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Chuyển khoản ngân hàng</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center space-x-2 justify-between">
                                    <Label htmlFor="bank" className="flex flex-col space-y-1">
                                        <span>Kích hoạt</span>
                                    </Label>
                                    <Switch id="bank" defaultChecked />
                                </CardContent>
                                <CardContent className="border-t pt-4 space-y-2">
                                    <Label>Thông tin tài khoản</Label>
                                    <Textarea placeholder="Nhập tên ngân hàng, số tài khoản, tên chủ tài khoản..." defaultValue="Vietcombank - 0123456789 - NGUYEN VAN A" />
                                </CardContent>
                            </Card>
                            <div className="flex justify-end">
                                <Button onClick={handleSave} disabled={loading} variant="orange">
                                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastNotification
                isOpen={toastState.isOpen}
                onClose={() => setToastState(prev => ({ ...prev, isOpen: false }))}
                message={toastState.message}
                type={toastState.type}
            />
        </div >
    );
}
