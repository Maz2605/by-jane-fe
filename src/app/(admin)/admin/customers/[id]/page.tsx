"use client";

import { useParams } from "next/navigation";
import { MOCK_CUSTOMERS } from "@/lib/mock-data/customers";
import { MOCK_ORDERS } from "@/lib/mock-data/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, ExternalLink, Trash, UserX, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Copy, Check, RefreshCw } from "lucide-react";
import { useState } from "react";
import { showSuccessToast } from "@/lib/toast-utils";

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const customerId = params.id as string;

    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    const customerOrders = MOCK_ORDERS.filter((o) => o.customer.id === customerId);

    const [status, setStatus] = useState<string>(customer?.status || 'active');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [dialogStep, setDialogStep] = useState<'confirm' | 'success'>('confirm');

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    };

    const handleUpdatePassword = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const newPass = generatePassword();
            setGeneratedPassword(newPass);
            setIsLoading(false);
            setDialogStep('success');
        }, 800);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        showSuccessToast(`Đã cập nhật trạng thái thành: ${value === 'active' ? 'Đang hoạt động' : 'Đã chặn'}`);
    };

    const handleDeleteCustomer = () => {
        if (adminPassword !== "admin123") {
            setDeleteError("Mật khẩu quản trị viên không đúng!");
            return;
        }

        setIsDeleting(true);
        setDeleteError("");

        // Simulate API call
        setTimeout(() => {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            showSuccessToast("Đã xóa khách hàng thành công");
            // Redirect after a short delay
            setTimeout(() => {
                router.push('/admin/customers');
            }, 1000);
        }, 1000);
    };

    const resetDeleteDialog = (open: boolean) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
            setAdminPassword("");
            setDeleteError("");
        }
    };

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(generatedPassword);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const resetDialogState = (open: boolean) => {
        setIsPasswordDialogOpen(open);
        if (!open) {
            setTimeout(() => {
                setDialogStep('confirm');
                setGeneratedPassword("");
                setIsCopied(false);
            }, 300);
        }
    };

    if (!customer) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy khách hàng</h2>
                <p className="text-muted-foreground mt-2">Khách hàng này không tồn tại hoặc đã bị xóa.</p>
                <Button asChild className="mt-4" variant="outline">
                    <Link href="/admin/customers">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại danh sách
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/customers">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Chi tiết khách hàng</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>ID: {customer.id}</span>
                        <div className="ml-2">
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className={`h-6 text-xs w-fit gap-1 border-0 px-2 rounded-full ${status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active" className="text-green-600 focus:text-green-700">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3 w-3" />
                                            <span>Đang hoạt động</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="blocked" className="text-red-600 focus:text-red-700">
                                        <div className="flex items-center gap-2">
                                            <UserX className="h-3 w-3" />
                                            <span>Đã chặn</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Customer Profile */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={customer.avatar} alt={customer.name} />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                    {customer.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle className="text-lg">{customer.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="leading-snug">{customer.address || "Chưa cập nhật địa chỉ"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm pt-2">
                            <span className="text-muted-foreground">Hạng thành viên:</span>
                            <Badge variant="outline" className={
                                customer.rank === 'Gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    customer.rank === 'Platinum' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                                        customer.rank === 'Silver' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                                            'bg-gray-50 text-gray-700 border-gray-200'
                            }>
                                {customer.rank}
                            </Badge>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="text-center p-3 bg-muted/40 rounded-lg">
                                <div className="text-2xl font-bold text-primary">{customer.totalOrders}</div>
                                <div className="text-xs text-muted-foreground font-medium">Đơn hàng</div>
                            </div>
                            <div className="text-center p-3 bg-muted/40 rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {new Intl.NumberFormat('vi-VN', { notation: "compact", maximumFractionDigits: 1 }).format(customer.totalSpent)}
                                </div>
                                <div className="text-xs text-muted-foreground font-medium">Chi tiêu</div>
                            </div>
                        </div>
                        <Separator />
                        <div className="pt-2">
                            <Dialog open={isPasswordDialogOpen} onOpenChange={resetDialogState}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
                                        <Lock className="mr-2 h-4 w-4" />
                                        Đổi mật khẩu
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {dialogStep === 'confirm' ? "Xác nhận đổi mật khẩu" : "Đổi mật khẩu thành công"}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {dialogStep === 'confirm'
                                                ? <span>Bạn có chắc chắn muốn tạo mật khẩu mới ngẫu nhiên cho khách hàng <strong>{customer.name}</strong> không?</span>
                                                : "Mật khẩu mới đã được tạo. Hãy sao chép và gửi cho khách hàng."
                                            }
                                        </DialogDescription>
                                    </DialogHeader>

                                    {dialogStep === 'confirm' ? (
                                        <div className="py-4">
                                            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-3 text-sm flex gap-2">
                                                <RefreshCw className="h-4 w-4 shrink-0 mt-0.5" />
                                                <div>
                                                    Hệ thống sẽ tự động sinh một mật khẩu ngẫu nhiên an toàn. Mật khẩu cũ sẽ không còn hiệu lực.
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Mật khẩu mới</Label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Input
                                                            readOnly
                                                            value={generatedPassword}
                                                            className="pr-10 font-mono text-lg bg-muted"
                                                        />
                                                    </div>
                                                    <Button size="icon" variant="outline" onClick={handleCopyPassword} className={isCopied ? "text-green-600 border-green-200 bg-green-50" : ""}>
                                                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                {isCopied && <p className="text-xs text-green-600 font-medium">Đã sao chép vào bộ nhớ tạm!</p>}
                                            </div>
                                        </div>
                                    )}

                                    <DialogFooter>
                                        {dialogStep === 'confirm' ? (
                                            <>
                                                <Button variant="outline" onClick={() => resetDialogState(false)}>Hủy</Button>
                                                <Button onClick={handleUpdatePassword} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
                                                    {isLoading ? "Đang xử lý..." : "Tạo mật khẩu mới"}
                                                </Button>
                                            </>
                                        ) : (
                                            <Button onClick={() => resetDialogState(false)} className="bg-orange-600 hover:bg-orange-700 text-white">Đóng</Button>
                                        )}
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="pt-2">
                            <Dialog open={isDeleteDialogOpen} onOpenChange={resetDeleteDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                        <Trash className="mr-2 h-4 w-4" />
                                        Xóa khách hàng
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Bạn có chắc chắn muốn xóa?</DialogTitle>
                                        <DialogDescription>
                                            Hành động này không thể hoàn tác. Vui lòng nhập mật khẩu quản trị viên để xác nhận xóa khách hàng <strong>{customer.name}</strong>.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-2 space-y-2">
                                        <Label htmlFor="admin-password">Mật khẩu quản trị viên</Label>
                                        <Input
                                            id="admin-password"
                                            type="password"
                                            placeholder="Nhập mật khẩu admin..."
                                            value={adminPassword}
                                            onChange={(e) => {
                                                setAdminPassword(e.target.value);
                                                setDeleteError("");
                                            }}
                                            className={deleteError ? "border-red-500" : ""}
                                        />
                                        {deleteError && <p className="text-xs text-red-500 font-medium">{deleteError}</p>}
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => resetDeleteDialog(false)} disabled={isDeleting}>Hủy</Button>
                                        <Button onClick={handleDeleteCustomer} disabled={isDeleting || !adminPassword} className="bg-red-600 hover:bg-red-700 text-white">
                                            {isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Stats & Order History */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p>
                                    <h3 className="text-xl font-bold">{customer.totalOrders}</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tổng chi tiêu</p>
                                    <h3 className="text-xl font-bold">{formatCurrency(customer.totalSpent)}</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Đơn gần nhất</p>
                                    <h3 className="text-sm font-semibold">
                                        {new Date(customer.lastOrderDate).toLocaleDateString('vi-VN')}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử đơn hàng ({customerOrders.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {customerOrders.length > 0 ? (
                                <div className="rounded-md border">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                                            <tr>
                                                <th className="p-3">Mã đơn</th>
                                                <th className="p-3">Ngày đặt</th>
                                                <th className="p-3">Trạng thái</th>
                                                <th className="p-3 text-right">Tổng tiền</th>
                                                <th className="p-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {customerOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                                                    <td className="p-3 font-medium">{order.id}</td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {new Date(order.createdAt).toLocaleString('vi-VN', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="p-3">
                                                        <OrderStatusBadge status={order.status} />
                                                    </td>
                                                    <td className="p-3 text-right font-medium">
                                                        {formatCurrency(order.totalAmount)}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/admin/orders/${order.id}`}>
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Khách hàng chưa có đơn hàng nào.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div >
    );
}
