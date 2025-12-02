"use client";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import Link from "next/link"; // <--- Import thêm Link

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function CartItemRow({ item, isSelected, onSelect }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCartStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      
      {/* --- GIAO DIỆN DESKTOP --- */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
        
        {/* Cột 1: Checkbox + Ảnh + Tên (SỬA Ở ĐÂY) */}
        <div className="col-span-6 flex items-center gap-4">
          <input 
            type="checkbox" 
            className="w-4 h-4 accent-[#FF5E4D] cursor-pointer shrink-0"
            checked={isSelected}
            onChange={() => onSelect(item.uniqueId)}
          />
          
          {/* Bọc Ảnh và Tên trong thẻ Link */}
          <Link href={`/products/${item.id}`} className="flex items-center gap-4 group flex-1">
            <div className="relative w-20 h-20 border rounded overflow-hidden shrink-0 group-hover:border-[#FF5E4D] transition-colors">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-[#FF5E4D] transition-colors">
                    {item.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit">
                    <span>Phân loại: {item.variant.color}, {item.variant.size}</span>
                </div>
            </div>
          </Link>

        </div>

        {/* ... (Các cột Đơn giá, Số lượng, Thành tiền, Xóa giữ nguyên) ... */}
         <div className="col-span-2 text-center font-medium text-gray-800">
          {item.price.toLocaleString("vi-VN")}đ
        </div>

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

        <div className="col-span-1 text-center font-bold text-[#FF5E4D]">
          {(item.price * item.quantity).toLocaleString("vi-VN")}đ
        </div>

        <div className="col-span-1 text-center">
          <button 
            onClick={() => removeFromCart(item.uniqueId)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

      </div>

      {/* --- GIAO DIỆN MOBILE (SỬA TƯƠNG TỰ) --- */}
      <div className="flex md:hidden gap-3">
         <div className="flex items-center">
            <input 
                type="checkbox" 
                className="w-4 h-4 accent-[#FF5E4D]" 
                checked={isSelected}
                onChange={() => onSelect(item.uniqueId)}
            />
         </div>
         
         {/* Bọc Link cho Mobile */}
         <Link href={`/products/${item.id}`} className="contents">
            <div className="w-20 h-20 border rounded overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
         </Link>

         <div className="flex-1 flex flex-col justify-between">
             <div>
                 {/* Bọc Link cho tên */}
                 <Link href={`/products/${item.id}`}>
                    <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                 </Link>
                 <p className="text-xs text-gray-500 mt-1">Phân loại: {item.variant.color}, {item.variant.size}</p>
             </div>
             
             {/* ... (Phần giá và số lượng mobile giữ nguyên) ... */}
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