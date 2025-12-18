import { getStrapiMedia } from "./base";
export function mapStrapiArticleToFrontend(item: any) {
  if (!item) return null;

  // Lấy data gốc (có thể nằm trong attributes hoặc nằm thẳng ở ngoài)
  const data = item.attributes || item;

  // LOG DATA RA ĐỂ DEBUG (Xem xong xóa đi cũng được)
  // Mở Terminal của VS Code để xem dòng này in ra cái gì
  // console.log("🔍 Strapi Item Data:", JSON.stringify(data.coverImage, null, 2));

  // Hàm phụ: Cố gắng tìm URL ảnh ở mọi ngóc ngách
  const getImageUrl = (imgField: any) => {
    if (!imgField) return null;
    
    // Trường hợp 1: Strapi v4 chuẩn (data -> attributes -> url)
    if (imgField.data?.attributes?.url) return imgField.data.attributes.url;
    
    // Trường hợp 2: Strapi v5 hoặc Plugin (data -> url)
    if (imgField.data?.url) return imgField.data.url;
    
    // Trường hợp 3: Dạng phẳng (trực tiếp url)
    if (imgField.url) return imgField.url;
    
    // Trường hợp 4: Là mảng (nếu lỡ populate sai), lấy phần tử đầu
    if (Array.isArray(imgField.data) && imgField.data[0]?.attributes?.url) return imgField.data[0].attributes.url;
    if (Array.isArray(imgField.data) && imgField.data[0]?.url) return imgField.data[0].url;

    return null;
  };

  return {
    id: item.id,
    title: data.title || "Không có tiêu đề",
    slug: data.slug,
    description: data.description || "",
    content: data.content || "",
    publishedDate: data.publishedDate || data.createdAt || "",
    category: "News",
    author: data.author || "Admin",
    
    // Gọi hàm lấy ảnh bao sân
    coverImage: getStrapiMedia(getImageUrl(data.coverImage)) || null,
    
    isFeatured: data.isFeatured || false,
  };
}