"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Progress } from "@components/Atoms/ui/progress"
import { ArrowUpRight } from "lucide-react"

interface FinancialSummaryProps {
    data: {
        monthlyRevenue: number
        monthlyProfit: number
        profitMargin: number
        taxRate: number
    }
}

export default function FinancialSummary({ data }: FinancialSummaryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <Card className="bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Thông tin tài chính</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Doanh thu tháng này</span>
                        <span className="text-lg font-medium">{formatCurrency(data?.monthlyRevenue)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>Tăng 8.5% so với tháng trước</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Lợi nhuận tháng này (gộp)</span>
                        <span className="text-lg font-medium">{formatCurrency(data?.monthlyProfit)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>Tăng 5.2% so với tháng trước</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Tỷ lệ lợi nhuận / doanh thu</span>
                        <span className="text-lg font-medium">{data?.profitMargin}%</span>
                    </div>
                    <Progress value={data?.profitMargin} className="h-2" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Tỷ lệ thuế thu nhập</span>
                        <span className="text-lg font-medium">{data?.taxRate}%</span>
                    </div>
                    <Progress value={data?.taxRate} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}
