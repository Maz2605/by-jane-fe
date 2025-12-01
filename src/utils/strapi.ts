// src/utils/strapi.ts

// 1. Lấy URL từ biến môi trường, nếu không có thì mới dùng localhost (dự phòng)
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

// 2. Hàm xử lý link ảnh (Cần kiểm tra kỹ vì Cloudinary trả về link full rồi)
export function getStrapiMedia(url: string | null) {
  if (url == null) return null;

  // Nếu ảnh đã là link online (như Cloudinary) thì giữ nguyên, KHÔNG nối thêm domain
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }

  // Chỉ nối domain Strapi nếu nó là đường dẫn tương đối (local)
  return `${STRAPI_URL}${url}`;
}
// 3. Hàm lấy danh mục (Đã chỉnh cho Strapi v5)
export async function getCategories() {
  const res = await fetch(`${STRAPI_URL}/api/categories?populate=*`, { 
    cache: "no-store" 
  });
  
  if (!res.ok) {
  // In ra mã lỗi (ví dụ: 403, 404, 500)
  console.error("Lỗi gọi API Category:", res.status, res.statusText); 
  return [];
}
  
  const data = await res.json();
  
  return data.data.map((item: any) => ({
    id: item.id,
    name: item.name, 
    slug: item.slug,
    // Lưu ý: Nếu bạn chọn Single Media thì dùng item.image?.url
    // Nếu lỡ chọn Multiple Media thì dùng item.image?.[0]?.url
    img: getStrapiMedia(item.image?.url) || "/images/placeholder.png"
  }));
}