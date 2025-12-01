import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import CountDownTimer from "@/components/ui/CountDownTimer";

interface FlashSaleData {
  id: number;
  name: string;
  endTime: string;
  products: any[];
}

export default function FlashSale({ data }: { data: FlashSaleData | null }) {
  if (!data) return null;

  // Lấy đúng 5 sản phẩm để lấp đầy 5 slot
  const displayProducts = data.products.slice(0, 5);

  return (
    <section className="py-10 bg-gradient-to-r from-[#FF5E4D] to-[#FF8A65]">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-300 fill-yellow-300 w-8 h-8 animate-pulse" />
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-wider">
                {data.name}
              </h2>
            </div>
            
            <div className="hidden md:block pl-8 border-l border-white/30">
                <span className="text-white text-sm mr-2 uppercase font-semibold">Kết thúc trong:</span>
                <div className="inline-block">
                    <CountDownTimer targetDate={data.endTime} />
                </div>
            </div>
          </div>

          <Link href="/flash-sale" className="group flex items-center gap-1 text-white font-semibold hover:text-yellow-200 transition-colors">
            Xem tất cả <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>

        {/* LIST SẢN PHẨM: 5 CỘT (md:grid-cols-5) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {displayProducts.map((product) => (
            <div key={product.id} className="bg-white p-2 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300 h-full">
               
               {/* Chỉ hiện ProductCard, đã bỏ thanh "Đã bán" */}
               <ProductCard product={product} />
               
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}