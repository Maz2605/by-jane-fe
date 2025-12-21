"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, MapPin, Phone, Mail, Save, Camera, 
  LogOut, Loader2, Lock, ShieldCheck, Eye, EyeOff
} from "lucide-react";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { updateProfile, changePassword } from "@/services/auth";
import ToastNotification from "@/components/ui/ToastNotification";

// Định nghĩa các loại Tab
type TabType = 'info' | 'security';

export default function ProfilePage() {
  const router = useRouter();
  const { user, jwt, isLoggedIn, logout, updateUser } = useAuthStore();
  
  // --- STATE QUẢN LÝ ---
  const [activeTab, setActiveTab] = useState<TabType>('info'); // Mặc định là tab Info
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  
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

  // Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    email: "",
  });

  const [passData, setPassData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirmation: "",
  });

  const getVietnameseError = (message: string) => {
  const msg = message.toLowerCase();

  if (msg.includes("must be different than your current")) {
    return "Mật khẩu mới không được trùng với mật khẩu cũ.";
  }
  if (msg.includes("current password") && (msg.includes("invalid") || msg.includes("incorrect"))) {
    return "Mật khẩu hiện tại không chính xác.";
  }
  if (msg.includes("confirmation") || msg.includes("match")) {
    return "Mật khẩu xác nhận không khớp.";
  }
  
  if (msg.includes("at least")) {
    return "Mật khẩu phải có ít nhất 6 ký tự.";
  }
  if (msg.includes("taken") || msg.includes("exist")) {
    return "Email hoặc tên đăng nhập đã tồn tại.";
  }

  return "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
};

