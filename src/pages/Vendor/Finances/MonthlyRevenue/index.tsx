"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface MonthlyRevenueProps {
    data: Array<{
        month: string
        amount: number
    }>
}

export default function MonthlyRevenue({ data }: MonthlyRevenueProps) {
    return (
        <Card className="bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Doanh thu theo tháng</CardTitle>
                <p className="text-sm text-gray-500">Tổng doanh thu theo tháng trong năm 2023</p>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `${value / 1000000}tr`}
                            />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
