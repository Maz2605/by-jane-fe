import qs from "qs";

// 1. Cấu hình URL
const API_URL = (process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337").replace(/\/$/, "");
export const STRAPI_URL = API_URL;

// --- 🔥 UPDATE 1: Định nghĩa Interface mới mở rộng từ RequestInit ---
// Interface này cho phép TypeScript hiểu rằng options có thể chứa 'params'
interface FetchAPIOptions extends RequestInit {
  params?: Record<string, any>; // Object params tùy ý (filters, populate, sort...)
}

// 2. Hàm xử lý link ảnh
export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${STRAPI_URL}${url}`;
}

// 3. Hàm gọi API (Core Function)
export async function fetchAPI(endpoint: string, options: FetchAPIOptions = {}) {
  // --- 🔥 UPDATE 2: Tách 'params' ra khỏi các options khác ---
  // params: để xử lý query string
  // restOptions: các options chuẩn của fetch (method, headers, body...)
  const { params, ...restOptions } = options;

  // Đảm bảo endpoint luôn bắt đầu bằng dấu /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Khởi tạo URL cơ bản
  let url = `${STRAPI_URL}/api${path}`;

  // --- 🔥 UPDATE 3: Xử lý Query String bằng qs ---
  if (params) {
    const queryString = qs.stringify(params, {
      encodeValuesOnly: true, // Giữ URL gọn gàng, dễ đọc hơn với Strapi
    });
    // Kiểm tra nếu endpoint đã có ? thì dùng & để nối, ngược lại dùng ?
    url += url.includes("?") ? `&${queryString}` : `?${queryString}`;
  }

  // Merge options mặc định
  const defaultOptions: RequestInit = {
    cache: "no-store", // SSR/Next.js: Luôn lấy data mới nhất
    headers: {
      "Content-Type": "application/json",
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...restOptions, // Chỉ merge các options chuẩn (không chứa params nữa)
    headers: {
      ...defaultOptions.headers,
      ...restOptions.headers,
    },
  };



  try {
    const res = await fetch(url, mergedOptions);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`❌ API Error (${res.status}):`, JSON.stringify(errorData, null, 2));
      throw new Error(errorData?.error?.message || `Failed to fetch API: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("🔥 Fetch Error:", error);
    throw error;
  }
}