// --- STATE QUẢN LÝ ẨN/HIỆN MẬT KHẨU ---
  // Dùng object để quản lý 3 ô độc lập
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Helper function để toggle (bật/tắt)
  const toggleShowPass = (field: 'current' | 'new' | 'confirm') => {
    setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // --- HANDLERS & EFFECT ---
  const handleCloseToast = () => setToastState(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.push("/login");
      return;
    }
    setFormData({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      email: user.email || "",
    });
  }, [isLoggedIn, user, router]);

  const handleChangeInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  // --- SUBMIT INFO ---
  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingInfo(true);
    handleCloseToast();

    try {
      if (!user || !jwt) return;
      const updatedUserData = await updateProfile(user.id, {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      }, jwt);
      updateUser(updatedUserData);
      setToastState({ isOpen: true, type: 'success', title: 'Thành công', message: 'Thông tin đã được cập nhật.' });
    } catch (error) {
      setToastState({ isOpen: true, type: 'error', title: 'Lỗi', message: 'Không thể cập nhật thông tin.' });
    } finally {
      setLoadingInfo(false);
    }
  };

  // --- SUBMIT PASSWORD ---
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Client-side (Giữ nguyên)
    if (passData.password !== passData.passwordConfirmation) {
      setToastState({ isOpen: true, type: 'error', title: 'Lỗi', message: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    if (passData.password.length < 6) {
        setToastState({ isOpen: true, type: 'error', title: 'Lỗi', message: 'Mật khẩu phải từ 6 ký tự trở lên.' });
        return;
    }

    setLoadingPass(true);
    handleCloseToast();

    try {
      if (!jwt) return;
      await changePassword(passData.currentPassword, passData.password, passData.passwordConfirmation, jwt);
      
      // Thành công
      setPassData({ currentPassword: "", password: "", passwordConfirmation: "" });
      setToastState({ 
        isOpen: true, 
        type: 'success', 
        title: 'Thành công', 
        message: 'Mật khẩu đã được thay đổi.' 
      });

    } catch (error: any) {
      console.error("Change Pass Error:", error);
      
      // --- SỬA ĐOẠN NÀY ---
      // Lấy message gốc từ Strapi
      const originalMessage = error.message || "";
      // Dịch sang tiếng Việt
      const vietnameseMessage = getVietnameseError(originalMessage);

      setToastState({ 
        isOpen: true, 
        type: 'error', 
        title: 'Đổi mật khẩu thất bại', 
        message: vietnameseMessage 
      });
    } finally {
      setLoadingPass(false);
    }
  };

  const handleLogout = () => {
    setToastState({ isOpen: true, type: 'warning', title: 'Đăng xuất', message: 'Hẹn gặp lại bạn!' });
    setTimeout(() => { logout(); router.push("/"); }, 1500);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Header />
      
      <div className="container mx-auto px-4 md:px-10 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center uppercase">
            Hồ sơ của tôi
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* --- CỘT TRÁI: SIDEBAR & AVATAR --- */}
            <div className="md:col-span-1 space-y-6">
              {/* Avatar Box */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    <User size={40} className="text-gray-400" />
                  </div>
                  {/* <button className="absolute bottom-0 right-0 bg-[#FF5E4D] text-white p-1.5 rounded-full hover:bg-orange-600 transition-colors shadow-sm">
                    <Camera size={14} />
                  </button> */}
                </div>
                <h2 className="font-bold text-lg text-gray-800 truncate">{user.username}</h2>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <nav className="flex flex-col">
                    {/* TAB 1: THÔNG TIN */}
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`
                            flex items-center gap-3 text-left px-6 py-3.5 text-sm font-medium transition-all
                            ${activeTab === 'info' 
                                ? 'text-[#FF5E4D] bg-orange-50 border-l-4 border-[#FF5E4D]' 
                                : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}
                        `}
                    >
                        <User size={18} /> Thông tin chung
                    </button>

                    {/* TAB 2: BẢO MẬT (MỚI) */}
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`
                            flex items-center gap-3 text-left px-6 py-3.5 text-sm font-medium transition-all
                            ${activeTab === 'security' 
                                ? 'text-[#FF5E4D] bg-orange-50 border-l-4 border-[#FF5E4D]' 
                                : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}
                        `}
                    >
                        <ShieldCheck size={18} /> Mật khẩu & Bảo mật
                    </button>

                    {/* LOGOUT */}
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 text-left px-6 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2"
                    >
                        <LogOut size={18} /> Đăng xuất
                    </button>
                </nav>
              </div>
            </div>

            {/* --- CỘT PHẢI: CONTENT --- */}
            <div className="md:col-span-2">
              
              {/* LOGIC HIỂN THỊ DỰA TRÊN TAB */}
              
              {/* === CONTENT TAB 1: INFO === */}
              {activeTab === 'info' && (
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 animate-enter">
                    <h3 className="font-bold text-lg text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                        <User className="text-[#FF5E4D]" size={20} /> Chỉnh sửa thông tin
                    </h3>

                    <form onSubmit={handleSubmitInfo} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                            <input 
                                type="text" name="fullName" value={formData.fullName} onChange={handleChangeInfo}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" value={formData.email} disabled className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                <input 
                                    type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChangeInfo}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                            <textarea 
                                name="address" value={formData.address} onChange={handleChangeInfo}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all h-24 resize-none"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" disabled={loadingInfo}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white shadow-md transition-all ${loadingInfo ? 'bg-orange-300 cursor-wait' : 'bg-[#FF5E4D] hover:bg-orange-600 hover:shadow-lg'}`}
                            >
                                {loadingInfo ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {loadingInfo ? "Đang lưu..." : "Lưu thông tin"}
                            </button>
                        </div>
                    </form>
                </div>
              )}

              {/* === CONTENT TAB 2: SECURITY === */}
              {activeTab === 'security' && (
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 animate-enter">
                    <h3 className="font-bold text-lg text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                        <ShieldCheck className="text-[#FF5E4D]" size={20} /> Bảo mật & Mật khẩu
                    </h3>

                    <form onSubmit={handleSubmitPassword} className="space-y-6">
                        
                        {/* 1. MẬT KHẨU HIỆN TẠI */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                            <div className="relative">
                                {/* Icon Lock bên trái */}
                                <Lock size={18} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                                
                                <input 
                                    // Logic: Nếu showPass.current = true thì hiện text, ngược lại hiện password
                                    type={showPass.current ? "text" : "password"} 
                                    name="currentPassword" 
                                    value={passData.currentPassword} 
                                    onChange={handleChangePass} 
                                    required
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all"
                                    placeholder="••••••••"
                                />

                                {/* Nút Bật/Tắt Mắt bên phải */}
                                <button
                                    type="button" // QUAN TRỌNG: Phải là button type="button" để không submit form
                                    onClick={() => toggleShowPass('current')}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 2. MẬT KHẨU MỚI */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                                    <input 
                                        type={showPass.new ? "text" : "password"} 
                                        name="password" 
                                        value={passData.password} 
                                        onChange={handleChangePass} 
                                        required 
                                        placeholder="Tối thiểu 6 ký tự"
                                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleShowPass('new')}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* 3. XÁC NHẬN MẬT KHẨU */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                                    <input 
                                        type={showPass.confirm ? "text" : "password"} 
                                        name="passwordConfirmation" 
                                        value={passData.passwordConfirmation} 
                                        onChange={handleChangePass} 
                                        required 
                                        placeholder="Nhập lại lần nữa"
                                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleShowPass('confirm')}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" disabled={loadingPass}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all ${loadingPass ? 'cursor-wait opacity-70' : ''}`}
                            >
                                {loadingPass ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                                {loadingPass ? "Đang xử lý..." : "Đổi mật khẩu"}
                            </button>
                        </div>
                    </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ToastNotification isOpen={toastState.isOpen} type={toastState.type} title={toastState.title} message={toastState.message} onClose={handleCloseToast} />
    </main>
  );
}