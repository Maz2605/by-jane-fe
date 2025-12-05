import { fetchAPI } from "./base"; // Hoặc đường dẫn import fetch của bạn

// Định nghĩa Interface để code gợi ý chuẩn xác
interface CartItem {
  id: number;           // ID số (VD: 7)
  documentId?: string;  // ID chuỗi của v5 (VD: "j8x...", nếu có thì tốt)
  name: string;
  price: number;
  quantity: number;     // Số lượng khách chọn mua
  variant: {
    size: string;
    color: string;
  };
}

interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  note: string;
  totalAmount: number;
  items: CartItem[];
}

export async function createOrder(orderData: OrderData) {
  console.log("🚀 [FE] Đang chuẩn bị gửi đơn hàng...", orderData);

  // 1. Map dữ liệu từ Giỏ hàng sang format API Custom
  const simplifiedItems = orderData.items.map((item) => ({
    // Gửi ID định danh sản phẩm (Ưu tiên documentId nếu có)
    productId: item.id,       
    documentId: item.documentId, 

    // 🔥 QUAN TRỌNG: Map số lượng mua (quantity) vào field tên là 'stock'
    // Lý do: Backend của bạn đang định nghĩa field số lượng mua là 'stock'
    stock: item.quantity,      
    
    // Các thông tin biến thể
    size: item.variant.size,
    color: item.variant.color,
    
    // Snapshot thông tin lúc mua (để lưu vào lịch sử đơn)
    name: item.name,          
    price: item.price         
  }));

  // 2. Chuẩn bị Payload sạch sẽ
  const payload = {
    data: {
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      shippingAddress: orderData.shippingAddress,
      note: orderData.note,
      totalAmount: orderData.totalAmount,
      
      // Mảng items đã map ở trên
      items: simplifiedItems, 
    },
  };

  // 3. Gọi API Custom Controller (Không gọi API mặc định của Strapi)
  try {
    const response = await fetchAPI("/orders/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch (error) {
    console.error("❌ [FE] Lỗi khi gọi API đặt hàng:", error);
    throw error;
  }
}