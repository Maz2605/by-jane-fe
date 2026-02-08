export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholder Stats */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Tổng doanh thu</h3>
                    <div className="mt-2 text-2xl font-bold">45.231.000 đ</div>
                    <p className="text-xs text-green-500 mt-1">+20.1% so với tháng trước</p>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Đơn hàng mới</h3>
                    <div className="mt-2 text-2xl font-bold">+573</div>
                    <p className="text-xs text-green-500 mt-1">+180 so với tuần trước</p>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Sản phẩm tồn kho thấp</h3>
                    <div className="mt-2 text-2xl font-bold">12</div>
                    <p className="text-xs text-red-500 mt-1">Cần nhập thêm hàng</p>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Khách hàng mới</h3>
                    <div className="mt-2 text-2xl font-bold">+24</div>
                    <p className="text-xs text-green-500 mt-1">+4 so với hôm qua</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-white p-6 shadow-sm min-h-[300px] flex items-center justify-center text-gray-400">
                    Biểu đồ doanh thu (Coming Soon)
                </div>
                <div className="col-span-3 rounded-xl border bg-white p-6 shadow-sm min-h-[300px] flex items-center justify-center text-gray-400">
                    Đơn hàng gần đây (Coming Soon)
                </div>
            </div>
        </div>
    );
}
