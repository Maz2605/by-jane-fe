// src/services/product.ts
import { fetchAPI, getStrapiMedia } from "./base";
import qs from "qs";

// 1. Hàm helper: Chuyên làm sạch dữ liệu thô từ Strapi
// Lý do: Cấu trúc Strapi v4/v5 lồng nhau rất sâu và hay thay đổi (hoa/thường).
// Hàm này giúp chuẩn hóa về một format duy nhất để Frontend dễ dùng.
export function formatProductData(item: any) {
  const name = item.Name || item.name || item.attributes?.name;
  
  const price = item.Price || item.price || item.attributes?.price || 0;
  const rawOriginalPrice = item.OriginalPrice || item.originalPrice || item.attributes?.originalPrice;

  let finalOriginalPrice = null;
  let discountPercent = 0;

  // Chỉ tính giảm giá khi có giá gốc và giá gốc > giá bán
  if (rawOriginalPrice && rawOriginalPrice > price) {
    finalOriginalPrice = rawOriginalPrice;
    discountPercent = Math.round(((rawOriginalPrice - price) / rawOriginalPrice) * 100);
  }

  let imageUrl = "/images/placeholder.png";
  const imgData = item.Image || item.image || item.attributes?.image;
  if (imgData) {
    if (imgData.url) imageUrl = imgData.url;
    else if (Array.isArray(imgData) && imgData[0]?.url) imageUrl = imgData[0].url;
    else if (imgData.data?.attributes?.url) imageUrl = imgData.data.attributes.url;
  }

  const variants = item.Variants || item.variants || item.attributes?.variants || [];
  const allColors = variants.map((v: any) => v.ColorCode || v.colorCode).filter(Boolean);

  return {
    id: item.id,
    name: name,
    slug: item.Slug || item.slug || item.attributes?.slug,
    price: price,
    originalPrice: finalOriginalPrice,
    discount: discountPercent,
    image: getStrapiMedia(imageUrl),
    colors: [...new Set(allColors)],
    description: item.Description || item.description || item.attributes?.description || "",
  };
}


// 2. Thuật toán Random theo ngày (Để trang chủ luôn mới mẻ)
function shuffleArrayDaily(array: any[]) {
  const dateSeed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
  
  // Hàm tạo số ngẫu nhiên từ seed
  const mulberry32 = (a: number) => {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }
  
  const random = mulberry32(dateSeed);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- CÁC HÀM CHÍNH (EXPORT RA NGOÀI DÙNG) ---
//Lấy sản phẩm bth
export async function getProducts(
  categorySlug?: string, 
  sort?: string, 
  priceRange?: string,
  page: number = 1,
  pageSize: number = 12
) {
  
  // 1. Chuẩn bị Object chứa tham số (Nhìn là hiểu ngay)
  const query: any = {
    populate: "*", // Lấy hết ảnh, relation
    sort: (sort && sort !== "default") ? [sort] : ["createdAt:desc"],
    pagination: {
      page: page,
      pageSize: pageSize,
    },
    filters: {}, // Khởi tạo bộ lọc rỗng
  };

  // 2. Logic Lọc Danh mục (Thêm vào Object filters)
  if (categorySlug) {
    query.filters.category = {
      slug: {
        $eq: categorySlug,
      },
    };
  }

  // 3. Logic Lọc Giá
  if (priceRange) {
    const [min, max] = priceRange.split("-");
    query.filters.price = {}; // Khởi tạo object giá
    
    if (min) query.filters.price.$gte = min;
    if (max) query.filters.price.$lte = max;
  }

  // --- SAU NÀY MUỐN LỌC MÀU/SIZE THÌ VIẾT TIẾP Ở ĐÂY DỄ DÀNG ---
  // if (color) query.filters.variants.color = { $eq: color };


  // 4. Biến Object thành chuỗi URL thần thánh
  // encodeValuesOnly: true để Strapi hiểu được các ký tự đặc biệt
  const queryString = qs.stringify(query, { encodeValuesOnly: true });

  // Gọi API với chuỗi vừa tạo
  const data = await fetchAPI(`/products?${queryString}`);
  
  if (!data || !data.data) return { data: [], meta: null };
  
  return {
    data: data.data.map(formatProductData),
    meta: data.meta
  };
}

// Lấy sản phẩm ngẫu nhiên cho Trang Chủ
export async function getDailyRandomProducts() {
  const data = await fetchAPI("/products?populate=*&pagination[limit]=100");
  
  if (!data || !data.data) return [];
  
  const products = data.data.map(formatProductData);
  return shuffleArrayDaily(products);
}

// Lấy sản phẩm theo Danh mục (Trang Category)
export async function getProductsByCategory(slug: string) {
  // Lọc theo slug của category
  const data = await fetchAPI(
    `/products?filters[category][slug][$eq]=${slug}&populate=*`
  );
  
  if (!data || !data.data) return [];
  
  return data.data.map(formatProductData);
}

// Lấy chi tiết 1 sản phẩm (Trang Detail)
// Dùng cho trang /products/[id]
export async function getProductById(id: string) {
  const data = await fetchAPI(`/products/${id}?populate=*`);
  
  // Strapi trả về object đơn lẻ (data.data) chứ không phải mảng
  if (!data || !data.data) return null;

  return formatProductData(data.data);
}

