"use client";
import { useState, useEffect } from "react";
import { Heart, RefreshCw, Truck, ShieldCheck, Phone, Facebook, Twitter, Instagram } from "lucide-react";
import { TicketPercent, Gift } from "lucide-react";

// 1. Định nghĩa kiểu dữ liệu cho Biến thể (Variant)
interface Variant {
  id: number;
  size: string;
  color: string;
  colorCode: string;
  stock: number;
}

// 2. Định nghĩa kiểu dữ liệu cho Sản phẩm nhận vào
interface ProductInfoProps {
  product: {
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    variants: Variant[]; // Mảng chứa tất cả biến thể
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  
  // State lưu lựa chọn hiện tại của khách
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  // State lưu tồn kho hiện tại (để hiển thị và validate)
  const [currentStock, setCurrentStock] = useState(0);

  // --- LOGIC XỬ LÝ DỮ LIỆU ---

  // A. Lọc ra danh sách Màu duy nhất (Unique Colors) để vẽ nút chọn Màu
  // Dùng Map để lọc trùng theo tên màu
  const uniqueColors = Array.from(new Map(product.variants.map(v => [v.color, v])).values());

  // B. Hàm hỗ trợ: Tìm size đầu tiên CÓ HÀNG của một màu cụ thể
  const findFirstAvailableSize = (color: string) => {
    const variantsOfColor = product.variants.filter(v => v.color === color);
    // Ưu tiên tìm cái nào stock > 0
    const available = variantsOfColor.find(v => v.stock > 0);
    // Nếu có thì trả về size đó, nếu hết sạch thì trả về size đầu tiên (để hiện ra là hết hàng)
    return available ? available.size : (variantsOfColor[0]?.size || null);
  };

  // C. useEffect 1: Chạy 1 lần khi mới vào trang -> Auto chọn màu/size đầu tiên
  useEffect(() => {
    if (uniqueColors.length > 0) {
      const firstColor = uniqueColors[0].color;
      setSelectedColor(firstColor);
      setSelectedSize(findFirstAvailableSize(firstColor)); 
    }
  }, []); // [] nghĩa là chỉ chạy 1 lần sau khi render

  // D. Tính toán danh sách Size khả dụng của Màu đang chọn
  const availableSizes = product.variants
    .filter(v => v.color === selectedColor)
    .map(v => ({ size: v.size, stock: v.stock }));

  // E. useEffect 2: Khi Màu hoặc Size thay đổi -> Cập nhật Tồn kho
  useEffect(() => {
    const variant = product.variants.find(
      v => v.color === selectedColor && v.size === selectedSize
    );

    if (variant) {
      setCurrentStock(variant.stock);
      // Nếu khách đang chọn số lượng 10 mà kho chỉ còn 5 -> Reset về 1 cho an toàn
      if (quantity > variant.stock) setQuantity(1);
    } else {
      setCurrentStock(0); // Không tìm thấy biến thể -> Hết hàng
    }
  }, [selectedColor, selectedSize]);

  // F. Hàm tăng giảm số lượng mua
  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
    if (type === "inc" && quantity < currentStock) setQuantity(quantity + 1);
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* ------------------------------------------------------- */}
      {/* 1. HEADER: TÊN SẢN PHẨM, GIÁ & TÌNH TRẠNG */}
      {/* ------------------------------------------------------- */}
      <div className="border-b border-gray-100 pb-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {product.name}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Giá tiền */}
            <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-[#FF5E4D]">
                    {product.price.toLocaleString("vi-VN")}đ
                </span>
                {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through mb-1 font-medium">
                        {product.originalPrice.toLocaleString("vi-VN")}đ
                    </span>
                )}
            </div>
            
