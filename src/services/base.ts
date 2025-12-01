// src/services/base.ts

// 1. Lấy URL (nếu có dấu / ở cuối thì cắt đi cho an toàn)
const API_URL = (process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337").replace(/\/$/, "");

export const STRAPI_URL = API_URL;

// 2. Hàm xử lý ảnh
export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${STRAPI_URL}${url}`;
}

// 3. Hàm gọi API
export async function fetchAPI(endpoint: string, options = {}) {
  // Đảm bảo endpoint bắt đầu bằng dấu /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  const url = `${STRAPI_URL}/api${path}`;
  console.log(`Calling API: ${url}`); // In ra để debug xem nó gọi đi đâu

  const res = await fetch(url, {
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    // Nếu lỗi, thử đọc text xem server trả về cái gì (để biết là lỗi HTML hay gì)
    const errorText = await res.text();
    console.error(` API Error (${res.status}):`, errorText.slice(0, 100)); // In 100 ký tự đầu
    throw new Error(`Failed to fetch API: ${res.status}`);
  }

  // Chỉ parse JSON khi chắc chắn thành công
  return res.json();
}