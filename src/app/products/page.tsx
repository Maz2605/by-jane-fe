import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductFilter from "@/components/shop/ProductFilter";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductHeader from "@/components/shop/ProductHeader";

// Import các hàm gọi API từ Service
import { getProducts } from "@/services/product";
import { getCategories } from "@/services/category"; 

// 1. Định nghĩa kiểu dữ liệu cho tham số URL (Next.js 15)
// Các tham số này đều là chuỗi (string) hoặc undefined (không có)
interface ShopPageProps {
  searchParams: Promise<{ 
    category?: string; 
    sort?: string;
    price?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  
  // 2. Giải nén và xử lý tham số từ URL
  const { category, sort, price, page, limit } = await searchParams;

  // Chuyển đổi page và limit sang số (Mặc định là trang 1, 12 sản phẩm)
  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 12;

  // 3. Gọi API song song (Promise.all) để tối ưu tốc độ load
  const [productRes, categories] = await Promise.all([
    // getProducts giờ trả về object { data: [], meta: {} }
    getProducts(category, sort, price, currentPage, pageSize), 
    getCategories(),
  ]);

  // Tách dữ liệu sản phẩm và thông tin phân trang
  const products = productRes.data;
  const pagination = productRes.meta?.pagination; 

  // 4. Logic tính toán Tiêu đề trang (Dynamic Title)
  let pageTitle = "Tất cả sản phẩm";

  // Nếu đang lọc theo danh mục -> Tìm tên danh mục đó để hiển thị
  if (category) {
    const selectedCategory = categories.find((c: any) => c.slug === category);
    if (selectedCategory) {
      pageTitle = selectedCategory.name;
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 md:px-10 py-8 flex-1">
        
        {/* Breadcrumb (Đường dẫn) */}
        <div className="text-sm text-gray-500 mb-6">
            Trang chủ <span className="mx-2">/</span> <span className="text-[#FF5E4D]">Sản phẩm</span>
        </div>

        {/* Layout chính: Chia 2 cột */}
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* CỘT TRÁI (Main Content): Chiếm 3/4 chiều rộng */}
            <div className="w-full md:w-3/4 order-2 md:order-1">
                
                {/* A. Header của phần sản phẩm (Tiêu đề + Dropdown sắp xếp) */}
                <ProductHeader 
                    title={pageTitle} 
                    count={pagination?.total || 0} // Tổng số sản phẩm tìm thấy
                />

                {/* B. Lưới hiển thị sản phẩm + Phân trang */}
                <ProductGrid 
                    products={products} 
                    pagination={pagination} // Truyền thông tin phân trang xuống
                />
                
            </div>

            {/* CỘT PHẢI (Sidebar): Chiếm 1/4 chiều rộng */}
            <div className="w-full md:w-1/4 order-1 md:order-2">
                {/* Bộ lọc danh mục và giá */}
                <ProductFilter categories={categories} />
            </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}