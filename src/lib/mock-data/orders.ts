export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled' | 'returned' | 'refunding';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    variantName?: string;
    sku: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface Order {
    id: string; // e.g. ORD-001
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    createdAt: string;
    shippingAddress: string;
}

export const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-7829",
        customer: {
            id: "CUS-001",
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0901234567"
        },
        items: [
            {
                id: "ITEM-001",
                productId: "PROD-001",
                productName: "Áo Thun Basic (Trắng / L)",
                sku: "TSHIRT-WHI-L",
                price: 250000,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            }
        ],
        totalAmount: 500000,
        status: "processing",
        paymentStatus: "paid",
        paymentMethod: "Momo",
        createdAt: "2024-03-20T10:30:00Z",
        shippingAddress: "123 Đường Lê Lợi, Quận 1, TP.HCM"
    },
    {
        id: "ORD-7830",
        customer: {
            id: "CUS-002",
            name: "Trần Thị B",
            email: "tranthib@example.com",
            phone: "0909876543"
        },
        items: [
            {
                id: "ITEM-002",
                productId: "PROD-002",
                productName: "Quần Jeans Slim Fit (Xanh / 32)",
                sku: "JEAN-BLU-32",
                price: 450000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            }
        ],
        totalAmount: 480000, // + shipping
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "COD",
        createdAt: "2024-03-21T08:15:00Z",
        shippingAddress: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM"
    },
    {
        id: "ORD-7831",
        customer: {
            id: "CUS-003",
            name: "Lê Văn C",
            email: "levanc@example.com",
            phone: "0912345678"
        },
        items: [
            {
                id: "ITEM-003",
                productId: "PROD-003",
                productName: "Áo Khoác Denim",
                sku: "JKT-DEN-M",
                price: 650000,
                quantity: 1,
            }
        ],
        totalAmount: 650000,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "Credit Card",
        createdAt: "2024-03-19T15:45:00Z",
        shippingAddress: "789 Đường Võ Văn Kiệt, Quận 5, TP.HCM"
    },
    {
        id: "ORD-7832",
        customer: {
            id: "CUS-004",
            name: "Phạm Thị D",
            email: "phamthid@example.com",
            phone: "0987654321"
        },
        items: [
            {
                id: "ITEM-004",
                productId: "PROD-004",
                productName: "Váy Floral Summer",
                sku: "DRESS-FLO-S",
                price: 350000,
                quantity: 1,
            },
            {
                id: "ITEM-005",
                productId: "PROD-005",
                productName: "Nón Bucket",
                sku: "HAT-BUC-F",
                price: 120000,
                quantity: 1,
            }
        ],
        totalAmount: 470000,
        status: "cancelled",
        paymentStatus: "refunded",
        paymentMethod: "ZaloPay",
        createdAt: "2024-03-18T09:20:00Z",
        shippingAddress: "101 Đường Nguyễn Trãi, Quận 1, TP.HCM"
    },
    {
        id: "ORD-7833",
        customer: {
            id: "CUS-005",
            name: "Hoàng Văn E",
            email: "hoangvane@example.com",
            phone: "0934567890"
        },
        items: [
            {
                id: "ITEM-006",
                productId: "PROD-006",
                productName: "Giày Sneaker White (42)",
                sku: "SHOE-WHI-42",
                price: 850000,
                quantity: 1,
            }
        ],
        totalAmount: 850000,
        status: "shipping",
        paymentStatus: "paid",
        paymentMethod: "Momo",
        createdAt: "2024-03-21T14:30:00Z",
        shippingAddress: "222 Đường Lê Duẩn, Quận 1, TP.HCM"
    },
    {
        id: "ORD-7834",
        customer: {
            id: "CUS-006",
            name: "Đỗ Thị F",
            email: "dothif@example.com",
            phone: "0945678901"
        },
        items: [],
        totalAmount: 150000,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "COD",
        createdAt: "2024-03-22T09:00:00Z",
        shippingAddress: "333 Đường Hai Bà Trưng, Quận 1, TP.HCM"
    },
    {
        id: "ORD-7835",
        customer: {
            id: "CUS-007",
            name: "Vũ Văn G",
            email: "vuvang@example.com",
            phone: "0956789012"
        },
        items: [],
        totalAmount: 4500000,
        status: "shipping",
        paymentStatus: "paid",
        paymentMethod: "Bank Transfer",
        createdAt: "2024-03-22T14:20:00Z",
        shippingAddress: "444 Đường Điện Biên Phủ, Bình Thạnh, TP.HCM"
    },
    {
        id: "ORD-7836",
        customer: {
            id: "CUS-008",
            name: "Ngô Thị H",
            email: "ngothih@example.com",
            phone: "0967890123"
        },
        items: [],
        totalAmount: 900000,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "COD",
        createdAt: "2024-03-23T10:10:00Z",
        shippingAddress: "555 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM"
    },
    {
        id: "ORD-7837",
        customer: {
            id: "CUS-009",
            name: "Bùi Văn I",
            email: "buivani@example.com",
            phone: "0978901234"
        },
        items: [],
        totalAmount: 250000,
        status: "cancelled",
        paymentStatus: "refunded",
        paymentMethod: "Momo",
        createdAt: "2024-03-23T16:00:00Z",
        shippingAddress: "666 Đường Nguyễn Thị Minh Khai, Quận 1, TP.HCM"
    },
    {
        id: "ORD-7838",
        customer: {
            id: "CUS-010",
            name: "Lý Thị K",
            email: "lythik@example.com",
            phone: "0989012345"
        },
        items: [],
        totalAmount: 1800000,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "COD",
        createdAt: "2024-03-24T08:30:00Z",
        shippingAddress: "777 Đường Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM"
    }
];
