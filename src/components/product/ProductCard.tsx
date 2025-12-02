import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface ProductProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  colors?: string[];
}

export default function ProductCard({ product }: { product: ProductProps }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        
        {/* 1. KHUNG ẢNH */}
        <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Tem giảm giá */}
          {product.discount && (
            <span className="absolute top-2 left-2 bg-[#FF5E4D] text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md">
              -{product.discount}%
            </span>
          )}

          {/* Nút giỏ hàng (Hiện khi hover) */}
          <div className="absolute bottom-3 right-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white p-2 rounded-full shadow-md text-[#FF5E4D] hover:bg-[#FF5E4D] hover:text-white">
              <ShoppingCart size={18} />
            </div>
          </div>
        </div>

        {/* 2. THÔNG TIN */}
        <div className="pt-3 pb-2 px-1">
          
          {/* Chấm màu */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 mb-2">
              {product.colors.map((color, index) => (
                <div 
                  key={index} 
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          )}

          {/* Tên sản phẩm */}
          <h3 className="text-gray-700 text-sm font-medium line-clamp-2 min-h-10 group-hover:text-[#FF5E4D] transition-colors">
            {product.name}
          </h3>

          {/* Giá tiền */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#D35440] font-bold text-base">
              {product.price.toLocaleString("vi-VN")}đ
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">
                {product.originalPrice.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}