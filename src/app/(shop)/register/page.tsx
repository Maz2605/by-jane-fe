"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  User, Mail, Lock, Eye, EyeOff, Loader2, UserPlus, ArrowRight
} from "lucide-react";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { register } from "@/services/auth";
import ToastNotification from "@/components/ui/ToastNotification";

export default function RegisterPage() {
  const router = useRouter();

  // --- STATE ---
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
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

  // Prefetch Home
  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const handleCloseToast = () => setToastState(prev => ({ ...prev, isOpen: false }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    handleCloseToast();

    try {
      // 1. Register user with Strapi
      const res = await register(formData.username, formData.email, formData.password);

      if (res.jwt) {
        // 2. Show success toast
        setToastState({
          isOpen: true,
          type: 'success',
          title: 'Đăng ký thành công',
          message: `Chào mừng ${res.user.username} gia nhập hệ thống!`,
        });

        // 3. Wait for toast, then auto-login using NextAuth
        setTimeout(async () => {
          const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });

          if (result?.ok) {
            router.replace("/");
            router.refresh();
          }
        }, 1000);

      } else {
        const errorMsg = res.error?.message || "Đăng ký thất bại. Vui lòng thử lại.";
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error("Register Error:", err);
      setToastState({
        isOpen: true,
        type: 'error',
        title: 'Đăng ký thất bại',
        message: err.message || "Email hoặc tên đăng nhập đã tồn tại.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden">

          {/* Decoration Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF5E4D] to-orange-400"></div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 mb-4">
              <UserPlus className="w-6 h-6 text-[#FF5E4D]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo tài khoản mới</h1>
            <p className="text-sm text-gray-500 mt-2">Nhập thông tin để bắt đầu hành trình mua sắm</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên hiển thị</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: NguyenVanA"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all text-gray-900 placeholder-gray-400"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all text-gray-900 placeholder-gray-400"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all text-gray-900 placeholder-gray-400"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Password Hint (Optional) */}
              <p className="mt-1 text-xs text-gray-500">Mật khẩu nên bao gồm chữ và số.</p>
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
                  Đang tạo tài khoản...
                </>
              ) : (
                <>
                  Đăng ký ngay <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-semibold text-[#FF5E4D] hover:text-orange-600 transition-colors">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastNotification
        isOpen={toastState.isOpen}
        type={toastState.type}
        title={toastState.title}
        message={toastState.message}
        onClose={handleCloseToast}
      />
    </div>
  );
}