import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: number;       // ID sản phẩm gốc (VD: 101)
  uniqueId: string; // ID duy nhất (VD: 101-Red-M) -> Dùng cái này để định danh
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
  variant: {
    size: string;
    color: string;
  };
}

interface CartState {
  items: CartItem[];
  selectedCheckoutIds: string[]; // Danh sách uniqueId các món được chọn

  // --- ACTIONS ---
  addToCart: (item: CartItem) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  clearCart: () => void;

  // --- SELECTION LOGIC ---
  toggleItemSelection: (uniqueId: string) => void;
  selectAll: (isSelected: boolean) => void;
  
  // 👇 Đã thêm lại hàm này để fix lỗi đỏ trong ProductInfo
  setSelectedCheckoutIds: (ids: string[]) => void; 

  // --- GETTERS (Tính toán) ---
  totalPrice: () => number;          // Tổng tiền toàn giỏ
  totalSelectedPrice: () => number;  // Tổng tiền các món ĐANG CHỌN
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedCheckoutIds: [],

      // 1. Thêm sản phẩm (Kiểm tra trùng bằng uniqueId)
      addToCart: (newItem) => {
        const items = get().items;
        const existingItem = items.find((i) => i.uniqueId === newItem.uniqueId);

        if (existingItem) {
          const updatedItems = items.map((i) =>
            i.uniqueId === newItem.uniqueId
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i
          );
          set({ items: updatedItems });
        } else {
          set({ items: [...items, newItem] });
        }
      },

      // 2. Xóa sản phẩm (Đồng thời xóa khỏi danh sách đã chọn)
      removeFromCart: (uniqueId) => {
        const { items, selectedCheckoutIds } = get();
        set({
          items: items.filter((i) => i.uniqueId !== uniqueId),
          selectedCheckoutIds: selectedCheckoutIds.filter((id) => id !== uniqueId),
        });
      },

      // 3. Cập nhật số lượng (Dựa trên uniqueId)
      updateQuantity: (uniqueId, quantity) => {
        const items = get().items;
        const newItems = items.map((item) => {
          if (item.uniqueId === uniqueId) {
            const newQty = Math.max(1, Math.min(quantity, item.maxStock));
            return { ...item, quantity: newQty };
          }
          return item;
        });
        set({ items: newItems });
      },

      // 4. Toggle chọn từng món
      toggleItemSelection: (uniqueId) => {
        const currentSelected = get().selectedCheckoutIds;
        const isSelected = currentSelected.includes(uniqueId);

        if (isSelected) {
          // Nếu đang chọn -> Bỏ chọn
          set({ selectedCheckoutIds: currentSelected.filter((id) => id !== uniqueId) });
        } else {
          // Nếu chưa chọn -> Thêm vào danh sách
          set({ selectedCheckoutIds: [...currentSelected, uniqueId] });
        }
      },

      // 5. Chọn tất cả
      selectAll: (isSelected) => {
        if (isSelected) {
          const allUniqueIds = get().items.map((i) => i.uniqueId);
          set({ selectedCheckoutIds: allUniqueIds });
        } else {
          set({ selectedCheckoutIds: [] });
        }
      },

      // 6. Set danh sách chọn (Dùng cho chức năng "Mua ngay")
      setSelectedCheckoutIds: (ids) => set({ selectedCheckoutIds: ids }),

      // 7. Xóa sạch giỏ
      clearCart: () => set({ items: [], selectedCheckoutIds: [] }),

      // --- TÍNH TOÁN ---
      totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      totalSelectedPrice: () => {
        const { items, selectedCheckoutIds } = get();
        return items
          .filter((item) => selectedCheckoutIds.includes(item.uniqueId))
          .reduce((total, item) => total + item.price * item.quantity, 0);
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'shopping-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);