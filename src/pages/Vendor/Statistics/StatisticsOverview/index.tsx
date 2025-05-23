"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Calendar, DollarSign, Users, CheckCircle, XCircle, Clock } from "lucide-react"

interface StatisticsOverviewProps {
    data: {
        totalBookings: number
        completedBookings: number
        cancelledBookings: number
        pendingBookings: number
        totalRevenue: number
        averageRating: number
    }
}

export default function StatisticsOverview({ data }: StatisticsOverviewProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Tổng số lịch hẹn</CardTitle>
                    <Calendar className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data?.totalBookings}</div>
                    <p className="text-xs text-gray-500">Tổng số lịch hẹn đã đặt</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(data?.totalRevenue)}</div>
                    <p className="text-xs text-gray-500">Tổng doanh thu</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
                    <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data?.averageRating}/5</div>
                    <p className="text-xs text-gray-500">Dựa trên đánh giá của khách hàng</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Lịch hẹn hoàn thành</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data?.completedBookings}</div>
                    <p className="text-xs text-gray-500">
                        {Math.round((data?.completedBookings / data?.totalBookings) * 100)}% tổng số lịch hẹn
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Lịch hẹn đã hủy</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data?.cancelledBookings}</div>
                    <p className="text-xs text-gray-500">
                        {Math.round((data?.cancelledBookings / data?.totalBookings) * 100)}% tổng số lịch hẹn
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Lịch hẹn đang chờ</CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data?.pendingBookings}</div>
                    <p className="text-xs text-gray-500">
                        {Math.round((data?.pendingBookings / data?.totalBookings) * 100)}% tổng số lịch hẹn
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
