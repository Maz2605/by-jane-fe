import qs from "qs";
import { fetchAPI, getStrapiMedia } from "./base";

// --- 1. LẤY DANH SÁCH BÀI VIẾT ---
export async function getArticles(params: any = {}) {
  const defaultParams = {
    sort: ["publishedDate:desc", "createdAt:desc"], 
    populate: ["coverImage", "videoFile", "gallery"],
    ...params,
  };

  const queryString = qs.stringify(defaultParams, { encodeValuesOnly: true });
  return await fetchAPI(`/articles?${queryString}`);
}

// --- 2. LẤY CHI TIẾT BÀI VIẾT ---
export async function getArticleBySlug(slug: string) {
  const query = {
    filters: {
      slug: { $eq: slug },
    },
    populate: ["coverImage", "videoFile", "gallery"],
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  const res = await fetchAPI(`/articles?${queryString}`);
  return res?.data?.[0] || null;
}

// --- 3. BÀI VIẾT NỔI BẬT ---
export async function getFeaturedArticles(limit = 3) {
  const query = {
    filters: { isFeatured: { $eq: true } },
    sort: ["publishedDate:desc"],
    pagination: { limit: limit },
    populate: ["coverImage"],
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  return await fetchAPI(`/articles?${queryString}`);
}

export function mapStrapiArticleToFrontend(item: any) {
  if (!item) return null;
  const attributes = item.attributes || item;

  // 1. Logic lấy Ảnh bìa (Giữ nguyên code cũ đã fix)
  let coverImageUrl = null;
  const imgField = attributes.coverImage;
  if (imgField) {
     if (imgField.url) coverImageUrl = imgField.url;
     else if (imgField.data?.url) coverImageUrl = imgField.data.url;
     else if (imgField.data?.attributes?.url) coverImageUrl = imgField.data.attributes.url;
  }

  // 2. Logic lấy Gallery (Giữ nguyên code cũ đã fix)
  const galleryData = attributes.gallery?.data || attributes.gallery;
  let galleryImages: string[] = [];
  if (Array.isArray(galleryData)) {
    galleryImages = galleryData.map((img: any) => {
      const url = img.url || img.attributes?.url;
      return getStrapiMedia(url);
    }).filter((url) => url !== null) as string[];
  }

  // --- 3. LOGIC LẤY VIDEO (MỚI THÊM) ---
  let videoUrl = null;
  const videoField = attributes.videoFile;
  
  if (videoField) {
      // Check trường hợp Cloudinary trả thẳng url
      if (videoField.url) {
          videoUrl = videoField.url;
      } 
      // Check trường hợp nằm trong data (Strapi chuẩn)
      else if (videoField.data?.url) {
          videoUrl = videoField.data.url;
      }
      // Check trường hợp nằm sâu trong attributes
      else if (videoField.data?.attributes?.url) {
          videoUrl = videoField.data.attributes.url;
      }
  }

  return {
    id: item.id,
    title: attributes.title || "Không có tiêu đề",
    slug: attributes.slug,
    description: attributes.description || "",
    content: attributes.content || null,
    publishedDate: attributes.publishedDate || attributes.createdAt || "",
    category: "News", 
    author: attributes.author || "Admin",
    coverImage: getStrapiMedia(coverImageUrl),
    gallery: galleryImages,
    
    // Trả về Video URL đã xử lý
    video: getStrapiMedia(videoUrl), 
    
    isFeatured: attributes.isFeatured || false,
  };
}