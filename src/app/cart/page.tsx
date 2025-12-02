"use client";
import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import EmptyState from "@/components/common/EmptyState";
import CartItemRow from "@/components/cart/CartItemRow"; // Component Mới
import CartSummary from "@/components/cart/CartSummary"; // Component Mới
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { items, removeFromCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => setIsMounted(true), []);

  // Logic chọn tất cả
  const handleSelectAll = () => {
    if (selectedItems.length === items.length) setSelectedItems([]);
    else setSelectedItems(items.map(i => i.uniqueId));
  };

  // Logic chọn lẻ
  const handleSelectItem = (uniqueId: string) => {
    if (selectedItems.includes(uniqueId)) {
      setSelectedItems(prev => prev.filter(id => id !== uniqueId));
    } else {
      setSelectedItems(prev => [...prev, uniqueId]);
    }
  };

  // Logic xóa món đã chọn
  const handleDeleteSelected = () => {
    if(confirm("Bạn có chắc muốn xóa các mục đã chọn?")) {
        selectedItems.forEach(id => removeFromCart(id));
        setSelectedItems([]);
    }
  };

  // Tính tổng tiền
  const totalSelectedPrice = items
    .filter(item => selectedItems.includes(item.uniqueId))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <div className="container mx-auto px-4 md:px-10 py-8">
        <div className="text-sm text-gray-500 mb-6">
            Trang chủ <span className="mx-2">&gt;</span> <span className="text-[#FF5E4D]">Giỏ hàng</span>
        </div>

        {items.length === 0 ? (
           <EmptyState 
             title="Giỏ hàng của bạn còn trống" 
             description="Hãy lướt dạo và chọn mua vài món đồ ưng ý nhé!" 
           />
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* Header Bảng (Chỉ hiện Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-white p-4 rounded-lg shadow-sm text-gray-500 text-sm font-medium items-center">
                <div className="col-span-6 pl-8">Sản phẩm</div> {/* pl-8 để thẳng hàng với tên sp bên dưới */}
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-1 text-center">Số tiền</div>
                <div className="col-span-1 text-center">Thao tác</div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="flex flex-col gap-3">
                {items.map((item) => (
                    <CartItemRow 
                        key={item.uniqueId} 
                        item={item} 
                        isSelected={selectedItems.includes(item.uniqueId)}
                        onSelect={handleSelectItem}
                    />
                ))}
            </div>

            {/* Thanh thanh toán */}
            <CartSummary 
                selectedItems={selectedItems}
                totalPrice={totalSelectedPrice}
                onSelectAll={handleSelectAll}
                onDeleteSelected={handleDeleteSelected}
            />

          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}