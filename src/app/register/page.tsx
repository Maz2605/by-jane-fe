"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { register } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await register(formData.username, formData.email, formData.password);
      
      if (res.jwt) {
        setAuth(res.user, res.jwt);
        alert("Đăng ký thành công!");
        router.push("/");
      } else {
        // Strapi trả về lỗi chi tiết trong res.error
        setError(res.error?.message || "Đăng ký thất bại");
      }
    } catch (err) {
      setError("Email hoặc tên đăng nhập đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-100">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng ký tài khoản</h1>
          
          {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị</label>
              <input 
                required
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF5E4D]"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF5E4D]"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input 
                type="password" 
                required
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#FF5E4D]"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <button 
                disabled={loading}
                className="w-full bg-[#FF5E4D] text-white py-2.5 rounded font-bold hover:bg-orange-600 transition-colors disabled:opacity-70"
            >
                {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản? <Link href="/login" className="text-[#FF5E4D] font-medium hover:underline">Đăng nhập</Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}