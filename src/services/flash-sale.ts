// src/services/flash-sale.ts
import { fetchAPI } from "./base";
import { formatProductData } from "./product"; // 👈 Import hàng xịn vào dùng

export async function getFlashSale() {
  const data = await fetchAPI(
    "/flash-sales?filters[isActive][$eq]=true&populate[products][populate]=*&pagination[limit]=1"
  );

  if (!data || !data.data || data.data.length === 0) return null;

  const saleEvent = data.data[0];

  return {
    id: saleEvent.id,
    name: saleEvent.name || saleEvent.Name,
    endTime: saleEvent.endTime || saleEvent.EndTime,
    
    // 👇 Magic ở đây: Dùng hàm format chung, không cần viết lại logic tính giá nữa
    products: saleEvent.products?.map(formatProductData) || []
  };
}