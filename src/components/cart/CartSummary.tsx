"use client";
import { TicketPercent } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface CartSummaryProps {
  selectedItems: string[];
  totalPrice: number;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
}

export default function CartSummary({ 
  selectedItems, 
  totalPrice, 
  onSelectAll, 
  onDeleteSelected 
}: CartSummaryProps) {
  
  const { items } = useCartStore();
  const isAllSelected = selectedItems.length === items.length && items.length > 0;

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-xl md:rounded-none z-40">
        
        {/* Bên trái: Chọn tất cả & Voucher */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center w-full md:w-auto">
            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="selectAll"
                    className="w-4 h-4 accent-[#FF5E4D] cursor-pointer"
                    checked={isAllSelected}
                    onChange={onSelectAll}
                />
                <label htmlFor="selectAll" className="text-sm cursor-pointer select-none">
                    Chọn tất cả ({items.length})
                </label>
                <button 
                    onClick={onDeleteSelected}
                    className="text-sm text-gray-500 hover:text-[#FF5E4D] ml-4"
                    disabled={selectedItems.length === 0}
                >
                    Xóa
                </button>
            </div>
            
            <div className="flex items-center gap-1 text-[#FF5E4D] cursor-pointer hover:opacity-80">
                <TicketPercent size={18} />
                <span className="text-sm font-medium">Chọn hoặc nhập mã Voucher</span>
            </div>
        </div>

        {/* Bên phải: Tổng tiền & Nút Mua */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
                <p className="text-sm text-gray-600">
                    Tổng thanh toán ({selectedItems.length} sản phẩm):
                </p>
                <p className="text-xl md:text-2xl font-bold text-[#FF5E4D]">
                    {totalPrice.toLocaleString("vi-VN")}đ
                </p>
            </div>
            <button 
                className="bg-[#FF5E4D] text-white px-8 py-3 rounded shadow-md font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedItems.length === 0}
            >
                Mua Hàng
            </button>
        </div>

    </div>
  );
}