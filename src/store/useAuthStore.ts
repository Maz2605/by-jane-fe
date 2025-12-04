import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Định nghĩa chuẩn User (Bao gồm cả các trường mặc định và trường mới thêm)
// Thêm từ khóa 'export' để các file khác có thể import dùng ké
export interface User {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  
  // Các trường mở rộng (Optional vì user cũ có thể chưa có)
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: any; // Sau này có thể định nghĩa kỹ hơn là { url: string, ... }
  
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  jwt: string | null;
  isLoggedIn: boolean;
  
  setAuth: (user: User, jwt: string) => void;
  logout: () => void;
  // Hàm cập nhật thông tin user mà không cần login lại (Dùng cho trang Profile)
  updateUser: (user: User) => void; 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      jwt: null,
      isLoggedIn: false,

      // Đăng nhập/Đăng ký thành công -> Lưu hết
      setAuth: (user, jwt) => set({ user, jwt, isLoggedIn: true }),

      // Đăng xuất -> Xóa sạch
      logout: () => set({ user: null, jwt: null, isLoggedIn: false }),

      // Cập nhật thông tin user (Ví dụ sau khi sửa Profile)
      updateUser: (updatedUser) => set((state) => ({
        user: { ...state.user, ...updatedUser } // Giữ lại thông tin cũ, chỉ đè thông tin mới
      })),
    }),
    {
      name: 'auth-storage', // Tên key lưu trong LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);