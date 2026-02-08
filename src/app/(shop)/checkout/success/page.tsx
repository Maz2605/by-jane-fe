"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Home, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti"; // Thư viện pháo giấy
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";

export default function SuccessPage() {
  const { clearCart } = useCartStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 1. Dọn dẹp giỏ hàng (Fail-safe: đảm bảo cart sạch sẽ)
    // Lưu ý: Nếu ở CheckoutPage bạn đã xóa item đã mua thì ở đây có thể không cần, 
    // nhưng gọi clearCart() ở đây là best practice để reset state cho phiên mua sắm mới.
    // clearCart(); 
    const sound = new Audio('/sounds/click.mp3');
    sound.play();

    // 2. Kích hoạt hiệu ứng Confetti (Pháo giấy)
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Bắn từ 2 bên góc dưới lên
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // 3. Trigger Animation hiển thị nội dung
    // Timeout nhỏ để đảm bảo DOM đã paint xong nền, giúp transition mượt hơn
    const timer = setTimeout(() => setShowContent(true), 100);

    return () => {
        clearInterval(interval);
        clearTimeout(timer);
    };
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Dùng flex-grow để đẩy footer xuống đáy 
         Dùng animate-in để tạo cảm giác nội dung "trôi" vào thay vì hiện tức thì
      */}
      <div className="container mx-auto px-4 py-12 md:py-20 flex-grow flex items-center justify-center">
        
        <div 
            className={`
                bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full mx-auto border border-gray-100 text-center
                transition-all duration-700 ease-out transform
                ${showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}
            `}
        >
            {/* Icon với hiệu ứng Pulse nhẹ */}
            <div className="relative mb-8 inline-block">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20 duration-1000"></div>
                <div className="relative w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-inner">
                    <CheckCircle size={48} strokeWidth={2.5} className={`transition-all duration-700 ${showContent ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
                </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">Đặt hàng thành công!</h1>
            
            <p className="text-gray-500 mb-10 leading-relaxed">
                Cảm ơn bạn đã tin tưởng <span className="font-semibold text-gray-700">ByJane</span>.<br/>
                Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
            </p>

            {/* Các button hành động */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                    href="/products" 
                    className="group px-8 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-900/20 font-semibold flex items-center justify-center gap-2"
                >
                    <ShoppingBag size={18} />
                    Tiếp tục mua sắm
                </Link>

                <Link 
                    href="/" 
                    className="px-8 py-3.5 bg-white text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all font-semibold flex items-center justify-center gap-2"
                >
                    <Home size={18} />
                    Về trang chủ
                </Link>
            </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}