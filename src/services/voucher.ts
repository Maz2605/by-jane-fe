// src/services/voucher.ts
import { fetchAPI } from "./base";

export interface Voucher {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: number; // Giá trị đã chuẩn hóa (luôn là số)
  minOrderValue: number;
  description?: string;
  endDate?: string;
}

// Hàm helper để chuẩn hóa dữ liệu từ Strapi (xử lý v4/v5, tên trường khác nhau)
function normalizeVoucherData(item: any): Voucher {
  const attr = item.attributes || item; // Fallback cho Strapi v4/v5

  // 1. Xác định Type
  const type = (attr.type || "fixed").toLowerCase() as "percent" | "fixed";

  // 2. Tìm giá trị (Value) - Quét hết các tên trường có thể xảy ra
  let rawValue = 0;
  if (type === "percent") {
    rawValue = attr.percentage || attr.value || attr.amount || 0;
  } else {
    rawValue = attr.amount || attr.value || attr.discount || 0;
  }

  return {
    id: item.id,
    code: attr.code,
    type: type,
    value: Number(rawValue), // Ép kiểu số an toàn
    minOrderValue: Number(attr.minOrderValue || attr.min_order_value || 0),
    description: attr.description || "",
    endDate: attr.endDate,
    // isActive: attr.isActive ... (nếu cần mapping thêm)
  };
}

// 🟢 Hàm 1: Validate mã code nhập tay
export async function validateVoucher(code: string, orderTotal: number): Promise<Voucher> {
  const queryParams = new URLSearchParams({
    "filters[code][$eq]": code,
  });

  const response = await fetchAPI(`/vouchers?${queryParams.toString()}`, { method: "GET" });

  console.log("🔍 Check Voucher:", response.data?.[0]); // Debug log

  if (!response.data || response.data.length === 0) {
    throw new Error(`Mã giảm giá "${code}" không tồn tại.`);
  }

  const rawItem = response.data[0];
  const attr = rawItem.attributes || rawItem;
  
  // Logic check điều kiện
  if (attr.isActive === false) throw new Error("Mã giảm giá này đang bị khóa.");
  
  if (attr.endDate) {
    if (new Date() > new Date(attr.endDate)) throw new Error("Mã giảm giá đã hết hạn.");
  }

  const voucher = normalizeVoucherData(rawItem);

  if (orderTotal < voucher.minOrderValue) {
    throw new Error(`Đơn hàng cần tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}đ.`);
  }

  return voucher;
}

// 🟢 Hàm 2: Lấy danh sách Voucher public (để hiện Modal)
export async function getActiveVouchers(): Promise<Voucher[]> {
  const queryParams = new URLSearchParams({
    "filters[isActive][$eq]": "true", // Chỉ lấy mã đang bật
    "sort[0]": "value:desc",          // Sắp xếp ưu tiên giảm nhiều
  });

  const response = await fetchAPI(`/vouchers?${queryParams.toString()}`, { method: "GET" });

  if (!response.data) return [];

  // Map qua hàm chuẩn hóa để tránh lỗi undefined
  return response.data.map((item: any) => normalizeVoucherData(item));
}