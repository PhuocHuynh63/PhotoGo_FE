"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select"

interface StatisticsChartsProps {
    data: {
        bookingsByMonth: Array<{
            month: string
            count: number
        }>
        revenueByMonth: Array<{ month: string; amount: number }>
    }
}

export default function StatisticsCharts({ data }: StatisticsChartsProps) {
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)

    // Tạo mảng các năm từ 2020 đến năm hiện tại
    const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i)

    // Lọc dữ liệu theo năm được chọn
    const filteredData = {
        ...data,
        bookingsByMonth: data?.bookingsByMonth?.filter((item) => {
            const year = item.month.split(" ")[2]
            return parseInt(year) === selectedYear
        }),
        revenueByMonth: data?.revenueByMonth?.filter((item) => {
            const year = item.month.split(" ")[2]
            return parseInt(year) === selectedYear
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Tạo dữ liệu mẫu nếu không có dữ liệu
    const sampleData = [
        { month: "Tháng 1", count: 0 },
        { month: "Tháng 2", count: 0 },
        { month: "Tháng 3", count: 0 },
        { month: "Tháng 4", count: 0 },
        { month: "Tháng 5", count: 0 },
        { month: "Tháng 6", count: 0 },
        { month: "Tháng 7", count: 0 },
        { month: "Tháng 8", count: 0 },
        { month: "Tháng 9", count: 0 },
        { month: "Tháng 10", count: 0 },
        { month: "Tháng 11", count: 0 },
        { month: "Tháng 12", count: 0 },
    ]

    const chartData = filteredData?.bookingsByMonth?.length > 0 ? filteredData?.bookingsByMonth : sampleData

    return (
        <Tabs defaultValue="bookings" className="space-y-4">
            <TabsList>
                <TabsTrigger value="bookings">Lịch hẹn</TabsTrigger>
                <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Lịch hẹn theo tháng</CardTitle>
                            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Năm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                        <div className="flex items-center justify-between">
                            <CardTitle>Doanh thu theo tháng</CardTitle>
                            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Năm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                                    <Tooltip formatter={(value) => [formatCurrency(value as number), "Doanh thu"]} />
                                    <Line type="monotone" dataKey="count" stroke="#f97316" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
