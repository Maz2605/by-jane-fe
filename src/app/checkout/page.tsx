"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Ticket, X, Loader2, ChevronRight } from "lucide-react"; // Đảm bảo đã cài: npm install lucide-react
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";
import { createOrder } from "@/services/order";
// Import service voucher đã sửa ở bước trước
import { validateVoucher, getActiveVouchers, Voucher } from "@/services/voucher";

interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  
  // --- 1. STORE & STATE ---
  const { items, removeFromCart, selectedCheckoutIds } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "", phone: "", email: "", address: "", note: ""
  });

  // Voucher State
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Ref chặn redirect sai
  const isSuccessRef = useRef(false);

  // --- 2. TÍNH TOÁN (DERIVED STATE) ---
  const checkoutItems = useMemo(() => {
    return items.filter(item => selectedCheckoutIds.includes(item.uniqueId));
  }, [items, selectedCheckoutIds]);

  const subTotal = useMemo(() => {
    return checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [checkoutItems]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    
    // 🛡️ Safety Check: Đảm bảo value luôn là số
    const val = appliedVoucher.value || 0; 

    let discount = 0;
    if (appliedVoucher.type === "percent") {
      discount = subTotal * (val / 100);
    } else {
      discount = val;
    }

    // Không giảm quá số tiền đơn hàng
    return discount > subTotal ? subTotal : discount;
  }, [appliedVoucher, subTotal]);

  const finalTotal = subTotal - discountAmount;

  // --- 3. EFFECTS ---
  useEffect(() => setIsMounted(true), []);

  // Redirect nếu không có item (trừ khi success)
  useEffect(() => {
    if (isMounted && checkoutItems.length === 0 && !isSuccessRef.current) {
      router.push("/cart");
    }
  }, [isMounted, checkoutItems, router]);

  // Auto remove voucher nếu không đủ điều kiện min order
  useEffect(() => {
    if (appliedVoucher?.minOrderValue && subTotal < appliedVoucher.minOrderValue) {
        setAppliedVoucher(null);
        setVoucherError(`Mã ${appliedVoucher.code} đã bị hủy do đơn hàng chưa đủ ${appliedVoucher.minOrderValue.toLocaleString('vi-VN')}đ`);
    }
  }, [subTotal, appliedVoucher]);

  // Load danh sách voucher khi mở Modal
  useEffect(() => {
    if (isModalOpen && availableVouchers.length === 0) {
        setIsLoadingList(true);
        getActiveVouchers()
            .then(data => setAvailableVouchers(data))
            .catch(err => console.error("Lỗi lấy list voucher:", err))
            .finally(() => setIsLoadingList(false));
    }
  }, [isModalOpen]);

  // --- 4. HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyVoucher = async (codeOverride?: string) => {
    const codeToUse = codeOverride || voucherCode;
    if (!codeToUse.trim()) return;

    setVoucherLoading(true);
    setVoucherError("");

    try {
        const voucher = await validateVoucher(codeToUse, subTotal);
        setAppliedVoucher(voucher);
        setVoucherCode(""); // Clear input
        setIsModalOpen(false); // Đóng modal nếu đang mở
    } catch (error: any) {
        setVoucherError(error.message || "Mã không hợp lệ");
        setAppliedVoucher(null);
    } finally {
        setVoucherLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutItems.length === 0) return;
    setLoading(true);

    try {
      await createOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        shippingAddress: formData.address,
        note: formData.note, // Đảm bảo Strapi có field 'note'
        items: checkoutItems,
        totalAmount: finalTotal,
      });

      isSuccessRef.current = true;
      checkoutItems.forEach(item => removeFromCart(item.uniqueId));
      router.push("/checkout/success");

    } catch (error: any) {
      alert(error.message || "Lỗi đặt hàng");
    } finally {
      if (!isSuccessRef.current) setLoading(false);
    }
  };

  if (!isMounted || (checkoutItems.length === 0 && !isSuccessRef.current)) return null;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col relative">
      <Header />
      
      <div className="container mx-auto px-4 md:px-10 py-8 flex-grow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 uppercase text-center">Thanh toán</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Cột Trái: Thông tin */}
            <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2 border-b pb-2">📍 Thông tin giao hàng</h2>
                <div className="space-y-4">
                     <input required name="name" onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500" placeholder="Họ tên *" />
                     <input required name="phone" onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500" placeholder="Số điện thoại *" />
                     <input required name="email" onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500" placeholder="Email *" />
                     <input required name="address" onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500" placeholder="Địa chỉ *" />
                     <textarea name="note" onChange={handleChange} className="w-full border rounded px-3 py-2 h-24 outline-none focus:ring-1 focus:ring-orange-500" placeholder="Ghi chú (Giao giờ hành chính...)" />
                </div>
            </div>

            {/* Cột Phải: Tổng kết */}
            <div className="w-full lg:w-1/3 sticky top-4 space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4">Đơn hàng ({checkoutItems.length})</h2>
                    <div className="max-h-[200px] overflow-y-auto mb-4 border-b border-dashed pb-2 pr-2 custom-scrollbar">
                        {checkoutItems.map(item => (
                            <div key={item.uniqueId} className="flex justify-between text-sm mb-3">
                                <div className="flex-1 pr-2">
                                    <p className="line-clamp-1 font-medium">{item.name}</p>
                                    <p className="text-xs text-gray-400">{item.variant.color}, {item.variant.size} x{item.quantity}</p>
                                </div>
                                <span className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                            </div>
                        ))}
                    </div>

                    {/* --- KHU VỰC VOUCHER --- */}
                    <div className="pt-2">
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Ticket size={16} className="text-orange-500"/> Mã ưu đãi
                        </label>
                        
                        {!appliedVoucher ? (
                            <div className="flex gap-2">
                                <input 
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                    placeholder="Nhập mã" 
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm uppercase outline-none focus:border-orange-500"
                                />
                                <button 
                                    type="button"
                                    onClick={() => handleApplyVoucher()}
                                    disabled={voucherLoading || !voucherCode}
                                    className="px-3 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
                                >
                                    {voucherLoading ? <Loader2 className="animate-spin" size={16}/> : "Áp dụng"}
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center bg-green-50 border border-green-200 p-3 rounded-lg">
                                <div>
                                    <span className="font-bold text-green-700 flex items-center gap-1 text-sm">
                                        <Ticket size={14}/> {appliedVoucher.code}
                                    </span>
                                    {/* 👇 FIX LỖI CRASH Ở ĐÂY: Thêm || 0 */}
                                    <span className="text-xs text-green-600 block mt-0.5">
                                        {appliedVoucher.type === 'percent' 
                                            ? `Giảm ${appliedVoucher.value || 0}%` 
                                            : `Giảm ${(appliedVoucher.value || 0).toLocaleString('vi-VN')}đ`
                                        }
                                    </span>
                                </div>
                                <button onClick={() => setAppliedVoucher(null)} type="button" className="text-gray-400 hover:text-red-500 p-1">
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                        
                        {!appliedVoucher && (
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="text-sm text-orange-600 font-medium mt-3 flex items-center hover:underline"
                            >
                                <Ticket size={14} className="mr-1" /> Chọn voucher có sẵn
                            </button>
                        )}
                        
                        {voucherError && <p className="text-red-500 text-xs mt-2 flex items-center gap-1">⚠️ {voucherError}</p>}
                    </div>

                    {/* Tổng tiền */}
                    <div className="pt-4 mt-4 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600"><span>Tạm tính:</span><span>{subTotal.toLocaleString('vi-VN')}đ</span></div>
                        
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Giảm giá:</span>
                                <span>- {discountAmount.toLocaleString('vi-VN')}đ</span>
                            </div>
                        )}
                        
                        <div className="flex justify-between font-bold text-lg text-[#FF5E4D] pt-3 border-t mt-2">
                            <span>Tổng cộng:</span>
                            <span>{finalTotal.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#FF5E4D] text-white py-3.5 rounded-lg font-bold mt-6 hover:bg-[#e04f3f] disabled:bg-gray-300 transition-all shadow-md">
                        {loading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG NGAY"}
                    </button>
                </div>
            </div>
        </form>
      </div>

      {/* --- 👇 MODAL LIST VOUCHER --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">Kho Voucher</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 bg-gray-50/50 space-y-3">
                    {isLoadingList ? (
                        <div className="flex justify-center py-10 text-gray-500 gap-2"><Loader2 className="animate-spin"/> Đang tải...</div>
                    ) : availableVouchers.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">Chưa có mã giảm giá nào.</div>
                    ) : (
                        availableVouchers.map((v) => {
                            // Check điều kiện
                            const isEligible = subTotal >= v.minOrderValue;
                            const val = v.value || 0;

                            return (
                                <div key={v.id} className={`bg-white border rounded-lg p-3 flex gap-3 transition-all relative overflow-hidden ${!isEligible ? 'opacity-60 grayscale' : 'hover:border-orange-400 shadow-sm'}`}>
                                    {/* Left Decoration */}
                                    <div className="w-20 bg-orange-50 border-r border-dashed border-gray-200 flex flex-col items-center justify-center rounded-l-lg -my-3 -ml-3 py-3">
                                        <span className="text-orange-600 font-black text-lg">
                                            {v.type === 'percent' ? `${val}%` : '🎁'}
                                        </span>
                                        <span className="text-[10px] text-orange-400 uppercase font-bold mt-1">{v.type}</span>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 min-w-0 py-1">
                                        <p className="font-bold text-gray-800 text-base">{v.code}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {v.type === 'fixed' 
                                                ? `Giảm ${val.toLocaleString('vi-VN')}đ` 
                                                : `Giảm ${val}% đơn hàng`
                                            }
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            Đơn tối thiểu: {v.minOrderValue.toLocaleString('vi-VN')}đ
                                        </p>

                                        {!isEligible && (
                                            <span className="text-[10px] text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                                                Cần mua thêm {(v.minOrderValue - subTotal).toLocaleString('vi-VN')}đ
                                            </span>
                                        )}
                                    </div>

                                    {/* Button */}
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            disabled={!isEligible}
                                            onClick={() => handleApplyVoucher(v.code)}
                                            className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${isEligible ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-gray-100 text-gray-300'}`}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
      )}
      <Footer />
    </main>
  );
}