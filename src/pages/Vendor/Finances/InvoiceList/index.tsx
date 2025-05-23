"use client"

import { useState } from "react"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Input } from "@components/Atoms/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select"
import { Badge } from "@components/Atoms/ui/badge"
import { Download, Search, Filter, Eye } from "lucide-react"

interface Invoice {
    id: string
    customerName: string
    issueDate: string
    dueDate: string
    status: string
    amount: number
}

interface InvoiceListProps {
    invoices: Invoice[]
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // Lọc hóa đơn theo từ khóa tìm kiếm và bộ lọc
    const filteredInvoices = invoices?.filter((invoice) => {
        const matchesSearch =
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

        return matchesSearch && matchesStatus
    })

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

    // Hàm để hiển thị trạng thái
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Đã thanh toán":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã thanh toán</Badge>
            case "Chưa thanh toán":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chưa thanh toán</Badge>
            case "Quá hạn":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Quá hạn</Badge>
            default:
                return null
        }
    }

    return (
        <Card className="bg-white p-2">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="w-full sm:max-w-md relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm hóa đơn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40 h-9">
                                <SelectValue placeholder="Tất cả trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                                <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                                <SelectItem value="Quá hạn">Quá hạn</SelectItem>
                            </SelectContent>
                        </Select>

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
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mã hóa</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Khách hàng</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ngày tạo</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Hạn thanh toán</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Trạng thái</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Số tiền</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices?.map((invoice) => (
                                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{invoice.id}</td>
                                    <td className="py-3 px-4">{invoice.customerName}</td>
                                    <td className="py-3 px-4">{formatDate(invoice.issueDate)}</td>
                                    <td className="py-3 px-4">{formatDate(invoice.dueDate)}</td>
                                    <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(invoice.amount)}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
