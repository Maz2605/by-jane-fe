import Link from "next/link";
import { SearchX } from "lucide-react"; // Icon dùng cho lúc không tìm thấy

// --- Components ---
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import EmptyState from "@/components/common/EmptyState"; // Import component vừa tạo
import ProductFilter from "@/components/shop/ProductFilter";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductHeader from "@/components/shop/ProductHeader";

// --- Services ---
// Đảm bảo bạn đã update services/product.ts như bài trước
import { getProducts } from "@/services/product";
import { getCategories } from "@/services/category"; 

// 1. Interface cho Props của Page (Next.js 15)
interface ShopPageProps {
  searchParams: Promise<{ 
    category?: string; 
    sort?: string;
    price?: string;
    page?: string;
    limit?: string;
    search?: string; // Tham số tìm kiếm
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  
  // 2. Giải nén tham số từ URL (Async trong Next.js 15)
  const { category, sort, price, page, limit, search } = await searchParams;

  // Xử lý phân trang mặc định
  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 12;

  // 3. Gọi API song song (Parallel Fetching)
  const [productRes, categories] = await Promise.all([
    // Gọi hàm getProducts với đầy đủ tham số (bao gồm search)
    getProducts(category, sort, price, currentPage, pageSize, search), 
    getCategories(),
  ]);

  const products = productRes.data;
  const pagination = productRes.meta?.pagination; 

  // 4. Logic Dynamic Title (Tiêu đề trang)
  let pageTitle = "Tất cả sản phẩm";

  if (search) {
    pageTitle = `Kết quả tìm kiếm: "${search}"`;
  } else if (category) {
    const selectedCategory = categories.find((c: any) => c.slug === category);
    if (selectedCategory) {
      pageTitle = selectedCategory.name;
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 md:px-10 py-8 flex-1">
        
        {/* Breadcrumb Navigation */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#FF5E4D] transition-colors">
                Trang chủ
            </Link> 
            <span>/</span> 
            <span className="text-[#FF5E4D] font-medium">
                {search ? "Tìm kiếm" : "Sản phẩm"}
            </span>
        </div>

        {/* Layout: Main Content + Sidebar */}
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM (Chiếm 3/4) --- */}
            <div className="w-full md:w-3/4 order-2 md:order-1">
                
                {/* Header khu vực sản phẩm (Hiển thị số lượng) */}
                <ProductHeader 
                    title={pageTitle} 
                    count={pagination?.total || 0} 
                />

                {/* --- LOGIC QUYẾT ĐỊNH HIỂN THỊ --- */}
                {products.length > 0 ? (
                    // TRƯỜNG HỢP 1: CÓ DỮ LIỆU -> Hiển thị Grid
                    <ProductGrid 
                        products={products} 
                        pagination={pagination} 
                    />
                ) : (
                    // TRƯỜNG HỢP 2: KHÔNG CÓ DỮ LIỆU -> Hiển thị EmptyState
                    <EmptyState 
                        // Dùng icon kính lúp gạch chéo cho ngữ cảnh Search/Filter
                        icon={<SearchX size={48} strokeWidth={1.5} />} 
                        
                        // Tiêu đề thông minh: phân biệt giữa Search rỗng và Category rỗng
                        title={search 
                            ? `Không tìm thấy kết quả nào cho "${search}"` 
                            : "Chưa có sản phẩm nào phù hợp"
                        }
                        
                        description="Hãy thử sử dụng từ khóa chung chung hơn hoặc điều chỉnh lại bộ lọc."
                        
                        // Action Button: Giúp user reset lại trang thái ban đầu
                        action={
                            <Link 
                                href="/products" 
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#FF5E4D] hover:bg-orange-600 focus:outline-none transition-all transform hover:-translate-y-0.5"
                            >
                                Xóa bộ lọc & Xem tất cả
                            </Link>
                        }
                    />
                )}
                {/* --- KẾT THÚC LOGIC --- */}
                
            </div>

            {/* --- CỘT PHẢI: BỘ LỌC (Chiếm 1/4) --- */}
            <div className="w-full md:w-1/4 order-1 md:order-2">
                <ProductFilter categories={categories} />
            </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}