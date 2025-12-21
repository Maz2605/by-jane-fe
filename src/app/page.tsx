export const dynamic = 'force-dynamic';

import Header from "@/components/common/Header";
import Hero from "@/components/home/Hero";
import CategoryList from "@/components/home/CategoryList";
import ProductList from "@/components/product/ProductList";
import FlashSale from "@/components/home/FlashSale";
import HomeNewsSection from "@/components/news/HomeNewsSection"
import Footer from "@/components/common/Footer";

import { getCategories } from "@/services/category";
import { getDailyRandomProducts } from "@/services/product";
import { getFlashSale } from "@/services/flash-sale";
import { getHomepageData } from "@/services/home";

export default async function Home() {
  const slidesData = await getHomepageData();
  const slidesToRender = slidesData.length > 0 ? slidesData : undefined;
  const [categories, products, flashSaleData] = await Promise.all([
    getCategories(),
    getDailyRandomProducts(),
    getFlashSale(),
  ]);
  const randomProducts = await getDailyRandomProducts();
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero slides={slidesToRender} />
      <FlashSale data={flashSaleData} categorySlug="set-hoc-duong" />
      <CategoryList data={categories} />
      <ProductList data={randomProducts} title="Gợi ý hôm nay" />
      <HomeNewsSection/>
      <Footer />
    </main>
  );
}