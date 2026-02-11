"use client";

import { useState, useMemo } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Bar, Area, Line, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RevenueChart() {
    const [timeRange, setTimeRange] = useState("week");
    const [selectedYear, setSelectedYear] = useState("2024");
    const [selectedMonth, setSelectedMonth] = useState("3"); // Default March
    const [selectedWeek, setSelectedWeek] = useState("1"); // Default Week 1

    // Dynamic Data Generation
    const chartData = useMemo(() => {
        // Pseudo-random generator based on inputs to keep data consistent for same selection
        const getBaseValue = (seed: number) => {
            return 5000000 + (seed % 10) * 2000000;
        };

        if (timeRange === "week") {
            // Week View: 7 Days (T2 - CN)
            const seed = parseInt(selectedYear) + parseInt(selectedMonth) + parseInt(selectedWeek);
            return [
                { name: "T2", total: getBaseValue(seed + 1) + Math.random() * 5000000 },
                { name: "T3", total: getBaseValue(seed + 2) + Math.random() * 5000000 },
                { name: "T4", total: getBaseValue(seed + 3) + Math.random() * 5000000 },
                { name: "T5", total: getBaseValue(seed + 4) + Math.random() * 5000000 },
                { name: "T6", total: getBaseValue(seed + 5) + Math.random() * 5000000 },
                { name: "T7", total: getBaseValue(seed + 6) + Math.random() * 5000000 },
                { name: "CN", total: getBaseValue(seed + 7) + Math.random() * 5000000 },
            ];
        }

        if (timeRange === "month") {
            // Month View: Grouped by 3 days (1-3, 4-6...)
            const seed = parseInt(selectedYear) + parseInt(selectedMonth);
            return Array.from({ length: 10 }, (_, i) => ({
                name: `${i * 3 + 1}-${i * 3 + 3}`,
                total: getBaseValue(seed + i) + Math.random() * 10000000,
            }));
        }

        // Year View: 12 Months
        const seed = parseInt(selectedYear);
        return Array.from({ length: 12 }, (_, i) => ({
            name: `Thg ${i + 1}`,
            total: getBaseValue(seed + i) * 2 + Math.random() * 10000000,
        }));

    }, [timeRange, selectedYear, selectedMonth, selectedWeek]);

    return (
        <Card className="col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent text-base font-bold">
                    Doanh thu
                </CardTitle>
                <div className="flex items-center gap-2">
                    {/* Conditional Selectors */}
                    {timeRange === "week" && (
                        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                            <SelectTrigger className="w-[100px] h-8 text-xs">
                                <SelectValue placeholder="Chọn tuần" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Tuần 1</SelectItem>
                                <SelectItem value="2">Tuần 2</SelectItem>
                                <SelectItem value="3">Tuần 3</SelectItem>
                                <SelectItem value="4">Tuần 4</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    {(timeRange === "week" || timeRange === "month") && (
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[110px] h-8 text-xs">
                                <SelectValue placeholder="Chọn tháng" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <SelectItem key={i + 1} value={`${i + 1}`}>
                                        Tháng {i + 1}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[100px] h-8 text-xs">
                            <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* View Mode Selector - Moved to end */}
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[120px] h-8 text-xs font-medium border-purple-200 bg-purple-50 text-purple-900">
                            <SelectValue placeholder="Chọn thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Theo Tuần</SelectItem>
                            <SelectItem value="month">Theo Tháng</SelectItem>
                            <SelectItem value="year">Theo Năm</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {/* Revenue Chart Visualization */}
                        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#c4b5fd" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#c4b5fd" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}Tr`}
                                width={80}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-xl border border-purple-100 bg-white/95 backdrop-blur-sm p-3 shadow-lg ring-1 ring-purple-100">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground font-semibold">
                                                            DOANH THU
                                                        </span>
                                                        <span className="text-lg font-bold text-purple-700">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value as number)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="none"
                                fillOpacity={1}
                                fill="url(#colorArea)"
                            />
                            <Bar
                                dataKey="total"
                                fill="url(#colorBar)"
                                radius={[4, 4, 0, 0]}
                                barSize={32}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#ea580c"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "#ea580c", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: "#ea580c" }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
