import qs from "qs";

// 1. Cấu hình URL
// Tự động cắt bỏ dấu / ở cuối nếu có để tránh lỗi //api
const API_URL = (process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337").replace(/\/$/, "");

export const STRAPI_URL = API_URL;

// 2. Hàm xử lý link ảnh
export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${STRAPI_URL}${url}`;
}

// 3. Hàm gọi API (Core Function)
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Đảm bảo endpoint luôn bắt đầu bằng dấu /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  const url = `${STRAPI_URL}/api${path}`;

  // Merge options mặc định với options truyền vào
  const defaultOptions: RequestInit = {
    cache: "no-store", // Luôn lấy dữ liệu mới nhất
    headers: {
      "Content-Type": "application/json",
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options, // Options từ bên ngoài (method, body) sẽ ghi đè vào đây
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // LOG: In ra để kiểm tra xem đang gửi lệnh gì
  console.log(`📡 [${mergedOptions.method || 'GET'}] Calling API: ${url}`);

  try {
    const res = await fetch(url, mergedOptions);

    if (!res.ok) {
      // Nếu lỗi, cố gắng đọc nội dung lỗi từ Server trả về
      const errorData = await res.json().catch(() => ({})); 
      console.error(`❌ API Error (${res.status}):`, JSON.stringify(errorData, null, 2));
      
      // Ném lỗi ra để bên ngoài bắt được
      throw new Error(errorData?.error?.message || `Failed to fetch API: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("🔥 Fetch Error:", error);
    throw error;
  }
}