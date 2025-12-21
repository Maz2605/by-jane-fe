"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/services/product";

// 1. Thay thế react-hot-toast bằng Custom Toast
import ToastNotification from "@/components/ui/ToastNotification";

export default function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();

  // State UI
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentStock, setCurrentStock] = useState(0);

  // State cho Custom Toast
  const [toastState, setToastState] = useState<{
    isOpen: boolean;
    type: 'success' | 'warning' | 'error';
    title: string;
    message: string;
    action?: React.ReactNode; // State này để chứa nút bấm
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const { addToCart, setSelectedCheckoutIds } = useCartStore();

  // Helper tắt toast
  const handleCloseToast = () => setToastState(prev => ({ ...prev, isOpen: false }));

  // --- LOGIC XỬ LÝ DỮ LIỆU (Giữ nguyên) ---
  const uniqueColors = Array.from(new Map(product.variants.map(v => [v.color, v])).values());

  const findFirstAvailableSize = (color: string) => {
    const variantsOfColor = product.variants.filter(v => v.color === color);
    const available = variantsOfColor.find(v => v.stock > 0);
    return available ? available.size : (variantsOfColor[0]?.size || null);
  };

  useEffect(() => {
    if (uniqueColors.length > 0) {
      const firstColor = uniqueColors[0].color;
      setSelectedColor(firstColor);
      setSelectedSize(findFirstAvailableSize(firstColor));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableSizes = product.variants
    .filter(v => v.color === selectedColor)
    .map(v => ({ size: v.size, stock: v.stock }));

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
  }, [selectedColor, selectedSize, product.variants, quantity]);

  // --- LOGIC GIỎ HÀNG ---

  const createCartItem = () => {
    if (!selectedColor || !selectedSize) {
      setToastState({
        isOpen: true,
        type: 'error',
        title: 'Chưa chọn thuộc tính',
        message: 'Vui lòng chọn màu sắc và kích cỡ trước khi mua.'
      });
      return null;
    }

    const uniqueId = `${product.id}-${selectedColor}-${selectedSize}`;
    return {
      id: product.id,
      uniqueId: uniqueId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      maxStock: currentStock,
      variant: { color: selectedColor, size: selectedSize }
    };
  };

  // --- [UPDATED] Handle Add To Cart ---
  const handleAddToCart = () => {
    const item = createCartItem();
    if (item) {
      addToCart(item);

      // --- Âm thanh (Giữ nguyên) ---
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        fetch('/sounds/click.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => audioContext.decodeAudioData(buf))
          .then(audioBuf => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuf;
            const gain = audioContext.createGain();
            gain.gain.value = 1;
            source.connect(gain);
            gain.connect(audioContext.destination);
            source.start(0);
          }).catch(() => { });
      } catch (e) { }

      // --- TOAST DESIGN MỚI: TONE-SUR-TONE ---
      setToastState({
        isOpen: true,
        type: 'success', // Toast đang là màu xanh emerald
        title: 'Đã thêm vào giỏ!',
        message: `${product.name} - ${selectedColor} (Size ${selectedSize})`,
        action: (
          <div className="flex gap-3 mt-1">
            {/* Nút 1: Ở lại - Dùng nền trắng, viền xanh nhạt */}
            <button
              onClick={handleCloseToast}
              className="flex-1 px-3 py-2 text-xs font-bold text-emerald-700 bg-white border border-emerald-200 rounded-md hover:bg-emerald-50 transition-colors"
            >
              Ở lại xem tiếp
            </button>

            {/* Nút 2: Thanh toán - Dùng nền xanh đậm (Đồng bộ với icon Success) */}
            <button
              onClick={() => {
                handleCloseToast();
                router.push('/checkout');
              }}
              className="flex-1 px-3 py-2 text-xs font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-1"
            >
              Thanh toán <span className="text-[10px]">→</span>
            </button>
          </div>
        )
      });
    }
  };
  const handleBuyNow = () => {
    const item = createCartItem();
    if (item) {
      addToCart(item);
      setSelectedCheckoutIds([item.uniqueId]);
      router.push("/checkout");
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <div className="flex flex-col h-full font-sans">

      {/* --- HEADER: TÊN & GIÁ --- */}
      <div className="border-b border-gray-100 pb-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {product.name}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-[#FF5E4D]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through mb-1 font-medium">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
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
          </div>
        </div>
      </div>

      {/* --- CHỌN MÀU SẮC --- */}
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
                setSelectedSize(findFirstAvailableSize(v.color));
              }}
              className={`min-w-20 h-10 px-3 rounded border text-sm font-medium transition-all flex items-center justify-center gap-2 ${selectedColor === v.color
                ? "bg-black text-white border-black shadow-md"
                : "bg-white text-gray-700 border-gray-200 hover:border-black"
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
                className={`min-w-10 h-10 px-3 rounded border text-sm font-medium transition-all ${selectedSize === s.size
                  ? "bg-black text-white border-black"
                  : s.stock === 0
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100 line-through"
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

      {/* --- CÁC NÚT ACTIONS --- */}
      <div className="space-y-3 mb-8">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || currentStock === 0}
            className="flex-1 bg-black text-white py-3.5 rounded font-bold hover:bg-gray-800 transition-colors uppercase tracking-wide border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Thêm vào giỏ

          </button>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={!selectedSize || currentStock === 0}
          className="w-full h-12 rounded-lg font-bold text-white bg-[#FF5E4D] hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-100 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {currentStock === 0 ? "Hết hàng" : (
            <>
              Mua ngay
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* --- RENDER CUSTOM TOAST Ở CUỐI --- */}
      <ToastNotification
        isOpen={toastState.isOpen}
        type={toastState.type}
        title={toastState.title}
        message={toastState.message}
        action={toastState.action} // Truyền nút bấm vào
        onClose={handleCloseToast}
      />

    </div>
  );
}