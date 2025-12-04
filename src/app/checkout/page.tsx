"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";
import { createOrder } from "@/services/order";

export default function CheckoutPage() {
  const router = useRouter();
  // 👇 Lấy selectedCheckoutIds từ store
  const { items, removeFromCart, selectedCheckoutIds } = useCartStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "", note: "" });

  useEffect(() => setIsMounted(true), []);

  // 👇 LOGIC QUAN TRỌNG: Lọc ra các món cần thanh toán
  const checkoutItems = items.filter(item => selectedCheckoutIds.includes(item.uniqueId));

  // Tính tổng tiền
  const checkoutTotal = checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Nếu không có món nào (F5 mất state hoặc vào thẳng link) -> Quay về giỏ
  useEffect(() => {
    if (isMounted && checkoutItems.length === 0) {
      router.push("/cart");
    }
  }, [isMounted, checkoutItems, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        shippingAddress: formData.address,
        note: formData.note,
        items: checkoutItems, // 👉 Chỉ gửi các món đã lọc
        totalAmount: checkoutTotal, // 👉 Chỉ gửi tổng tiền đã lọc
      });

      // Thành công: Xóa các món ĐÃ MUA khỏi giỏ (giữ lại món chưa tick)
      checkoutItems.forEach(item => removeFromCart(item.uniqueId));
      
      router.push("/checkout/success");

    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted || checkoutItems.length === 0) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 md:px-10 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 uppercase text-center">Thanh toán</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
            
            {/* Form điền thông tin (Giữ nguyên) */}
            <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4">📍 Thông tin giao hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input required name="name" onChange={handleChange} className="border rounded px-3 py-2" placeholder="Họ tên *" />
                    <input required name="phone" onChange={handleChange} className="border rounded px-3 py-2" placeholder="Số điện thoại *" />
                </div>
                <input required name="email" onChange={handleChange} className="border rounded px-3 py-2 w-full mb-4" placeholder="Email *" />
                <input required name="address" onChange={handleChange} className="border rounded px-3 py-2 w-full mb-4" placeholder="Địa chỉ nhận hàng *" />
                <textarea name="note" onChange={handleChange} className="border rounded px-3 py-2 w-full h-24" placeholder="Ghi chú..." />
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="w-full lg:w-1/3">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                    <h2 className="text-lg font-bold mb-4">Đơn hàng ({checkoutItems.length} món)</h2>
                    
                    <div className="max-h-60 overflow-y-auto mb-4 pr-2 space-y-3">
                        {checkoutItems.map((item) => (
                            <div key={item.uniqueId} className="flex justify-between text-sm border-b border-dashed pb-2">
                                <div>
                                    <p className="font-medium line-clamp-1">{item.name}</p>
                                    <p className="text-gray-500 text-xs">{item.variant.color}, {item.variant.size} x {item.quantity}</p>
                                </div>
                                <div className="font-medium text-gray-700">
                                    {(item.price * item.quantity).toLocaleString()}đ
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                        <span className="text-base font-bold text-gray-800">Tổng thanh toán:</span>
                        <span className="text-xl font-bold text-[#FF5E4D]">{checkoutTotal.toLocaleString()}đ</span>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF5E4D] text-white py-3 rounded font-bold mt-6 hover:bg-orange-600 transition-colors disabled:opacity-70"
                    >
                        {loading ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"}
                    </button>
                </div>
            </div>

        </form>
      </div>
      <Footer />
    </main>
  );
}