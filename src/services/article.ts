import qs from "qs";
import { fetchAPI } from "./base";

// --- 1. LẤY DANH SÁCH BÀI VIẾT (Có Phân trang & Lọc) ---
// Dùng cho: Trang Blog (List), Trang Chủ (Latest News)
export async function getArticles(params: any = {}) {
  // Mặc định sort bài mới nhất lên đầu
  const defaultParams = {
    sort: ["publishedDate:desc", "createdAt:desc"], 
    populate: {
      coverImage: "*",
      category: "*",
      author: {
        populate: ["avatar"], // Lấy cả avatar tác giả nếu có
      },
      tags: "*",
    },
    ...params, // Ghi đè các tham số từ bên ngoài truyền vào (ví dụ: pagination)
  };

  // Dùng qs để stringify object thành chuỗi query của Strapi
  const queryString = qs.stringify(defaultParams, { encodeValuesOnly: true });

  // Gọi API: /articles?sort=...&populate=...
  return await fetchAPI(`/articles?${queryString}`);
}

// --- 2. LẤY CHI TIẾT BÀI VIẾT THEO SLUG ---
// Dùng cho: Trang chi tiết bài viết
export async function getArticleBySlug(slug: string) {
  const query = {
    filters: {
      slug: {
        $eq: slug, // Tìm bài có slug BẰNG slug truyền vào
      },
    },
    populate: {
      coverImage: "*",
      category: "*",
      author: { populate: ["avatar"] },
      tags: "*",
      // Nếu bài viết có quan hệ với sản phẩm (Shop The Look), thêm vào đây
      relatedProducts: { populate: "*" }, 
    },
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  
  const res = await fetchAPI(`/articles?${queryString}`);
  
  // Strapi luôn trả về mảng data[], ta lấy phần tử đầu tiên
  return res?.data?.[0] || null;
}

// --- 3. LẤY BÀI VIẾT NỔI BẬT (FEATURED) ---
// Dùng cho: Bento Grid ở Trang Blog hoặc Tin to ở Trang Chủ
export async function getFeaturedArticles(limit = 3) {
  const query = {
    filters: {
      isFeatured: {
        $eq: true, // Chỉ lấy bài có cờ isFeatured = true
      },
    },
    sort: ["publishedDate:desc"],
    pagination: {
      limit: limit,
    },
    populate: "*", // Lấy full ảnh
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true });

  return await fetchAPI(`/articles?${queryString}`);
}

// --- 4. LẤY BÀI VIẾT LIÊN QUAN (Theo Category) ---
// Dùng cho: Cuối trang chi tiết
export async function getRelatedArticles(currentSlug: string, categorySlug: string, limit = 2) {
  const query = {
    filters: {
      slug: {
        $ne: currentSlug, // Loại trừ bài hiện tại (Not Equal)
      },
      category: {
        slug: {
          $eq: categorySlug, // Cùng danh mục
        },
      },
    },
    pagination: {
      limit: limit,
    },
    populate: ["coverImage"], // Chỉ cần lấy ảnh bìa cho nhẹ
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true });

  return await fetchAPI(`/articles?${queryString}`);
}