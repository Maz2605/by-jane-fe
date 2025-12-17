// src/services/home.ts

import qs from "qs";
import { fetchAPI, getStrapiMedia } from "@/services/base"; // Import từ file base.ts của bạn
import { HeroSlide } from "@/components/home/Hero"; // Import Type để đảm bảo type-safe

export async function getHomepageData(): Promise<HeroSlide[]> {
  // 1. Query vẫn giữ nguyên (Strapi v5 vẫn hiểu được)
  const query = qs.stringify(
    {
      populate: {
        hero_slider: {
          populate: {
            media: { fields: ["url", "mime", "width", "height"] },
            poster: { fields: ["url"] },
          },
        },
      },
    },
    { encodeValuesOnly: true }
  );

  try {
    const res = await fetchAPI(`/homepage?${query}`);

    // --- SỬA Ở ĐÂY (Strapi v5) ---
    // Strapi v5 trả về data phẳng, không còn bọc trong .attributes nữa
    // Cũ: const rawSlides = res?.data?.attributes?.hero_slider;
    
    // Mới: Truy cập trực tiếp
    const rawSlides = res?.data?.hero_slider;

    if (!rawSlides || !Array.isArray(rawSlides)) {
      console.warn("⚠️ No hero_slider data found (Check mapping logic)");
      return [];
    }

    // 4. MAPPING DATA (Adapter cho Strapi v5)
    return rawSlides.map((item: any) => ({
      id: item.id,
      type: item.type === "video" ? "video" : "image",
      
      // SỬA TIẾP Ở ĐÂY: Media cũng không còn attributes
      // Cũ: item.media?.data?.attributes?.url
      // Mới: item.media?.url
      url: getStrapiMedia(item.media?.url) || "",
      
      poster: getStrapiMedia(item.poster?.url) || undefined,
      
      alt: item.alt_text || "Hero Banner",
    }));

  } catch (error) {
    console.error("❌ Service Error:", error);
    return [];
  }
}