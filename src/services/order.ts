import { fetchAPI } from "./base"; 

// --- 1. DEFINITIONS ---

export interface CartItem {
  id: number;           
  uniqueId?: string;    
  documentId?: string;  
  name: string;
  price: number;
  quantity: number;
  variant: {
    size: string;
    color: string;
  };
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  note: string;
  items: CartItem[];
  subTotal: number;       
  discountAmount: number; 
  totalAmount: number;    
  voucherCode?: string;   
  paymentMethod?: string; 
}

// --- 2. MAIN FUNCTION ---

export async function createOrder(orderData: CreateOrderInput) {
  
  // A. Map dữ liệu Items
  const simplifiedItems = orderData.items.map((item) => ({
    product: item.id,      
    productId: item.id,    
    documentId: item.documentId,
    stock: item.quantity, 
    quantity: item.quantity, 
    size: item.variant.size,
    color: item.variant.color,
    name: item.name,
    price: item.price,
  }));

  // B. Chuẩn bị Payload
  const payload = {
    customerName: orderData.customerName,
    customerPhone: orderData.customerPhone,
    customerEmail: orderData.customerEmail,
    shippingAddress: orderData.shippingAddress,
    note: orderData.note,
    items: simplifiedItems,
    subTotal: orderData.subTotal,
    discountAmount: orderData.discountAmount,
    totalAmount: orderData.totalAmount,
    voucherCode: orderData.voucherCode || null, 
    paymentMethod: orderData.paymentMethod || 'cod',
  };

  // 🔥 C. LẤY TOKEN (Key thường là 'authToken', 'token' hoặc 'jwt' tùy project bạn)
  // Hãy chắc chắn bạn đang lưu token với key là 'authToken'. 
  // Nếu bạn dùng tên khác (ví dụ 'jwt'), hãy sửa lại dòng dưới đây.
  let token = null;
  if (typeof window !== 'undefined') {
      // 👇 SỬA Ở ĐÂY: Thêm tất cả các trường hợp có thể xảy ra để "bắt dính" token
      token = localStorage.getItem('authToken') || 
              localStorage.getItem('jwt') || 
              localStorage.getItem('token') || 
              localStorage.getItem('strapi_jwt');
  }
  console.log("🔑 Token tìm thấy ở Frontend:", token);

  // D. Chuẩn bị Header Auth
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // E. Gọi API
  try {
    const response = await fetchAPI("/orders/place-order", {
      method: "POST",
      headers: headers, // Gửi header có chứa token
      body: JSON.stringify(payload),
    });

    return response;
  } catch (error) {
    console.error("❌ [Service] Lỗi call API createOrder:", error);
    throw error;
  }
}