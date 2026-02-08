"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import EmptyState from "@/components/common/EmptyState";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const router = useRouter();
  // 👇 Chỉ cần lấy items từ store để check empty
  const { items } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 md:px-10 py-8">
        <div className="text-sm text-gray-500 mb-6">
          Trang chủ <span className="mx-2">&gt;</span> <span className="text-[#FF5E4D]">Giỏ hàng</span>
        </div>

        {items.length === 0 ? (
          <EmptyState title="Giỏ hàng trống" description="Hãy chọn mua vài món đồ ưng ý nhé!" />
        ) : (
          <div className="flex flex-col gap-4">
            {/* Header Bảng */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-white p-4 rounded-lg shadow-sm text-gray-500 text-sm font-medium items-center">
              <div className="col-span-6 pl-8">Sản phẩm</div>
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
                />
              ))}
            </div>

            {/* Thanh thanh toán */}
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}