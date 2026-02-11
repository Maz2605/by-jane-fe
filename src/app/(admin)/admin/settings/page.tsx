"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CreditCard, Globe, Store, Truck, Save, Bell } from "lucide-react";
import { useState } from "react";
import { showSuccessToast } from "@/lib/toast-utils";

const settingsTabs = [
    { id: "shipping", label: "Vận chuyển", icon: Truck },
    { id: "payment", label: "Thanh toán", icon: CreditCard },
    { id: "notifications", label: "Thông báo", icon: Bell },
];

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showSuccessToast("Đã lưu cài đặt thành công");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cài đặt</h1>
                <p className="text-sm text-muted-foreground mt-1">Quản lý cấu hình cửa hàng</p>
            </div>
            <Separator />

            <Tabs defaultValue="shipping" className="w-full">
                <TabsList className="mb-8 w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
                    {settingsTabs.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
                        >
                            <tab.icon className="mr-2 h-4 w-4" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>



                <TabsContent value="shipping" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vận chuyển</CardTitle>
                            <CardDescription>Cấu hình phí vận chuyển và khu vực giao hàng.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Phí vận chuyển mặc định</Label>
                                <div className="flex items-center space-x-2">
                                    <Input type="number" defaultValue="30000" className="w-[200px]" />
                                    <span className="text-sm text-muted-foreground">VND</span>
                                </div>
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Áp dụng cho tất cả đơn hàng nếu không có cấu hình khác.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end border-t px-6 py-4">
                            <Button onClick={handleSave} disabled={loading} variant="orange">
                                {loading ? "Đang lưu..." : "Lưu thay đổi"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Phương thức thanh toán</CardTitle>
                                <CardDescription>Quản lý các phương thức thanh toán được chấp nhận.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="cod" className="text-base">Thanh toán khi nhận hàng (COD)</Label>
                                        <p className="text-sm text-muted-foreground">Khách hàng thanh toán tiền mặt khi nhận hàng.</p>
                                    </div>
                                    <Switch id="cod" defaultChecked className="data-[state=checked]:bg-orange-500" />
                                </div>
                                <div className="space-y-4 rounded-md border p-4">
                                    <div className="flex items-center justify-between space-x-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="bank" className="text-base">Chuyển khoản ngân hàng</Label>
                                            <p className="text-sm text-muted-foreground">Khách hàng chuyển khoản qua ngân hàng.</p>
                                        </div>
                                        <Switch id="bank" defaultChecked className="data-[state=checked]:bg-orange-500" />
                                    </div>
                                    <div className="grid gap-2 pl-6 border-l-2 ml-1">
                                        <Label>Thông tin tài khoản</Label>
                                        <Textarea
                                            placeholder="Nhập tên ngân hàng, số tài khoản, tên chủ tài khoản..."
                                            defaultValue="Vietcombank - 0123456789 - NGUYEN VAN A"
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end border-t px-6 py-4">
                                <Button onClick={handleSave} disabled={loading} variant="orange">
                                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="notifications" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cấu hình thông báo</CardTitle>
                            <CardDescription>Quản lý các thông báo email và hệ thống.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Thông báo Email</h4>
                                <div className="space-y-4 rounded-md border p-4">
                                    <div className="flex items-center justify-between space-x-2">
                                        <div className="flex flex-col space-y-1">
                                            <Label htmlFor="email-new-order" className="text-base font-normal">Đơn hàng mới</Label>
                                            <span className="font-normal text-xs text-muted-foreground">Nhận email khi có khách hàng đặt hàng mới.</span>
                                        </div>
                                        <Switch id="email-new-order" defaultChecked className="data-[state=checked]:bg-orange-500" />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2">
                                        <div className="flex flex-col space-y-1">
                                            <Label htmlFor="email-order-status" className="text-base font-normal">Cập nhật trạng thái đơn hàng</Label>
                                            <span className="font-normal text-xs text-muted-foreground">Nhận email khi trạng thái đơn hàng thay đổi.</span>
                                        </div>
                                        <Switch id="email-order-status" defaultChecked className="data-[state=checked]:bg-orange-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Thông báo Hệ thống</h4>
                                <div className="space-y-4 rounded-md border p-4">
                                    <div className="flex items-center justify-between space-x-2">
                                        <div className="flex flex-col space-y-1">
                                            <Label htmlFor="sys-low-stock" className="text-base font-normal">Cảnh báo tồn kho thấp</Label>
                                            <span className="font-normal text-xs text-muted-foreground">Thông báo hiện trên dashboard khi sản phẩm sắp hết hàng.</span>
                                        </div>
                                        <Switch id="sys-low-stock" defaultChecked className="data-[state=checked]:bg-orange-500" />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2">
                                        <div className="flex flex-col space-y-1">
                                            <Label htmlFor="sys-new-customer" className="text-base font-normal">Khách hàng mới</Label>
                                            <span className="font-normal text-xs text-muted-foreground">Thông báo khi có thành viên mới đăng ký.</span>
                                        </div>
                                        <Switch id="sys-new-customer" defaultChecked className="data-[state=checked]:bg-orange-500" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end border-t px-6 py-4">
                            <Button onClick={handleSave} disabled={loading} variant="orange">
                                {loading ? "Đang lưu..." : "Lưu thay đổi"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
}
