import { fetchAPI, getStrapiMedia } from "./base";
import qs from "qs";

// ---------------------------------------------------------
// 1. HÀM HELPER: FORMAT DỮ LIỆU (QUAN TRỌNG NHẤT)
// ---------------------------------------------------------
export function formatProductData(item: any) {
  // A. Lấy thông tin cơ bản (Check cả viết hoa/thường do Strapi v5 đổi mới)
  const name = item.Name || item.name || item.attributes?.name;
  
  // B. Xử lý Giá & Giảm giá
  const price = item.Price || item.price || item.attributes?.price || 0;
  const rawOriginalPrice = item.OriginalPrice || item.originalPrice || item.attributes?.originalPrice;

  let finalOriginalPrice = null;
  let discountPercent = 0;

  // Logic: Chỉ hiện giảm giá khi (Có giá gốc trong DB) VÀ (Giá gốc > Giá bán)
  if (rawOriginalPrice && rawOriginalPrice > price) {
    finalOriginalPrice = rawOriginalPrice;
    discountPercent = Math.round(((rawOriginalPrice - price) / rawOriginalPrice) * 100);
  }

  // C. Xử lý Ảnh (Support Single/Multiple/v4/v5)
  let imageUrl = "/images/placeholder.png";
  let galleryImages: string[] = []; // Mảng chứa tất cả ảnh để làm Slider

  // Hàm phụ để đẩy ảnh vào mảng
  const pushImg = (imgData: any) => {
    if (!imgData) return;
    const url = imgData.url || imgData.attributes?.url;
    if (url) galleryImages.push(getStrapiMedia(url) || "");
  };

  // Lấy ảnh từ field Image (ảnh chính)
  const mainImgData = item.Image || item.image || item.attributes?.image;
  if (Array.isArray(mainImgData)) mainImgData.forEach(pushImg);
  else pushImg(mainImgData);

  // Nếu có field Images (Gallery) riêng thì lấy thêm
  const galleryData = item.Images || item.images || item.attributes?.images;
  if (Array.isArray(galleryData)) galleryData.forEach(pushImg);
  
  // Lấy ảnh đầu tiên làm ảnh đại diện
  if (galleryImages.length > 0) imageUrl = galleryImages[0];


  // D. Xử lý Biến thể (Variants - Size/Màu/Stock)
  const variantsData = item.Variants || item.variants || item.attributes?.variants || [];
  
  const variants = variantsData.map((v: any) => ({
    id: v.id,
    size: v.Size || v.size,
    color: v.Color || v.color || v.ColorName || v.colorName, // Tên màu
    colorCode: v.ColorCode || v.colorCode,                   // Mã màu (#FFF)
    stock: v.Stock || v.stock || 0,
  }));

  const catData = item.Category || item.category || item.attributes?.category;
  const categorySlug = catData?.Slug || catData?.slug || catData?.data?.attributes?.slug || null;

  // Lấy danh sách màu duy nhất để hiển thị chấm tròn ở Card
  const allColors = variants.map((v: any) => v.colorCode).filter(Boolean);

  return {
    id: item.id,
    name: name,
    slug: item.Slug || item.slug || item.attributes?.slug,
    categorySlug: categorySlug,
    price: price,
    originalPrice: finalOriginalPrice,
    discount: discountPercent,
    image: imageUrl,       // Ảnh đại diện (String)
    images: galleryImages, // Danh sách ảnh (Array String)
    variants: variants,    // Danh sách biến thể chi tiết
    colors: [...new Set(allColors)], // Mảng màu không trùng lặp
    description: item.Description || item.description || item.attributes?.description || "",
  };
}

// ---------------------------------------------------------
// 2. THUẬT TOÁN RANDOM THEO NGÀY (Seeded Random)
// ---------------------------------------------------------
function shuffleArrayDaily(array: any[]) {
  const dateSeed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
  
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

// ---------------------------------------------------------
// 3. CÁC HÀM GỌI API CHÍNH
// ---------------------------------------------------------

// A. Lấy sản phẩm cho Trang Chủ (Random)
export async function getDailyRandomProducts() {
  const data = await fetchAPI("/products?populate=*&pagination[limit]=100");
  if (!data || !data.data) return [];
  
  const products = data.data.map(formatProductData);
  return shuffleArrayDaily(products);
}

// B. Lấy sản phẩm cho Trang Cửa Hàng (Có Lọc, Sort, Phân trang)
export async function getProducts(
  categorySlug?: string, 
  sort?: string, 
  priceRange?: string,
  page: number = 1,
  pageSize: number = 12
) {
  
  // Xây dựng Query Object bằng thư viện qs
  const query: any = {
    populate: "*", 
    sort: (sort && sort !== "default") ? [sort] : ["createdAt:desc"],
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

  // Chuyển Object thành chuỗi URL
  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  
  const data = await fetchAPI(`/products?${queryString}`);
  
  if (!data || !data.data) return { data: [], meta: null };
  
  return {
    data: data.data.map(formatProductData),
    meta: data.meta // Trả về thông tin số trang
  };
}

// C. Lấy chi tiết 1 sản phẩm theo ID (Dùng cho trang Detail)
export async function getProductById(id: string) {
  // Dùng filter id để tương thích tốt nhất với Strapi v5
  const data = await fetchAPI(`/products?filters[id][$eq]=${id}&populate=*`);
  
  if (!data || !data.data || data.data.length === 0) return null;

  return formatProductData(data.data[0]);
}

// Hàm lấy sản phẩm liên quan
export async function getRelatedProducts(currentProductId: number, categorySlug?: string) {
  
  // Base URL: Lấy 10 sản phẩm
  let url = "/products?populate=*&pagination[limit]=10";

  // 1. Lọc cùng danh mục (Nếu có slug)
  if (categorySlug) {
    url += `&filters[category][slug][$eq]=${categorySlug}`;
  }

  // 2. Loại trừ sản phẩm đang xem
  // Lưu ý: Dùng & để nối tiếp các tham số
  url += `&filters[id][$ne]=${currentProductId}`;

  const data = await fetchAPI(url);
  
  if (!data || !data.data) return [];
  
  const products = data.data.map(formatProductData);
  
  // Trộn ngẫu nhiên để mỗi lần vào xem thấy gợi ý khác nhau
  return shuffleArrayDaily(products);
}