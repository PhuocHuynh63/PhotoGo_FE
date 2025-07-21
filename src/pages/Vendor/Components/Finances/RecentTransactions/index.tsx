"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Badge } from "@components/Atoms/ui/badge"
import { FileText, ChevronRight } from "lucide-react"
import { BOOKING_STATUS } from "@constants/booking"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"
import { IFinanceOverview } from "@models/overview/common.model"

interface RecentTransactionsProps {
    transactions: IFinanceOverview["recentTransactions"]
    onViewAll: () => void
}

export default function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
    // Lấy 5 giao dịch gần nhất
    const recentTransactions = transactions?.slice(0, 5)

    // Hàm để hiển thị ngày
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    // Hàm để hiển thị giờ:phút từ date string
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
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
    const getStatusBadge = (status: BOOKING_STATUS) => {
        switch (status) {
            case BOOKING_STATUS.COMPLETED:
                return <Badge variant='outline' className="bg-green-100 text-green-800 hover:bg-green-100">Đã hoàn thành</Badge>
            case BOOKING_STATUS.IN_PROGRESS:
                return <Badge variant='outline' className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang xử lý</Badge>
            case BOOKING_STATUS.CANCELLED:
                return <Badge variant='outline' className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>
            default:
                return <Badge variant='outline' className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
        }
    }

    return (
        <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Giao dịch gần đây</CardTitle>
                <Button variant="ghost" size="sm" className="h-8" onClick={onViewAll}>
                    <span>Xem tất cả</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentTransactions && recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
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
                                            {formatDate(transaction.date)} - {formatTime(transaction.date)}
                                        </p>
                                        <div className="mt-1">{getStatusBadge(transaction.status as BOOKING_STATUS)}</div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-medium ${getAmountColor(transaction.amount)}`}>
                                            {getAmountSign(transaction.amount)}
                                            {formatPrice(transaction.amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-2">
                            <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                                <rect width="64" height="64" rx="12" fill="#F3F4F6" />
                                <path d="M20 44V36C20 34.8954 20.8954 34 22 34H42C43.1046 34 44 34.8954 44 36V44" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="32" cy="28" r="6" stroke="#A1A1AA" strokeWidth="2" />
                            </svg>
                            <span>Không có giao dịch nào</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
