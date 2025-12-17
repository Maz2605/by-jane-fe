import { fetchAPI, getStrapiMedia } from "./base";
import qs from "qs";

// =========================================================
// 1. TYPE DEFINITIONS (Định nghĩa kiểu dữ liệu chuẩn)
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
  image: string;          // Ảnh đại diện (luôn là ảnh tĩnh để hiện ở Card)
  gallery: MediaItem[];   // Danh sách media (gồm cả ảnh và video cho Slider)
  variants: ProductVariant[];
  colors: string[];
  description: string;
}

// =========================================================
// 2. HELPER: FORMAT DỮ LIỆU (CORE LOGIC)
// =========================================================

export function formatProductData(item: any): Product {
  // A. Lấy thông tin cơ bản (Support Strapi v4 & v5 nested attributes)
  const attrs = item.attributes || item;
  const name = attrs.Name || attrs.name;

  // B. Xử lý Giá & Giảm giá
  const price = attrs.Price || attrs.price || 0;
  const rawOriginalPrice = attrs.OriginalPrice || attrs.originalPrice;

  let finalOriginalPrice = null;
  let discountPercent = 0;

  if (rawOriginalPrice && rawOriginalPrice > price) {
    finalOriginalPrice = rawOriginalPrice;
    discountPercent = Math.round(((rawOriginalPrice - price) / rawOriginalPrice) * 100);
  }

  // C. Xử lý Media (Ảnh & Video)
  const gallery: MediaItem[] = [];

  // Hàm helper nội bộ để xử lý từng file media
  const processMedia = (mediaData: any) => {
    if (!mediaData) return;
    
    // Xử lý structure của Strapi (đôi khi media nằm trong attributes, đôi khi không)
    const mediaAttrs = mediaData.attributes || mediaData;
    const url = getStrapiMedia(mediaAttrs.url);
    const mime = mediaAttrs.mime || "";

    if (url) {
      gallery.push({
        id: mediaData.id || Math.random(), // Fallback ID nếu thiếu
        url: url,
        // Logic nhận diện Video: check chuỗi mime type (vd: "video/mp4")
        type: mime.startsWith("video") ? "video" : "image",
        mime: mime,
      });
    }
  };

  // 1. Lấy từ field "Image" (Ảnh chính)
  const mainImgData = attrs.Image || attrs.image;
  if (Array.isArray(mainImgData)) mainImgData.forEach(processMedia);
  else processMedia(mainImgData);

  // 2. Lấy từ field "Images" (Gallery phụ)
  const galleryData = attrs.Images || attrs.images;
  if (Array.isArray(galleryData)) galleryData.forEach(processMedia);
  else processMedia(galleryData);

  // 3. Chọn ảnh đại diện (Thumbnail) cho Card sản phẩm
  // Logic: Tìm item đầu tiên là IMAGE. Nếu không có image nào thì dùng placeholder.
  const firstImage = gallery.find((m) => m.type === "image");
  const thumbnailUrl = firstImage ? firstImage.url : "/images/placeholder.png";

  // D. Xử lý Biến thể (Variants)
  const variantsData = attrs.Variants || attrs.variants || [];
  const variants: ProductVariant[] = variantsData.map((v: any) => ({
    id: v.id,
    size: v.Size || v.size,
    color: v.Color || v.color || v.ColorName || v.colorName,
    colorCode: v.ColorCode || v.colorCode,
    stock: v.Stock || v.stock || 0,
  }));

  // E. Xử lý Danh mục
  const catData = attrs.Category || attrs.category;
  // Deep check để lấy slug danh mục an toàn
  const catAttrs = catData?.data?.attributes || catData?.attributes || catData;
  const categorySlug = catAttrs?.Slug || catAttrs?.slug || null;

  // Lấy danh sách màu unique
  const allColors = variants.map((v) => v.colorCode).filter(Boolean);

  return {
    id: item.id,
    name: name,
    slug: attrs.Slug || attrs.slug,
    categorySlug: categorySlug,
    price: price,
    originalPrice: finalOriginalPrice,
    discount: discountPercent,
    image: thumbnailUrl,     // String: dùng cho Product Card
    gallery: gallery,        // Array Object: dùng cho Product Gallery (có video)
    variants: variants,
    colors: [...new Set(allColors)],
    description: attrs.Description || attrs.description || "",
  };
}

// =========================================================
// 3. THUẬT TOÁN RANDOM THEO NGÀY (Seeded Random)
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
// 4. API METHODS (Các hàm gọi dữ liệu)
// =========================================================

// A. Trang chủ (Random products)
export async function getDailyRandomProducts() {
  const data = await fetchAPI("/products?populate=*&pagination[limit]=100");
  if (!data || !data.data) return [];
  
  const products = data.data.map(formatProductData);
  return shuffleArrayDaily(products);
}

// B. Trang cửa hàng (Filter, Sort, Paginate)
export async function getProducts(
  categorySlug?: string,
  sort?: string,
  priceRange?: string,
  page: number = 1,
  pageSize: number = 12
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

  // Lọc theo Danh mục
  if (categorySlug) {
    query.filters.category = {
      slug: { $eq: categorySlug },
    };
  }

  // Lọc theo Giá
  if (priceRange) {
    const [min, max] = priceRange.split("-");
    query.filters.price = {};
    if (min) query.filters.price.$gte = min;
    if (max) query.filters.price.$lte = max;
  }

  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  const data = await fetchAPI(`/products?${queryString}`);

  if (!data || !data.data) return { data: [], meta: null };

  return {
    data: data.data.map(formatProductData),
    meta: data.meta,
  };
}

// C. Trang chi tiết (Detail)
export async function getProductById(id: string) {
  // Dùng filter id để an toàn nhất với Strapi v5
  const data = await fetchAPI(`/products?filters[id][$eq]=${id}&populate=*`);
  
  if (!data || !data.data || data.data.length === 0) return null;

  return formatProductData(data.data[0]);
}

// D. Sản phẩm liên quan
export async function getRelatedProducts(currentProductId: number, categorySlug?: string) {
  let url = "/products?populate=*&pagination[limit]=10";

  // 1. Lọc cùng danh mục
  if (categorySlug) {
    url += `&filters[category][slug][$eq]=${categorySlug}`;
  }

  // 2. Loại trừ sản phẩm đang xem
  url += `&filters[id][$ne]=${currentProductId}`;

  const data = await fetchAPI(url);
  if (!data || !data.data) return [];

  const products = data.data.map(formatProductData);
  return shuffleArrayDaily(products);
}