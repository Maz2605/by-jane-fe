import Header from "@/components/common/Header"; 
import Hero from "@/components/home/Hero";
import CategoryList from "@/components/home/CategoryList";
import ProductList from "@/components/product/ProductList";
import SectionTitle from "@/components/common/SectionTitle";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero/>
      <CategoryList/>
      
      <ProductList/>
      <div className="p-10 text-center text-gray-400">
        --- Nội dung Web sẽ ở đây ---
      </div>
    </main>
  );
}