"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/Atoms/ui/table"
import { Button } from "@components/Atoms/ui/button"
import { Input } from "@components/Atoms/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select"
import { Badge } from "@components/Atoms/ui/badge"
import { Search, Download } from "lucide-react"

interface Transaction {
    id: string
    date: string
    customer: string
    amount: number
    status: "completed" | "pending" | "failed"
    type: "booking" | "withdrawal" | "refund"
}

export type { Transaction }

interface TransactionListProps {
    transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("vi-VN").format(date)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 hover:bg-green-100"
            case "pending":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            case "failed":
                return "bg-red-100 text-red-800 hover:bg-red-100"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "Hoàn thành"
            case "pending":
                return "Đang chờ"
            case "failed":
                return "Thất bại"
            default:
                return status
        }
    }

    const getTypeText = (type: string) => {
        switch (type) {
            case "booking":
                return "Đặt lịch"
            case "withdrawal":
                return "Rút tiền"
            case "refund":
                return "Hoàn tiền"
            default:
                return type
        }
    }

    const filteredTransactions = transactions?.filter((transaction) => {
        const matchesSearch =
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.customer.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

        return matchesSearch && matchesStatus
    })

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Lịch sử giao dịch</h3>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm theo ID hoặc khách hàng"
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="completed">Hoàn thành</SelectItem>
                            <SelectItem value="pending">Đang chờ</SelectItem>
                            <SelectItem value="failed">Thất bại</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>Xuất Excel</span>
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Ngày</TableHead>
                            <TableHead>Khách hàng/Loại</TableHead>
                            <TableHead>Số tiền</TableHead>
                            <TableHead>Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions?.length > 0 ? (
                            filteredTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">{transaction.id}</TableCell>
                                    <TableCell>{formatDate(transaction.date)}</TableCell>
                                    <TableCell>
                                        <div>{transaction.customer}</div>
                                        <div className="text-xs text-gray-500">{getTypeText(transaction.type)}</div>
                                    </TableCell>
                                    <TableCell className={transaction.amount < 0 ? "text-red-600" : "text-green-600"}>
                                        {formatCurrency(transaction.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(transaction.status)}>{getStatusText(transaction.status)}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                    Không tìm thấy giao dịch nào
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
