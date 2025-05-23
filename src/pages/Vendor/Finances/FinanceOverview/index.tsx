"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { DollarSign, CreditCard, Wallet } from "lucide-react"

interface FinanceOverviewProps {
    data: {
        totalRevenue: number
        pendingPayments: number
        availableBalance: number
    }
}

export default function FinanceOverview({ data }: FinanceOverviewProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(data?.totalRevenue)}</div>
                    <p className="text-xs text-gray-500">Tổng doanh thu từ đầu tháng</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Thanh toán đang chờ</CardTitle>
                    <CreditCard className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(data?.pendingPayments)}</div>
                    <p className="text-xs text-gray-500">Số tiền chưa được thanh toán</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Số dư khả dụng</CardTitle>
                    <Wallet className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(data?.availableBalance)}</div>
                    <p className="text-xs text-gray-500">Số tiền có thể rút</p>
                </CardContent>
            </Card>
        </div>
    )
}
