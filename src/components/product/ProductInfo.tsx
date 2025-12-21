"use client";
import { useState, useEffect } from "react";
// import { Heart } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/services/product";

// 1. Import Toast
import toast from "react-hot-toast";

export default function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();

  // State quản lý UI
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentStock, setCurrentStock] = useState(0);

  // Store action
  const { addToCart, setSelectedCheckoutIds } = useCartStore();

  // --- LOGIC XỬ LÝ DỮ LIỆU SẢN PHẨM ---

  // 1. Lọc danh sách màu duy nhất
  const uniqueColors = Array.from(new Map(product.variants.map(v => [v.color, v])).values());

  // 2. Hàm tìm Size đầu tiên có hàng của một màu
  const findFirstAvailableSize = (color: string) => {
    const variantsOfColor = product.variants.filter(v => v.color === color);
    const available = variantsOfColor.find(v => v.stock > 0);
    return available ? available.size : (variantsOfColor[0]?.size || null);
  };

  // 3. Auto chọn màu/size khi mới vào trang
  useEffect(() => {
    if (uniqueColors.length > 0) {
      const firstColor = uniqueColors[0].color;
      setSelectedColor(firstColor);
      setSelectedSize(findFirstAvailableSize(firstColor));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [selectedColor, selectedSize, product.variants, quantity]);

  // --- LOGIC GIỎ HÀNG & MUA NGAY ---

  const createCartItem = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Vui lòng chọn màu sắc và kích cỡ");
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
      variant: {
        color: selectedColor,
        size: selectedSize
      }
    };
  };

  // --- [UPDATED] Handle 1: Thêm vào giỏ với Âm thanh chuẩn ---
  const handleAddToCart = () => {
    const item = createCartItem();
    if (item) {
      // 1. Cập nhật Store ngay lập tức (Optimistic UI) để app phản hồi nhanh
      addToCart(item);

      // 2. Xử lý Audio Context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      fetch('/sounds/click.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;

          // Tạo bộ khuếch đại (GainNode)
          const gainNode = audioContext.createGain();
          
          // QUAN TRỌNG: Chỉ để gain = 4 (tăng 400%) là đủ to. 
          // Để 100 sẽ bị vỡ tiếng (distortion) rất chói tai.
          gainNode.gain.value = 1;

          // Nối dây
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);

          // Phát âm thanh
          source.start(0);

          // 3. HIỆN TOAST NGAY KHI ÂM THANH BẮT ĐẦU
          toast((t) => (
          <div className="flex flex-col gap-2 min-w-[250px]">
            {/* Phần nội dung */}
            <div className="flex items-center gap-3">
              <div className="text-green-500 text-xl">✓</div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Đã thêm vào giỏ!</span>
                <span className="text-xs text-gray-500">{product.name} - {selectedColor}</span>
              </div>
            </div>

            {/* Phần Nút bấm (Yes / No) */}
            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
              {/* Nút NO: Chỉ tắt thông báo */}
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Ở lại
              </button>

              {/* Nút YES: Chuyển trang checkout */}
              <button
                onClick={() => {
                  toast.dismiss(t.id); // Tắt thông báo
                  router.push('/checkout'); // Chuyển trang (hoặc /cart)
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium bg-[#FF5E4D] text-white rounded hover:bg-orange-600 transition-colors"
              >
                Thanh toán
              </button>
            </div>
          </div>
        ), {
          duration: 5000, // Để lâu hơn chút (5s) cho user kịp bấm
          position: 'top-center',
          style: {
            background: '#fff',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        });
        })
        .catch(e => {
          console.error("Audio error:", e);
          // Fallback: Nếu lỗi âm thanh thì vẫn hiện thông báo để user biết
          toast.success("Đã thêm vào giỏ hàng!");
        });
    }
  };

  // Handle 2: Mua ngay
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
            className="flex-1 bg-black text-white py-3.5 rounded font-bold hover:bg-gray-800 transition-colors uppercase tracking-wide border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Thêm vào giỏ
          </button>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={!selectedSize || currentStock === 0}
          className="w-full bg-[#FF5E4D] text-white py-3.5 rounded font-bold hover:bg-orange-600 transition-colors uppercase tracking-wide shadow-lg shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStock === 0 ? "Hết hàng" : "Mua ngay"}
        </button>
      </div>

    </div>
  );
}