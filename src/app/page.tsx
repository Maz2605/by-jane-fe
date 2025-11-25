import Header from "@/components/common/Header"; 
import Hero from "@/components/home/Hero";
import CategoryList from "@/components/home/CategoryList";
import ProductList from "@/components/product/ProductList";
import SectionTitle from "@/components/common/SectionTitle";
import FlashSale from "@/components/home/FlashSale";
import Footer from "@/components/common/Footer";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero/>
      <FlashSale/>
      <CategoryList/>
      <ProductList/>
      <Footer/>
    
    </main>
  );
}