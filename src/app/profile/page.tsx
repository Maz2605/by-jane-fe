"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, MapPin, Phone, Mail, Save, Camera, 
  LogOut, ShoppingBag, Lock, Loader2 
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { updateProfile } from "@/services/auth";

export default function ProfilePage() {
  const router = useRouter();
  // Lấy các hàm và dữ liệu từ Store
  const { user, jwt, isLoggedIn, logout, updateUser } = useAuthStore();
  
  // State quản lý trạng thái
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // State form dữ liệu
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    email: "",
  });

  // 1. CHECK AUTH & LOAD DATA
  useEffect(() => {
    // Nếu chưa đăng nhập -> Đá về trang Login
    if (!isLoggedIn || !user) {
      router.push("/login");
      return;
    }

    // Điền thông tin user hiện tại vào form
    setFormData({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      email: user.email || "",
    });
  }, [isLoggedIn, user, router]);

  // 2. XỬ LÝ NHẬP LIỆU
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Xóa thông báo khi người dùng bắt đầu sửa lại
    if (errorMsg) setErrorMsg("");
    if (successMsg) setSuccessMsg("");
  };

  // 3. XỬ LÝ LƯU THAY ĐỔI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (!user || !jwt) return;

      // Gọi API cập nhật lên Server
      const updatedUserData = await updateProfile(user.id, {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      }, jwt);

      // Cập nhật lại Store ở Client (để Header tự đổi tên mới)
      updateUser(updatedUserData);
      
      setSuccessMsg("Cập nhật thông tin thành công!");
      
      // Tự tắt thông báo sau 3 giây
      setTimeout(() => setSuccessMsg(""), 3000);

    } catch (error: any) {
      console.error("Lỗi update:", error);
      setErrorMsg("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // 4. XỬ LÝ ĐĂNG XUẤT
  const handleLogout = () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
        logout(); // Xóa token
        router.push("/"); // Về trang chủ
    }
  };

  // Tránh flash giao diện khi chưa check xong user
  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <div className="container mx-auto px-4 md:px-10 py-10">
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center uppercase">
            Hồ sơ của tôi
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* --- CỘT TRÁI: MENU & AVATAR --- */}
            <div className="md:col-span-1 space-y-6">
              
              {/* Card Avatar */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    <User size={40} className="text-gray-400" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-[#FF5E4D] text-white p-1.5 rounded-full hover:bg-orange-600 transition-colors shadow-sm">
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="font-bold text-lg text-gray-800 truncate">{user.username}</h2>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>

              {/* Menu điều hướng */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <nav className="flex flex-col">
                    <button className="flex items-center gap-3 text-left px-6 py-3 text-sm font-medium text-[#FF5E4D] bg-orange-50 border-l-4 border-[#FF5E4D]">
                        <User size={18} /> Thông tin tài khoản
                    </button>
                    <button className="flex items-center gap-3 text-left px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                        <ShoppingBag size={18} /> Lịch sử đơn hàng
                    </button>
                    <button className="flex items-center gap-3 text-left px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                        <Lock size={18} /> Đổi mật khẩu
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-left px-6 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2"
                    >
                        <LogOut size={18} /> Đăng xuất
                    </button>
                </nav>
              </div>
            </div>

            {/* --- CỘT PHẢI: FORM CHỈNH SỬA --- */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-800 mb-6 pb-4 border-b border-gray-100">
                    Chỉnh sửa thông tin
                </h3>

                {/* Thông báo trạng thái */}
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded border border-green-100">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Họ tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <User size={16} /> Họ và tên
                        </label>
                        <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all"
                            placeholder="Nhập họ tên của bạn"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email (Disabled) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Mail size={16} /> Email
                            </label>
                            <input 
                                type="email" 
                                value={formData.email}
                                disabled
                                className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Phone size={16} /> Số điện thoại
                            </label>
                            <input 
                                type="text" 
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                    </div>

                    {/* Địa chỉ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <MapPin size={16} /> Địa chỉ giao hàng mặc định
                        </label>
                        <textarea 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#FF5E4D] focus:ring-1 focus:ring-[#FF5E4D] transition-all h-24 resize-none"
                            placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..."
                        />
                    </div>

                    {/* Nút Lưu */}
                    <div className="pt-4 flex justify-end border-t border-gray-100 mt-6">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-[#FF5E4D] text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}