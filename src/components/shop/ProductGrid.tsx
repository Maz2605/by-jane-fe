import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "./Pagination"; // <--- Import mới

// Thêm props pagination vào interface (Type 'any' cho meta strapi)
export default function ProductGrid({ products, pagination }: { products: any[], pagination?: any }) {
  
  if (!products || products.length === 0) {
    return (
      <EmptyState 
        title="Chưa có sản phẩm nào" 
        description="Danh mục này đang được cập nhật, vui lòng quay lại sau." 
      />
    );
  }

  return (
    <div>
      {/* Lưới sản phẩm */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* --- PHẦN PHÂN TRANG MỚI --- */}
      {pagination && (
        <Pagination 
          page={pagination.page} 
          pageCount={pagination.pageCount} 
          pageSize={pagination.pageSize} 
        />
      )}
    </div>
  );
}