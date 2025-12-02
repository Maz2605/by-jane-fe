import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProduct"; // (Check lại tên file có 's' không nhé)

// Import hàm mới
import { getProductById, getRelatedProducts } from "@/services/product";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) return notFound();

  // --- LOGIC MỚI: Lấy sản phẩm liên quan chuẩn hơn ---
  // Lấy category của sản phẩm hiện tại (Giả sử trong product đã có thông tin này)
  // Nếu chưa có thì lấy random như cũ cũng được
  const categorySlug = product.categorySlug || null; 
  
  const relatedProducts = await getRelatedProducts(product.id, categorySlug);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-10 py-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
            Trang chủ <span className="mx-2">&gt;</span> 
            Sản phẩm <span className="mx-2">&gt;</span> 
            <span className="text-[#FF5E4D] font-medium">{product.name}</span>
        </div>

        {/* ... (Phần Gallery và Info giữ nguyên) ... */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
            <div className="w-full lg:w-3/5">
                <ProductGallery images={product.images} />
            </div>
            <div className="w-full lg:w-2/5">
                <ProductInfo product={product} />
            </div>
        </div>

        {/* Tab Thông tin */}
        <div className="mb-16">
            <ProductTabs description={product.description} />
        </div>

        {/* --- PHẦN SẢN PHẨM LIÊN QUAN --- */}
        {/* Chỉ hiện khi có dữ liệu */}
        {relatedProducts.length > 0 && (
            <div className="border-t border-gray-100 pt-10">
                <RelatedProducts products={relatedProducts} />
            </div>
        )}

      </div>

      <Footer />
    </main>
  );
}