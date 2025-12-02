"use client";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function CartItemRow({ item, isSelected, onSelect }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCartStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      
      {/* --- GIAO DIỆN DESKTOP (Grid) --- */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
        
        {/* Cột 1: Checkbox + Ảnh + Tên */}
        <div className="col-span-6 flex items-center gap-4">
          <input 
            type="checkbox" 
            className="w-4 h-4 accent-[#FF5E4D] cursor-pointer"
            checked={isSelected}
            onChange={() => onSelect(item.uniqueId)}
          />
          <div className="relative w-20 h-20 border rounded overflow-hidden flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{item.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit">
              <span>Phân loại: {item.variant.color}, {item.variant.size}</span>
            </div>
          </div>
        </div>

        {/* Cột 2: Đơn giá */}
        <div className="col-span-2 text-center font-medium text-gray-800">
          {item.price.toLocaleString("vi-VN")}đ
        </div>

        {/* Cột 3: Số lượng */}
        <div className="col-span-2 flex justify-center">
          <div className="flex items-center border border-gray-300 rounded-sm">
            <button 
              onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 border-r border-gray-300"
            >
              <Minus size={14} />
            </button>
            <input 
              type="text" 
              value={item.quantity} 
              readOnly 
              className="w-10 h-8 text-center outline-none text-sm font-medium"
            />
            <button 
              onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 border-l border-gray-300"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Cột 4: Thành tiền */}
        <div className="col-span-1 text-center font-bold text-[#FF5E4D]">
          {(item.price * item.quantity).toLocaleString("vi-VN")}đ
        </div>

        {/* Cột 5: Xóa */}
        <div className="col-span-1 text-center">
          <button 
            onClick={() => removeFromCart(item.uniqueId)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* --- GIAO DIỆN MOBILE (Flex) --- */}
      <div className="flex md:hidden gap-3">
         <div className="flex items-center">
            <input 
                type="checkbox" 
                className="w-4 h-4 accent-[#FF5E4D]" 
                checked={isSelected}
                onChange={() => onSelect(item.uniqueId)}
            />
         </div>
         <div className="w-20 h-20 border rounded overflow-hidden flex-shrink-0">
             <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
         </div>
         <div className="flex-1 flex flex-col justify-between">
             <div>
                 <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                 <p className="text-xs text-gray-500 mt-1">Phân loại: {item.variant.color}, {item.variant.size}</p>
             </div>
             <div className="flex justify-between items-end">
                 <span className="text-[#FF5E4D] font-bold">{item.price.toLocaleString()}đ</span>
                 <div className="flex items-center border border-gray-300 rounded-sm h-7">
                    <button onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)} className="w-7 flex items-center justify-center border-r"><Minus size={12}/></button>
                    <span className="w-8 text-center text-xs">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)} className="w-7 flex items-center justify-center border-l"><Plus size={12}/></button>
                 </div>
             </div>
         </div>
      </div>

    </div>
  );
}