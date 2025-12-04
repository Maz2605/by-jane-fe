import { fetchAPI } from "./base";

interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  note: string;
  items: any[]; // Danh sách hàng từ giỏ
  totalAmount: number;
}

export async function createOrder(orderData: OrderData) {
  
  // 1. Chuyển đổi cấu trúc Giỏ hàng (Frontend) -> Cấu trúc Strapi (Backend)
  // Strapi cần mảng 'items' là Component 'shop.OrderItem'
  const strapiItems = orderData.items.map((item) => ({
    product: item.id,        // Link tới ID sản phẩm
    productName: item.name,  // Lưu chết tên lúc mua
    price: item.price,       // Lưu chết giá lúc mua
    quantity: item.quantity,
    size: item.variant.size, // Tách riêng size
    color: item.variant.color // Tách riêng màu
  }));

  // 2. Chuẩn bị Payload gửi đi
  const payload = {
  data: {
    customerName: orderData.customerName,
    customerPhone: orderData.customerPhone,
    customerEmail: orderData.customerEmail,
    shippingAddress: orderData.shippingAddress,
    note: orderData.note, // Giờ nó nằm trong 'data' nên sẽ được chấp nhận
    totalAmount: orderData.totalAmount,
    orderStatus: "pending", 
    paymentMethod: "cod",
    items: strapiItems,
    publishedAt: new Date(), // Nếu bạn muốn publish luôn
  },
};
  // 3. Gọi API POST
  return await fetchAPI("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}