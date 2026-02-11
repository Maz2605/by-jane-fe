export type NotificationType = "order" | "system" | "customer" | "promotion";

export interface Notification {
    id: string;
    title: string;
    description: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string; // ISO string for easy sorting
    link?: string;
}

export const mockNotifications: Notification[] = [
    {
        id: "notif-1",
        title: "Đơn hàng mới #ORD-1024",
        description: "Khách hàng Nguyễn Văn A vừa đặt hàng 2 sản phẩm.",
        type: "order",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        link: "/admin/orders/ORD-1024"
    },
    {
        id: "notif-2",
        title: "Cảnh báo tồn kho",
        description: "Sản phẩm 'Áo Thun Basic - Trắng / L' chỉ còn 2 sản phẩm.",
        type: "system",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        link: "/admin/products/PROD-001"
    },
    {
        id: "notif-3",
        title: "Khách hàng mới đăng ký",
        description: "Chào mừng thành viên mới: tran.thi.b@example.com",
        type: "customer",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        link: "/admin/customers/CUST-123"
    },
    {
        id: "notif-4",
        title: "Đơn hàng #ORD-1020 hoàn thành",
        description: "Giao hàng thành công. Doanh thu +500.000đ",
        type: "order",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        link: "/admin/orders/ORD-1020"
    },
    {
        id: "notif-5",
        title: "Khuyến mãi 'Mùa Hè' sắp hết hạn",
        description: "Chương trình khuyến mãi giảm 20% sẽ kết thúc vào ngày mai.",
        type: "promotion",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        link: "/admin/vouchers/VOUCHER-SUMMER"
    }
];
