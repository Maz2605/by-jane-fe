"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Package, Truck } from "lucide-react";

const MESSAGES = [
  "Đang kết nối đến hệ thống...",
  "Đang kiểm tra tồn kho sản phẩm...",
  "Đang áp dụng mã giảm giá...",
  "Đang khởi tạo đơn hàng...",
  "Vui lòng đợi trong giây lát..."
];

const ICONS = [ShieldCheck, Package, Truck];

export default function OrderProcessingOverlay({ isLoading }: { isLoading: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    // Logic thay đổi text thông báo mỗi 1.5 giây để user đỡ chán
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1500);

    // Logic thay đổi icon nền (trang trí)
    const iconInterval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % ICONS.length);
    }, 2000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(iconInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  const CurrentIcon = ICONS[iconIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Container chính */}
      <div className="relative bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full text-center overflow-hidden">
        
        {/* Background animation nhẹ (trang trí) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 animate-loading-bar"></div>
        
        {/* Main Spinner */}
        <div className="relative flex justify-center mb-6">
          <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-orange-50 p-4 rounded-full border border-orange-100">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Đang xử lý đơn hàng
        </h3>

        {/* Dynamic Text Message */}
        <div className="h-6 overflow-hidden relative">
            <p 
                key={messageIndex} // Key thay đổi để kích hoạt animation
                className="text-sm text-gray-500 animate-in slide-in-from-bottom-2 fade-in duration-300 absolute w-full left-0 top-0"
            >
                {MESSAGES[messageIndex]}
            </p>
        </div>

        {/* Icon trang trí mờ bên dưới (Optional) */}
        <div className="absolute -bottom-6 -right-6 text-gray-50 opacity-50 rotate-12">
            <CurrentIcon className="w-24 h-24 transition-all duration-500" />
        </div>
      </div>
    </div>
  );
}