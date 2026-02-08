import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProduct";

import { getProductById, getRelatedProducts } from "@/services/product";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // Next.js 15: params cần await
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) return notFound();

  // Logic lấy sản phẩm liên quan
  const categorySlug = product.categorySlug || undefined;
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

        <div className="flex flex-col lg:flex-row gap-10 mb-16">
            {/* CỘT TRÁI: GALLERY */}
            <div className="w-full lg:w-3/5">
                {/* --- SỬA Ở ĐÂY --- */}
                {/* Đổi prop 'images' thành 'items' */}
                {/* Đổi data 'product.images' thành 'product.gallery' */}
                <ProductGallery items={product.gallery} />
            </div>

            {/* CỘT PHẢI: INFO */}
            <div className="w-full lg:w-2/5">
                {/* Đảm bảo bên trong ProductInfo bạn cũng cập nhật type Product mới nhé */}
                <ProductInfo product={product} />
            </div>
        </div>

        {/* Tab Thông tin */}
        <div className="mb-16">
            <ProductTabs description={product.description} />
        </div>

        {/* --- PHẦN SẢN PHẨM LIÊN QUAN --- */}
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