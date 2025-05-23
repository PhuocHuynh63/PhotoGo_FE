"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { ChevronRight } from "lucide-react"

interface Invoice {
    id: string
    customerName: string
    amount: number
    dueDate: string
}

interface UnpaidInvoicesProps {
    invoices: Invoice[]
}

export default function UnpaidInvoices({ invoices }: UnpaidInvoicesProps) {
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

    return (
        <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Hóa đơn chưa thanh toán</CardTitle>
                <Button variant="ghost" size="sm" className="h-8">
                    <span>Xem tất cả</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {invoices?.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-sm font-medium">
                                        {invoice.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{invoice.customerName}</p>
                                        <p className="text-xs text-gray-500">Hạn: {formatDate(invoice.dueDate)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-1 h-7 text-xs bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                                >
                                    Chưa thanh toán
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
