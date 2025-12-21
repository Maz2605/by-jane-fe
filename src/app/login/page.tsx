"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, LogIn 
} from "lucide-react";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import ToastNotification from "@/components/ui/ToastNotification";

export default function LoginPage() {
  const router = useRouter();
  
  // ✅ FIX 1: Tách selector ra như bài trước để tránh lỗi Infinite Loop
  const setAuth = useAuthStore((state) => state.setAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  // --- GUARD LOGIC ---
  // Chỉ redirect nếu user vào trang khi ĐÃ login từ trước
  useLayoutEffect(() => {
    if (isLoggedIn) {
      router.replace("/"); 
    }
  }, [isLoggedIn, router]);

  // State
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toast State
  const [toastState, setToastState] = useState<{
    isOpen: boolean;
    type: 'success' | 'warning' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const handleCloseToast = () => setToastState(prev => ({ ...prev, isOpen: false }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    handleCloseToast();

    try {
      const res = await login(formData.email, formData.password);
      
      if (res.jwt) {
        // ✅ QUAN TRỌNG: CHƯA update setAuth vội!
        // Nếu update ngay, useLayoutEffect ở trên sẽ chạy và redirect ngay lập tức -> Mất Toast.
        
        // 1. Hiện Toast trước
        setToastState({
          isOpen: true,
          type: 'success',
          title: 'Đăng nhập thành công',
          message: `Chào mừng ${res.user.username} quay trở lại!`,
        });

        // 2. Đợi 1000ms (1 giây) cho Toast hiện đẹp đẽ rồi mới cập nhật Store & Redirect
        setTimeout(() => {
          setAuth(res.user, res.jwt); // Cập nhật Store (Lúc này mới tính là đã login)
          router.replace("/");        // Chuyển trang
          router.refresh();           // Refresh header
        }, 1000);

      } else {
        throw new Error("Thông tin đăng nhập không chính xác.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setToastState({
        isOpen: true,
        type: 'error',
        title: 'Đăng nhập thất bại',
        message: err.message || "Email hoặc mật khẩu không đúng.",
      });
      setLoading(false); // Chỉ tắt loading khi lỗi
    }
  };


  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <div className="grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden">
            
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF5E4D] to-orange-400"></div>

            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 mb-4">
                    <LogIn className="w-6 h-6 text-[#FF5E4D]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
                <p className="text-sm text-gray-500 mt-2">Chào mừng bạn quay trở lại!</p>
            </div>
          
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                            type="email" 
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all placeholder-gray-400"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <Link href="/forgot-password" tabIndex={-1} className="text-xs font-medium text-[#FF5E4D] hover:text-orange-600 transition-colors">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            required
                            className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all placeholder-gray-400"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            
                {/* Submit Button */}
                <button 
                    disabled={loading}
                    className={`
                        w-full flex items-center justify-center py-3 rounded-lg font-bold text-white shadow-md transition-all
                        ${loading 
                            ? 'bg-orange-300 cursor-wait' 
                            : 'bg-[#FF5E4D] hover:bg-orange-600 hover:shadow-lg transform active:scale-[0.98]'
                        }
                    `}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            Đăng nhập <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="font-semibold text-[#FF5E4D] hover:text-orange-600 transition-colors">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
      </div>
      
      <Footer />

      <ToastNotification 
        isOpen={toastState.isOpen}
        type={toastState.type}
        title={toastState.title}
        message={toastState.message}
        onClose={handleCloseToast}
      />
    </main>
  );
}