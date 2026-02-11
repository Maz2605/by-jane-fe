"use client";

import { useEffect, useState } from "react";
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";

import { MOCK_ORDERS } from "@/lib/mock-data/orders";

// Mock Data
const MOCK_STATS = {
    totalRevenue: 245000000,
    totalOrders: 156,
    lowStockProducts: 12,
    newCustomers: 48,
};

// Map shared mock data to the format expected by RecentOrders
// (Though we should probably update RecentOrders props to match Order type directly in the future)
const MOCK_RECENT_ORDERS = MOCK_ORDERS.map(order => ({
    id: order.id,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
}));

export default function AdminDashboard() {
    // Simulate loading for better UX
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Đang tải biểu đồ...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>

            <DashboardStats
                totalRevenue={MOCK_STATS.totalRevenue}
                totalOrders={MOCK_STATS.totalOrders}
                lowStockProducts={MOCK_STATS.lowStockProducts}
                newCustomers={MOCK_STATS.newCustomers}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RevenueChart />
                <RecentOrders orders={MOCK_RECENT_ORDERS} />
            </div>
        </div>
    );
}
