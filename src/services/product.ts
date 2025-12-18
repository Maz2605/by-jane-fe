import { fetchAPI, getStrapiMedia } from "./base";
import qs from "qs";

// =========================================================
// 1. TYPE DEFINITIONS
// =========================================================

export interface MediaItem {
  id: number;
  url: string;
  type: "image" | "video";
  mime: string;
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  colorCode: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  categorySlug: string | null;
  price: number;
  originalPrice: number | null;
  discount: number;
  image: string;          
  gallery: MediaItem[];   
  variants: ProductVariant[];
  colors: string[];
  description: string;
}

// =========================================================
// 2. HELPER: FORMAT DỮ LIỆU
// =========================================================

export function formatProductData(item: any): Product {
  const attrs = item.attributes || item;
  const name = attrs.Name || attrs.name;

  // Xử lý Giá & Giảm giá
  const price = attrs.Price || attrs.price || 0;
  const rawOriginalPrice = attrs.OriginalPrice || attrs.originalPrice;

  let finalOriginalPrice = null;
  let discountPercent = 0;

  if (rawOriginalPrice && rawOriginalPrice > price) {
    finalOriginalPrice = rawOriginalPrice;
    discountPercent = Math.round(((rawOriginalPrice - price) / rawOriginalPrice) * 100);
  }

  // Xử lý Media
  const gallery: MediaItem[] = [];

  const processMedia = (mediaData: any) => {
    if (!mediaData) return;
    const mediaAttrs = mediaData.attributes || mediaData;
    const url = getStrapiMedia(mediaAttrs.url);
    const mime = mediaAttrs.mime || "";

    if (url) {
      gallery.push({
        id: mediaData.id || Math.random(),
        url: url,
        type: mime.startsWith("video") ? "video" : "image",
        mime: mime,
      });
    }
  };

  // Image & Images
  const mainImgData = attrs.Image || attrs.image;
  if (Array.isArray(mainImgData)) mainImgData.forEach(processMedia);
  else processMedia(mainImgData);

  const galleryData = attrs.Images || attrs.images;
  if (Array.isArray(galleryData)) galleryData.forEach(processMedia);
  else processMedia(galleryData);

  const firstImage = gallery.find((m) => m.type === "image");
  const thumbnailUrl = firstImage ? firstImage.url : "/images/placeholder.png";

  // Variants
  const variantsData = attrs.Variants || attrs.variants || [];
  const variants: ProductVariant[] = variantsData.map((v: any) => ({
    id: v.id,
    size: v.Size || v.size,
    color: v.Color || v.color || v.ColorName || v.colorName,
    colorCode: v.ColorCode || v.colorCode,
    stock: v.Stock || v.stock || 0,
  }));

  // Category Slug
  const catData = attrs.Category || attrs.category;
  const catAttrs = catData?.data?.attributes || catData?.attributes || catData;
  const categorySlug = catAttrs?.Slug || catAttrs?.slug || null;

  const allColors = variants.map((v) => v.colorCode).filter(Boolean);

  return {
    id: item.id,
    name: name,
    slug: attrs.Slug || attrs.slug,
    categorySlug: categorySlug,
    price: price,
    originalPrice: finalOriginalPrice,
    discount: discountPercent,
    image: thumbnailUrl,     
    gallery: gallery,        
    variants: variants,
    colors: [...new Set(allColors)],
    description: attrs.Description || attrs.description || "",
  };
}

// =========================================================
// 3. THUẬT TOÁN RANDOM
// =========================================================
function shuffleArrayDaily(array: Product[]) {
  const dateSeed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  
  const mulberry32 = (a: number) => {
    return function () {
      var t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const random = mulberry32(dateSeed);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// =========================================================
// 4. API METHODS (CORE)
// =========================================================

// A. Trang chủ
export async function getDailyRandomProducts() {
  const data = await fetchAPI("/products?populate=*&pagination[limit]=100");
  if (!data || !data.data) return [];
  const products = data.data.map(formatProductData);
  return shuffleArrayDaily(products);
}

// B. Trang cửa hàng (GET PRODUCTS - SAFE MODE)
export async function getProducts(
  categorySlug?: string,
  sort?: string,
  priceRange?: string,
  page: number = 1,
  pageSize: number = 12,
  search?: string 
) {
  const query: any = {
    populate: "*",
    sort: sort && sort !== "default" ? [sort] : ["createdAt:desc"],
    pagination: {
      page: page,
      pageSize: pageSize,
    },
    filters: {},
  };

  // --- LOGIC SEARCH AN TOÀN (SAFE MODE) ---
  // Chỉ tìm kiếm theo Tên sản phẩm để tránh lỗi 400 Bad Request
  if (search) {
    query.filters.name = {
      $containsi: search, // Tìm kiếm gần đúng, không phân biệt hoa thường
    };
  }

  // --- CÁC FILTER KHÁC ---
  
  // Lọc theo Category
  if (categorySlug) {
    query.filters.category = {
      slug: { $eq: categorySlug },
    };
  }

  // Lọc theo Giá
  if (priceRange) {
    const [min, max] = priceRange.split("-");
    query.filters.price = query.filters.price || {};
    if (min) query.filters.price.$gte = Number(min);
    if (max) query.filters.price.$lte = Number(max);
  }

  // Tạo query string
  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  
  // Gọi API
  const data = await fetchAPI(`/products?${queryString}`);

  if (!data || !data.data) return { data: [], meta: null };

  return {
    data: data.data.map(formatProductData),
    meta: data.meta,
  };
}

// C. Chi tiết sản phẩm
export async function getProductById(id: string) {
  const data = await fetchAPI(`/products?filters[id][$eq]=${id}&populate=*`);
  if (!data || !data.data || data.data.length === 0) return null;
  return formatProductData(data.data[0]);
}

// D. Sản phẩm liên quan
export async function getRelatedProducts(currentProductId: number, categorySlug?: string) {
  let url = "/products?populate=*&pagination[limit]=10";
  if (categorySlug) {
    url += `&filters[category][slug][$eq]=${categorySlug}`;
  }
  url += `&filters[id][$ne]=${currentProductId}`;

  const data = await fetchAPI(url);
  if (!data || !data.data) return [];

  const products = data.data.map(formatProductData);
  return shuffleArrayDaily(products);
}