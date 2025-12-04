import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: number;
  uniqueId: string;
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
  
  // 👇 THÊM: Lưu danh sách ID các món được chọn để thanh toán
  selectedCheckoutIds: string[]; 
  setSelectedCheckoutIds: (ids: string[]) => void;

  addToCart: (item: CartItem) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      // 👇 Khởi tạo
      selectedCheckoutIds: [],
      setSelectedCheckoutIds: (ids) => set({ selectedCheckoutIds: ids }),

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

      removeFromCart: (uniqueId) => {
        set({ items: get().items.filter((i) => i.uniqueId !== uniqueId) });
      },

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

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
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