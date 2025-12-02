import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Định nghĩa kiểu dữ liệu cho 1 món hàng trong giỏ
export interface CartItem {
  id: number; // ID của sản phẩm
  uniqueId: string; // ID định danh riêng (VD: "1-M-Den") để phân biệt cùng sp nhưng khác size/màu
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number; // Tồn kho tối đa (để không cho tăng quá số lượng)
  variant: {
    size: string;
    color: string;
  };
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

// 2. Tạo Store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Hàm Thêm vào giỏ
      addToCart: (newItem) => {
        const items = get().items;
        // Kiểm tra xem món này (cùng ID, cùng size, cùng màu) đã có trong giỏ chưa
        const existingItem = items.find((i) => i.uniqueId === newItem.uniqueId);

        if (existingItem) {
          // Nếu có rồi -> Cộng dồn số lượng
          const updatedItems = items.map((i) =>
            i.uniqueId === newItem.uniqueId
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i
          );
          set({ items: updatedItems });
        } else {
          // Nếu chưa -> Thêm mới
          set({ items: [...items, newItem] });
        }
      },

      // Hàm Xóa món
      removeFromCart: (uniqueId) => {
        set({ items: get().items.filter((i) => i.uniqueId !== uniqueId) });
      },

      // Hàm Chỉnh số lượng
      updateQuantity: (uniqueId, quantity) => {
        const items = get().items;
        const newItems = items.map((item) => {
          if (item.uniqueId === uniqueId) {
            // Không cho giảm dưới 1 và không tăng quá tồn kho
            const newQty = Math.max(1, Math.min(quantity, item.maxStock));
            return { ...item, quantity: newQty };
          }
          return item;
        });
        set({ items: newItems });
      },

      // Hàm Xóa sạch
      clearCart: () => set({ items: [] }),

      // Tính tổng tiền
      totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // Đếm tổng số lượng sản phẩm (để hiện lên icon giỏ hàng)
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'shopping-cart-storage', // Tên key lưu trong localStorage
      storage: createJSONStorage(() => localStorage), // Bắt buộc dùng localStorage
    }
  )
);