            {/* Box thông tin nhỏ: Tình trạng & SKU */}
            <div className="text-sm border border-gray-200 rounded p-2 bg-gray-50 min-w-[180px]">
                <p className="flex justify-between mb-1">
                    <span className="text-gray-500">Tình trạng:</span>
                    {currentStock > 0 ? (
                        <span className="text-green-600 font-bold">Còn hàng</span>
                    ) : (
                        <span className="text-red-500 font-bold">Hết hàng</span>
                    )}
                </p>
            </div>
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* 2. BỘ CHỌN MÀU SẮC (Dạng Nút Chữ Nhật + Chấm màu) */}
      {/* ------------------------------------------------------- */}
      <div className="mb-6">
        <span className="block text-sm font-bold text-gray-700 mb-3">
            Màu sắc: <span className="font-normal text-gray-500">{selectedColor}</span>
        </span>
        
        <div className="flex flex-wrap gap-3">
            {uniqueColors.map((v) => (
                <button
                    key={v.id}
                    onClick={() => {
                        setSelectedColor(v.color);
                        // Khi đổi màu -> Auto chọn lại size phù hợp ngay lập tức
                        setSelectedSize(findFirstAvailableSize(v.color));
                    }}
                    className={`min-w-[60px] h-10 px-3 rounded border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        selectedColor === v.color
                        ? "bg-black text-white border-black shadow-md" // Active: Đen
                        : "bg-white text-gray-700 border-gray-200 hover:border-black" // Inactive: Trắng
                    }`}
                    title={v.color}
                >
                    {/* Chấm màu nhỏ xíu để minh họa */}
                    <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: v.colorCode }}></span>
                    {v.color}
                </button>
            ))}
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* 3. BỘ CHỌN KÍCH CỠ (SIZE) */}
      {/* ------------------------------------------------------- */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-700">
                Kích cỡ: <span className="font-normal text-gray-500">{selectedSize}</span>
            </span>
            <button className="text-xs text-[#FF5E4D] hover:underline flex items-center gap-1">
                📏 Bảng kích thước
            </button>
        </div>

        <div className="flex flex-wrap gap-3">
            {availableSizes.length > 0 ? (
                availableSizes.map((s, idx) => (
                    <button
                        key={idx}
                        onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                        disabled={s.stock === 0} // Hết hàng thì không cho bấm
                        className={`min-w-[40px] h-10 px-3 rounded border text-sm font-medium transition-all ${
                            selectedSize === s.size
                            ? "bg-black text-white border-black" // Active
                            : s.stock === 0 
                                ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100 decoration-slice line-through" // Hết hàng
                                : "bg-white text-gray-700 border-gray-200 hover:border-black" // Inactive
                        }`}
                    >
                        {s.size}
                    </button>
                ))
            ) : (
                <span className="text-sm text-gray-400 italic">Vui lòng chọn màu trước</span>
            )}
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* 4. SỐ LƯỢNG & TỒN KHO */}
      {/* ------------------------------------------------------- */}
      <div className="mb-8 flex items-center gap-4">
        <span className="text-sm font-bold text-gray-700">Số lượng:</span>
        <div className="flex items-center border border-gray-300 rounded-md bg-white">
            <button 
                onClick={() => handleQuantity("dec")} 
                disabled={quantity <= 1}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold disabled:opacity-50"
            >
                -
            </button>
            <input 
                type="text" 
                value={quantity} 
                readOnly 
                className="w-10 h-9 text-center border-l border-r border-gray-300 outline-none text-gray-800 font-medium text-sm" 
            />
            <button 
                onClick={() => handleQuantity("inc")} 
                disabled={quantity >= currentStock}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold disabled:opacity-50"
            >
                +
            </button>
        </div>
        <span className="text-xs text-gray-500">
            {currentStock > 0 ? `${currentStock} sản phẩm có sẵn` : "Tạm hết hàng"}
        </span>
      </div>

      {/* ------------------------------------------------------- */}
      {/* 5. CÁC NÚT HÀNH ĐỘNG (Mua hàng) */}
      {/* ------------------------------------------------------- */}
      <div className="space-y-3 mb-8">
        <div className="flex gap-3">
            <button 
                disabled={!selectedSize || currentStock === 0}
                className="flex-1 bg-black text-white py-3.5 rounded font-bold hover:bg-gray-800 transition-colors uppercase tracking-wide border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-gray-400"
            >
                Thêm vào giỏ
            </button>
            <button className="w-12 flex items-center justify-center border-2 border-gray-200 rounded hover:border-[#FF5E4D] hover:text-[#FF5E4D] transition-colors text-gray-400">
                <Heart size={22} />
            </button>
        </div>
        <button 
            disabled={!selectedSize || currentStock === 0}
            className="w-full bg-[#FF5E4D] text-white py-3.5 rounded font-bold hover:bg-orange-600 transition-colors uppercase tracking-wide shadow-lg shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
            {currentStock === 0 ? "Hết hàng" : "Mua ngay"}
        </button>
      </div>

      
      {/* -------------------------------------------------------
      {/* 6. CAM KẾT & CHIA SẺ (Phần Footer nhỏ) */}
      {/* ------------------------------------------------------- */}
      {/* <div className="mt-auto space-y-4 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF5E4D] flex items-center justify-center text-white flex-shrink-0"><Truck size={16}/></div>
            <div>
                <strong className="block text-gray-800">Giao hàng toàn quốc</strong>
                <span className="text-xs text-gray-500">Thanh toán (COD) khi nhận hàng</span>
            </div>
        </div>
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF5E4D] flex items-center justify-center text-white flex-shrink-0"><ShieldCheck size={16}/></div>
            <div>
                <strong className="block text-gray-800">Miễn phí giao hàng</strong>
                <span className="text-xs text-gray-500">Theo chính sách</span>
            </div>
        </div>
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF5E4D] flex items-center justify-center text-white flex-shrink-0"><RefreshCw size={16}/></div>
            <div>
                <strong className="block text-gray-800">Đổi trả trong 7 ngày</strong>
                <span className="text-xs text-gray-500">Kể từ ngày mua hàng</span>
            </div>
        </div>
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF5E4D] flex items-center justify-center text-white flex-shrink-0"><Phone size={16}/></div>
            <div>
                <strong className="block text-gray-800">Hỗ trợ 24/7</strong>
                <span className="text-xs text-gray-500">Hotline: 1900 123 456</span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
         <span className="text-sm text-gray-500">Chia sẻ:</span>
         <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90"><Facebook size={14}/></button>
            <button className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90"><Twitter size={14}/></button>
            <button className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center hover:opacity-90"><Instagram size={14}/></button>
         </div>
      </div> */} 

    </div>
  );
}