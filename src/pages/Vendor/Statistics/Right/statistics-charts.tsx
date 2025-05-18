"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface StatisticsChartsProps {
    data: {
        bookingsByMonth: Array<{ month: string; count: number }>
        revenueByMonth: Array<{ month: string; amount: number }>
    }
}

export default function StatisticsCharts({ data }: StatisticsChartsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="bookings">Lịch hẹn</TabsTrigger>
                <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
                <Card>
                    <CardHeader>
                        <CardTitle>Lịch hẹn theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.bookingsByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`${value} lịch hẹn`, "Số lượng"]} />
                                    <Bar dataKey="count" fill="#f97316" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="revenue">
                <Card>
                    <CardHeader>
                        <CardTitle>Doanh thu theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.revenueByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                                    <Tooltip formatter={(value) => [formatCurrency(value as number), "Doanh thu"]} />
                                    <Line type="monotone" dataKey="amount" stroke="#f97316" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
