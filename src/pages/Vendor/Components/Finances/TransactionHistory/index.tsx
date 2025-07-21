"use client"

import { useState } from "react"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Input } from "@components/Atoms/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select"
import { Badge } from "@components/Atoms/ui/badge"
import { Download, Search, Filter } from "lucide-react"
import { IFinanceOverview } from "@models/overview/common.model"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"

interface TransactionHistoryProps {
    transactions: IFinanceOverview["recentTransactions"]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")

    // Lọc giao dịch theo từ khóa tìm kiếm và bộ lọc
    const filteredTransactions = transactions?.filter((transaction) => {
        const matchesSearch =
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
        // Loại bỏ category filter vì không có trường category
        // const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter

        return matchesSearch && matchesStatus // && matchesCategory
    })

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

    // Hàm để hiển thị trạng thái (giống RecentTransactions)
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Hoàn thành":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Đã hoàn thành</Badge>
                )
            case "Chờ xử lý":
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang xử lý</Badge>
                )
            case "Đã hủy":
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>
                )
            default:
                return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
        }
    }

    return (
        <Card className="bg-white p-2">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="w-full sm:max-w-md relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm giao dịch..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40 h-9">
                                    <SelectValue placeholder="Tất cả trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                                    <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
                                    <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-40 h-9">
                                    <SelectValue placeholder="Tất cả loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả loại</SelectItem>
                                    <SelectItem value="Đặt cọc">Đặt cọc</SelectItem>
                                    <SelectItem value="Thanh toán còn lại">Thanh toán còn lại</SelectItem>
                                    <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                                    <SelectItem value="Hoàn tiền">Hoàn tiền</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button variant="outline" className="h-9 gap-1">
                            <Filter className="w-4 h-4" />
                            Lọc
                        </Button>

                        <Button variant="outline" className="h-9 gap-1">
                            <Download className="w-4 h-4" />
                            Xuất
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mã GD</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ngày</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mô tả</th>
                                {/* <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Loại</th> */}
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Trạng thái</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Số tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions && filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{transaction.id}</td>
                                        <td className="py-3 px-4">
                                            <div>{formatDate(transaction.date)}</div>
                                            <div className="text-xs text-gray-500">{formatTime(transaction.date)}</div>
                                        </td>
                                        <td className="py-3 px-4">{transaction.description}</td>
                                        {/* <td className="py-3 px-4">{getCategoryBadge(transaction.category)}</td> */}
                                        <td className="py-3 px-4">{getStatusBadge(transaction.status)}</td>
                                        <td className={`py-3 px-4 text-right font-medium ${getAmountColor(transaction.amount)}`}>
                                            {getAmountSign(transaction.amount)}
                                            {formatPrice(transaction.amount)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            {/* SVG minh họa */}
                                            <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                                                <rect width="64" height="64" rx="12" fill="#F3F4F6" />
                                                <path d="M20 44V36C20 34.8954 20.8954 34 22 34H42C43.1046 34 44 34.8954 44 36V44" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" />
                                                <circle cx="32" cy="28" r="6" stroke="#A1A1AA" strokeWidth="2" />
                                            </svg>
                                            <span>Không có giao dịch nào</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
