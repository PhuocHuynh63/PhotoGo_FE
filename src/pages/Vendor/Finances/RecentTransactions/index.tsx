"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Badge } from "@components/Atoms/ui/badge"
import { FileText, ChevronRight } from "lucide-react"

interface Transaction {
    id: string
    type: "booking" | "payment" | "refund" | "withdrawal"
    description: string
    date: string
    time: string
    amount: number
    status: "pending" | "completed" | "cancelled"
}

interface RecentTransactionsProps {
    transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
    // Lấy 5 giao dịch gần nhất
    const recentTransactions = transactions?.slice(0, 5)

    // Hàm để hiển thị ngày
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    // Hàm để hiển thị số tiền
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Hàm để hiển thị màu số tiền
    const getAmountColor = (amount: number) => {
        return amount >= 0 ? "text-green-600" : "text-red-600"
    }

    // Hàm để hiển thị dấu trước số tiền
    const getAmountSign = (amount: number) => {
        return amount >= 0 ? "+" : ""
    }

    // Hàm để hiển thị trạng thái
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã hoàn thành</Badge>
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang xử lý</Badge>
            case "cancelled":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>
            default:
                return null
        }
    }

    return (
        <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Giao dịch gần đây</CardTitle>
                <Button variant="ghost" size="sm" className="h-8">
                    <span>Xem tất cả</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentTransactions?.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{transaction.description}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(transaction.date)} - {transaction.time}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-medium ${getAmountColor(transaction.amount)}`}>
                                            {getAmountSign(transaction.amount)}
                                            {formatCurrency(transaction.amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
