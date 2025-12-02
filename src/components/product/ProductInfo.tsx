"use client";
import { useState, useEffect } from "react";
import { Heart, Gift, TicketPercent } from "lucide-react";
import { useCartStore } from "@/store/useCartStore"; // Import Store

interface Variant {
  id: number;
  size: string;
  color: string;
  colorCode: string;
  stock: number;
}

interface ProductInfoProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string; // Ảnh đại diện để lưu vào giỏ
    variants: Variant[];
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  
  // State lựa chọn
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentStock, setCurrentStock] = useState(0);

  // Lấy hàm thêm vào giỏ từ Store
  const addToCart = useCartStore((state) => state.addToCart);

  // 1. Xử lý danh sách màu duy nhất
  const uniqueColors = Array.from(new Map(product.variants.map(v => [v.color, v])).values());

  // 2. Hàm tìm Size đầu tiên có hàng của một màu
  const findFirstAvailableSize = (color: string) => {
    const variantsOfColor = product.variants.filter(v => v.color === color);
    const available = variantsOfColor.find(v => v.stock > 0);
    return available ? available.size : (variantsOfColor[0]?.size || null);
  };

  // 3. Auto chọn màu/size khi mới vào
  useEffect(() => {
    if (uniqueColors.length > 0) {
      const firstColor = uniqueColors[0].color;
      setSelectedColor(firstColor);
      setSelectedSize(findFirstAvailableSize(firstColor));
    }
  }, []);

  // 4. Lọc danh sách size theo màu đang chọn
  const availableSizes = product.variants
    .filter(v => v.color === selectedColor)
    .map(v => ({ size: v.size, stock: v.stock }));

  // 5. Cập nhật tồn kho khi đổi lựa chọn
  useEffect(() => {
    const variant = product.variants.find(
      v => v.color === selectedColor && v.size === selectedSize
    );
    if (variant) {
      setCurrentStock(variant.stock);
      if (quantity > variant.stock) setQuantity(1);
    } else {
      setCurrentStock(0);
    }
  }, [selectedColor, selectedSize]);

  // 6. Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Vui lòng chọn màu sắc và kích cỡ");
      return;
    }

    // Tạo ID duy nhất cho sản phẩm trong giỏ (VD: 1-Den-M)
    const uniqueId = `${product.id}-${selectedColor}-${selectedSize}`;

    addToCart({
      id: product.id,
      uniqueId: uniqueId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      maxStock: currentStock,
      variant: {
        color: selectedColor,
        size: selectedSize
      }
    });

    // Có thể thay bằng Toast thông báo đẹp hơn
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* --- HEADER: TÊN & GIÁ --- */}
      <div className="border-b border-gray-100 pb-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {product.name}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-[#FF5E4D]">
                    {product.price.toLocaleString("vi-VN")}đ
                </span>
                {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through mb-1 font-medium">
                        {product.originalPrice.toLocaleString("vi-VN")}đ
                    </span>
                )}
                {product.discount && product.discount > 0 && (
                    <span className="bg-red-100 text-[#FF5E4D] px-2 py-0.5 rounded text-sm font-bold mb-1">
                        -{product.discount}%
                    </span>
                )}
            </div>
            
            <div className="text-sm border border-gray-200 rounded p-2 bg-gray-50 min-w-[150px]">
                <p className="flex justify-between mb-1">
                    <span className="text-gray-500">Tình trạng:</span>
                    {currentStock > 0 ? (
                        <span className="text-green-600 font-bold">Còn hàng</span>
                    ) : (
                        <span className="text-red-500 font-bold">Hết hàng</span>
                    )}
                </p>
                <p className="flex justify-between">
                    <span className="text-gray-500">Mã SKU:</span>
                    <span className="text-gray-900 font-medium">--</span>
                </p>
            </div>
        </div>
      </div>

      {/* --- CHỌN MÀU SẮC (Giao diện ô chữ nhật) --- */}
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
                        setSelectedSize(findFirstAvailableSize(v.color)); // Auto chọn size
                    }}
                    className={`min-w-20 h-10 px-3 rounded border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        selectedColor === v.color
                        ? "bg-black text-white border-black shadow-md" // Active
                        : "bg-white text-gray-700 border-gray-200 hover:border-black" // Inactive
                    }`}
                    title={v.color}
                >
                    <span className="w-3 h-3 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: v.colorCode }}></span>
                    {v.color}
                </button>
            ))}
        </div>
      </div>

      {/* --- CHỌN KÍCH CỠ --- */}
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
                        disabled={s.stock === 0}
                        className={`min-w-10 h-10 px-3 rounded border text-sm font-medium transition-all ${
                            selectedSize === s.size
                            ? "bg-black text-white border-black" 
                            : s.stock === 0 
                                ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100 box-decoration-slice line-through" 
                                : "bg-white text-gray-700 border-gray-200 hover:border-black"
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

      {/* --- SỐ LƯỢNG --- */}
      <div className="mb-8 flex items-center gap-4">
        <span className="text-sm font-bold text-gray-700">Số lượng:</span>
        <div className="flex items-center border border-gray-300 rounded-md bg-white">
            <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold"
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
                onClick={() => setQuantity(q => Math.min(currentStock, q + 1))} 
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold"
            >
                +
            </button>
        </div>
        <span className="text-xs text-gray-500">
            {currentStock > 0 ? `${currentStock} sản phẩm có sẵn` : "Tạm hết hàng"}
        </span>
      </div>

      {/* --- CÁC NÚT MUA --- */}
      <div className="space-y-3 mb-8">
        <div className="flex gap-3">
            <button 
                onClick={handleAddToCart}
                disabled={!selectedSize || currentStock === 0}
                className="flex-1 bg-black text-white py-3.5 rounded font-bold hover:bg-gray-800 transition-colors uppercase tracking-wide border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Thêm vào giỏ
            </button>
            <button className="w-12 flex items-center justify-center border-2 border-gray-200 rounded hover:border-[#FF5E4D] hover:text-[#FF5E4D] transition-colors text-gray-400">
                <Heart size={22} />
            </button>
        </div>
        <button 
            disabled={!selectedSize || currentStock === 0}
            className="w-full bg-[#FF5E4D] text-white py-3.5 rounded font-bold hover:bg-orange-600 transition-colors uppercase tracking-wide shadow-lg shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {currentStock === 0 ? "Hết hàng" : "Mua ngay"}
        </button>
      </div>

      {/* --- KHỐI ƯU ĐÃI THÊM (Nhỏ gọn) --- */}
      <div className="mb-6 border border-dashed border-orange-200 bg-orange-50/50 rounded-md p-3">
        <h4 className="font-bold text-gray-800 flex items-center gap-1.5 mb-2 text-sm">
            <Gift size={16} className="text-[#FF5E4D]" /> Ưu đãi thêm:
        </h4>
        <ul className="space-y-1.5 text-xs text-gray-600">
            <li className="flex items-start gap-2">
                <TicketPercent size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <span>Giảm thêm <strong className="text-[#FF5E4D]">10k</strong> cho đơn hàng từ 300k.</span>
            </li>
            <li className="flex items-start gap-2">
                <TicketPercent size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <span>Giảm <strong className="text-[#FF5E4D]">5%</strong> tối đa 50k khi thanh toán qua VNPay.</span>
            </li>
            <li className="flex items-start gap-2">
                <TicketPercent size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <span><strong className="text-[#FF5E4D]">Freeship</strong> cho đơn hàng nội thành Hà Nội.</span>
            </li>
        </ul>
      </div>

    </div>
  );
}