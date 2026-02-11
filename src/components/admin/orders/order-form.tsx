"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MOCK_CUSTOMERS } from "@/lib/mock-data/customers";
import { MOCK_PRODUCTS } from "@/lib/mock-data/products";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2, Search, Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface OrderItem {
    productId: string;
    productName: string;
    variantName?: string;
    sku: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

export function OrderForm() {
    const router = useRouter();
    const [selectedCustomer, setSelectedCustomer] = useState<string>("guest");
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isProductPopoverOpen, setIsProductPopoverOpen] = useState(false);
    const [isCustomerPopoverOpen, setIsCustomerPopoverOpen] = useState(false);

    // Variant Selection State
    const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
    const [pendingProduct, setPendingProduct] = useState<any>(null);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    // Calculate totals
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000; // Mock logic: Free ship > 500k
    const total = subtotal + shippingFee;

    const handleProductSelect = (productId: string) => {
        const product = MOCK_PRODUCTS.find((p) => p.id === productId);
        if (!product) return;

        if (product.variants && product.variants.length > 0) {
            setPendingProduct(product);
            setSelectedVariant(product.variants[0]);
            setIsVariantDialogOpen(true);
            setIsProductPopoverOpen(false);
        } else {
            addItemToCart(product);
            setIsProductPopoverOpen(false);
        }
    };

    const confirmVariantSelection = () => {
        if (pendingProduct && selectedVariant) {
            addItemToCart(pendingProduct, selectedVariant);
            setIsVariantDialogOpen(false);
            setPendingProduct(null);
            setSelectedVariant(null);
        }
    };

    const addItemToCart = (product: any, variant?: any) => {
        const itemId = variant ? `${product.id}-${variant.sku}` : product.id;
        const itemName = product.name;
        const itemVariantName = variant ? variant.name : undefined;
        const itemSku = variant ? variant.sku : product.sku;
        const itemPrice = variant ? variant.price : product.price;

        const existingItemIndex = selectedItems.findIndex(item => item.sku === itemSku);

        if (existingItemIndex > -1) {
            const newItems = [...selectedItems];
            newItems[existingItemIndex].quantity += 1;
            setSelectedItems(newItems);
        } else {
            setSelectedItems([
                ...selectedItems,
                {
                    productId: product.id,
                    productName: itemName,
                    variantName: itemVariantName,
                    sku: itemSku,
                    price: itemPrice,
                    quantity: 1,
                    thumbnail: product.thumbnail,
                },
            ]);
        }
    };

    const handleUpdateQuantity = (sku: string, quantity: number) => {
        if (quantity < 1) return;
        setSelectedItems(
            selectedItems.map((item) =>
                item.sku === sku ? { ...item, quantity } : item
            )
        );
    };

    const handleRemoveItem = (sku: string) => {
        setSelectedItems(selectedItems.filter((item) => item.sku !== sku));
    };

    const handleSubmit = () => {
        if (!selectedCustomer) {
            showErrorToast("Vui lòng chọn khách hàng");
            return;
        }
        if (selectedItems.length === 0) {
            showErrorToast("Vui lòng thêm sản phẩm vào đơn hàng");
            return;
        }
        if (!shippingAddress) {
            showErrorToast("Vui lòng nhập địa chỉ giao hàng");
            return;
        }

        // Mock submission
        showSuccessToast("Tạo đơn hàng thành công!");

        // Delay navigation to allow toast to be seen
        setTimeout(() => {
            router.push("/admin/orders");
        }, 1000);
    };

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Chi tiết đơn hàng</CardTitle>
                        <CardDescription>
                            Thêm sản phẩm và điều chỉnh số lượng
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Popover open={isProductPopoverOpen} onOpenChange={setIsProductPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                                        <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Tìm kiếm sản phẩm..." />
                                        <CommandList>
                                            <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
                                            <CommandGroup>
                                                {MOCK_PRODUCTS.map((product) => (
                                                    <CommandItem
                                                        key={product.id}
                                                        value={product.name || ""}
                                                        onSelect={() => handleProductSelect(product.id)}
                                                    >
                                                        <div className="flex items-center gap-2 w-full">
                                                            <div className="relative h-8 w-8 rounded overflow-hidden">
                                                                <Image
                                                                    src={product.thumbnail || ""}
                                                                    alt={product.name || ""}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span>{product.name}</span>
                                                                <span className="text-muted-foreground text-xs">{product.sku} - {formatCurrency(product.price)}</span>
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Hình ảnh</TableHead>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead className="w-[100px]">Đơn giá</TableHead>
                                        <TableHead className="w-[100px]">Số lượng</TableHead>
                                        <TableHead className="w-[100px]">Thành tiền</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedItems.length > 0 ? (
                                        selectedItems.map((item) => (
                                            <TableRow key={item.sku}>
                                                <TableCell>
                                                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                                                        <Image
                                                            src={item.thumbnail}
                                                            alt={item.productName}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{item.productName}</span>
                                                        {item.variantName && (
                                                            <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md w-fit mt-0.5">
                                                                {item.variantName}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-muted-foreground">{item.sku}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatCurrency(item.price)}</TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleUpdateQuantity(item.sku, parseInt(e.target.value))}
                                                        className="w-20"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveItem(item.sku)}
                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                Chưa có sản phẩm nào được chọn
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ghi chú đơn hàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Ghi chú cho đơn hàng..."
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Khách hàng & Giao hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Khách hàng</Label>
                            <Popover open={isCustomerPopoverOpen} onOpenChange={setIsCustomerPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isCustomerPopoverOpen}
                                        className="w-full justify-between h-auto py-3"
                                    >
                                        {selectedCustomer ? (
                                            selectedCustomer === "guest" ? (
                                                <span className="font-semibold text-blue-600">Khách vãng lai</span>
                                            ) : (
                                                (() => {
                                                    const customer = MOCK_CUSTOMERS.find(c => c.id === selectedCustomer);
                                                    return customer ? (
                                                        <div className="flex flex-col text-left">
                                                            <span>{customer.name}</span>
                                                            <span className="text-xs text-muted-foreground">{customer.email}</span>
                                                        </div>
                                                    ) : "Chọn khách hàng";
                                                })()
                                            )
                                        ) : (
                                            "Chọn khách hàng"
                                        )}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Tìm kiếm khách hàng..." />
                                        <CommandList>
                                            <CommandEmpty>Không tìm thấy khách hàng.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="guest"
                                                    onSelect={() => {
                                                        setSelectedCustomer("guest");
                                                        setCustomerName("");
                                                        setCustomerEmail("");
                                                        setCustomerPhone("");
                                                        setShippingAddress("");
                                                        setIsCustomerPopoverOpen(false);
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedCustomer === "guest" ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <span className="font-semibold text-blue-600">Khách vãng lai</span>
                                                </CommandItem>
                                                {MOCK_CUSTOMERS.map((customer) => (
                                                    <CommandItem
                                                        key={customer.id}
                                                        value={`${customer.name} ${customer.email} ${customer.phone} ${customer.id}`}
                                                        onSelect={() => {
                                                            setSelectedCustomer(customer.id);
                                                            setCustomerName(customer.name);
                                                            setCustomerEmail(customer.email);
                                                            setCustomerPhone(customer.phone);
                                                            setShippingAddress(customer.address || "");
                                                            setIsCustomerPopoverOpen(false);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedCustomer === customer.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex flex-col text-left">
                                                            <span>{customer.name}</span>
                                                            <span className="text-xs text-muted-foreground">{customer.email}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Customer Info Fields */}
                        <div className="space-y-4 pt-2 border-t">
                            <div className="space-y-2">
                                <Label>Tên khách hàng</Label>
                                <Input
                                    placeholder="Nhập tên khách hàng"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                // disabled={selectedCustomer !== "guest"} // Optional: disable if registered user
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Số điện thoại</Label>
                                <Input
                                    placeholder="Nhập số điện thoại"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    placeholder="Nhập email"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Địa chỉ giao hàng</Label>
                            <Input
                                placeholder="Nhập địa chỉ đầy đủ"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Phương thức thanh toán</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger className="pointer-events-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="COD">Thanh toán khi nhận hàng (COD)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tổng quan đơn hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tạm tính</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Phí vận chuyển</span>
                            <span>{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Tổng cộng</span>
                            <span className="text-orange-600">{formatCurrency(total)}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleSubmit}>
                            Tạo đơn hàng
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => router.push("/admin/orders")}>
                            Hủy bỏ
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div >
    );
}
