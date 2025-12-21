"use client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

export default function CartSummary() {
  const router = useRouter();
  
  // 1. Kết nối trực tiếp với Store
  const { 
    items, 
    selectedCheckoutIds, 
    selectAll, 
    removeFromCart, 
    totalSelectedPrice 
  } = useCartStore();

  // 2. Logic tính toán trạng thái
  // Chọn tất cả = khi có item VÀ số lượng đã chọn bằng tổng số item
  const isAllSelected = items.length > 0 && selectedCheckoutIds.length === items.length;
  
  // Tính tổng tiền các món được chọn
  const totalPrice = totalSelectedPrice();

  // 3. Các hàm xử lý sự kiện
  const handleSelectAll = () => {
    // Nếu đang chọn hết -> Bỏ chọn (false), ngược lại -> Chọn hết (true)
    selectAll(!isAllSelected);
  };

  const handleDeleteSelected = () => {
    if (confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?")) {
      // Lặp qua danh sách đã chọn và xóa từng món
      // Lưu ý: Store của chúng ta đã có logic tự động xóa ID khỏi selectedCheckoutIds khi item bị xóa
      selectedCheckoutIds.forEach((id) => removeFromCart(id));
    }
  };

  const handleCheckout = () => {
    // Chuyển hướng sang trang thanh toán
    router.push("/checkout");
  };

  // Nếu giỏ hàng trống thì có thể ẩn thanh này hoặc render null
  if (items.length === 0) return null;

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-xl md:rounded-none z-40">
        
        {/* --- BÊN TRÁI: Checkbox & Xóa --- */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center w-full md:w-auto">
            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="selectAllFooter"
                    className="w-4 h-4 accent-[#FF5E4D] cursor-pointer"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                />
                <label htmlFor="selectAllFooter" className="text-sm cursor-pointer select-none font-medium">
                    Chọn tất cả ({items.length})
                </label>
                
                <button 
                    onClick={handleDeleteSelected}
                    disabled={selectedCheckoutIds.length === 0}
                    className="text-sm text-gray-500 hover:text-[#FF5E4D] ml-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Xóa ({selectedCheckoutIds.length})
                </button>
            </div>
        </div>

        {/* --- BÊN PHẢI: Tổng tiền & Nút Mua --- */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
                <p className="text-sm text-gray-600">
                    Tổng thanh toán ({selectedCheckoutIds.length} sản phẩm):
                </p>
                <p className="text-xl md:text-2xl font-bold text-[#FF5E4D]">
                    {totalPrice.toLocaleString("vi-VN")}đ
                </p>
            </div>
            
            <button 
                onClick={handleCheckout}
                disabled={selectedCheckoutIds.length === 0}
                className="bg-[#FF5E4D] text-white px-8 py-3 rounded shadow-md font-bold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Mua Hàng
            </button>
        </div>

    </div>
  );
}