import Link from "next/link";
import { ShoppingCart } from "lucide-react";
// 1. QUAN TRỌNG: Import Type từ Single Source of Truth
import { Product } from "@/services/product"; 



export default function ProductCard({ product }: { product: Product }) {
  return (
    // Link href cần đảm bảo product.id tồn tại.
    // Với interface Product chuẩn, TS sẽ đảm bảo id luôn có.
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-transparent hover:border-gray-100">
        
        {/* 1. KHUNG ẢNH */}
        <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
          {/* Logic ở đây đã đúng với API mới:
             product.image bây giờ là string (URL ảnh thumbnail) 
             chứ không phải mảng, nên dùng trực tiếp được.
          */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
          />
          
          {/* Tem giảm giá */}
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-[#FF5E4D] text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              -{product.discount}%
            </span>
          )}

          {/* Nút giỏ hàng (Hiện khi hover) */}
          <div className="absolute bottom-3 right-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white p-2 rounded-full shadow-md text-[#FF5E4D] hover:bg-[#FF5E4D] hover:text-white transition-colors">
              <ShoppingCart size={18} />
            </div>
          </div>
        </div>

        {/* 2. THÔNG TIN */}
        <div className="pt-3 pb-3 px-2">
          
          {/* Chấm màu */}
          {product.colors && product.colors.length > 0 ? (
            <div className="flex gap-1.5 mb-2">
              {product.colors.map((color, index) => (
                <div 
                  key={index} 
                  className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color} // Tooltip hiện mã màu khi hover
                ></div>
              ))}
            </div>
          ) : (
             // Giữ khoảng trống để card không bị lệch chiều cao nếu không có màu
             <div className="h-5 mb-2"></div>
          )}

          {/* Tên sản phẩm */}
          <h3 className="text-gray-700 text-sm font-medium line-clamp-2 min-h-10 group-hover:text-[#FF5E4D] transition-colors mb-1">
            {product.name}
          </h3>

          {/* Giá tiền */}
          <div className="flex items-center gap-2">
            <span className="text-[#D35440] font-bold text-base">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
            </span>
            
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">
                 {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.originalPrice)}
              </span>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}