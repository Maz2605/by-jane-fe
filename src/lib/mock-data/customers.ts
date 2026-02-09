export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    status: 'active' | 'blocked';
    avatar?: string;
    address?: string;
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
}

export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: "CUS-001",
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0901234567",
        totalOrders: 5,
        totalSpent: 2500000,
        lastOrderDate: "2024-03-20T10:30:00Z",
        status: "active",
        avatar: "https://i.pravatar.cc/150?u=CUS-001",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        rank: "Silver"
    },
    {
        id: "CUS-002",
        name: "Trần Thị B",
        email: "tranthib@example.com",
        phone: "0909876543",
        totalOrders: 3,
        totalSpent: 1200000,
        lastOrderDate: "2024-03-21T08:15:00Z",
        status: "active",
        avatar: "https://i.pravatar.cc/150?u=CUS-002",
        address: "456 Đường DEF, Quận 3, TP.HCM",
        rank: "Bronze"
    },
    {
        id: "CUS-003",
        name: "Lê Văn C",
        email: "levanc@example.com",
        phone: "0912345678",
        totalOrders: 12,
        totalSpent: 8500000,
        lastOrderDate: "2024-03-19T15:45:00Z",
        status: "active",
        avatar: "https://i.pravatar.cc/150?u=CUS-003",
        address: "789 Đường GHI, Quận 7, TP.HCM",
        rank: "Gold"
    },
    {
        id: "CUS-004",
        name: "Phạm Thị D",
        email: "phamthid@example.com",
        phone: "0987654321",
        totalOrders: 1,
        totalSpent: 470000,
        lastOrderDate: "2024-03-18T09:20:00Z",
        status: "blocked",
        avatar: "https://i.pravatar.cc/150?u=CUS-004",
        address: "101 Đường JKL, Quận 5, TP.HCM",
        rank: "Bronze"
    },
    {
        id: "CUS-005",
        name: "Hoàng Văn E",
        email: "hoangvane@example.com",
        phone: "0934567890",
        totalOrders: 8,
        totalSpent: 4200000,
        lastOrderDate: "2024-03-21T14:30:00Z",
        status: "active",
        avatar: "https://i.pravatar.cc/150?u=CUS-005",
        address: "202 Đường MNO, Quận 10, TP.HCM",
        rank: "Gold"
    }
];
