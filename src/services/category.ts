import { fetchAPI, getStrapiMedia } from "./base";

export async function getCategories() {
  try {
    const data = await fetchAPI("/categories?populate=*");
    
    // Kiểm tra kỹ xem data có đúng chuẩn Strapi không
    if (!data || !data.data) {
      console.warn("API Categories trả về dữ liệu rỗng hoặc sai cấu trúc:", data);
      return [];
    }

    return data.data.map((item: any) => ({
      id: item.id,
      // Xử lý cả trường hợp viết Hoa và thường (Strapi v4/v5)
      name: item.Name || item.name,
      slug: item.Slug || item.slug,
      // Xử lý ảnh an toàn
      img: getStrapiMedia(item.Image?.url || item.image?.url) || "/images/placeholder.png"
    }));

  } catch (error) {
    // Nếu lỗi (ví dụ 404, 500, HTML response), nó sẽ nhảy vào đây
    console.error("❌ Lỗi lấy Category:", error);
    return []; // Trả về mảng rỗng để Web vẫn chạy tiếp, không bị sập
  }
}