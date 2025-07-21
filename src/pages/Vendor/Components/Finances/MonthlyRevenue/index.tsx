"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { IFinanceOverview } from "@models/overview/common.model"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

interface MonthlyRevenueProps {
    data: IFinanceOverview["monthlyRevenue"]
}

export default function MonthlyRevenue({ data }: MonthlyRevenueProps) {

    const safeData = Array.isArray(data) ? data : [];
    const maxRevenue = Math.max(...safeData.map(item => item?.revenue ?? 0), 0);
    const ticks = [];
    for (let i = 0; i <= maxRevenue; i += 500000) {
        ticks.push(i);
    }

    return (
        <Card className="bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Doanh thu theo tháng</CardTitle>
                <p className="text-sm text-gray-500">Tổng doanh thu theo tháng trong năm 2023</p>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={safeData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `${value / 1000000}tr`}
                                ticks={ticks}
                            />
                            <Tooltip
                                formatter={(value) => `${Number(value).toLocaleString()} VND`}
                                labelFormatter={(label) => `Tháng ${label}`}
                                cursor={{ fill: "#e0e7ef", opacity: 0.2 }}
                            />
                            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
