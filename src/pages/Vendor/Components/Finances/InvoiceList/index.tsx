"use client"

import { Card, CardContent } from "@components/Atoms/ui/card"



interface InvoiceListProps {
    invoices: {
        pendingInvoices: number
        partiallyPaidInvoices: number
        paidInvoices: number
        cancelledInvoices: number
    }
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
    // Thống kê số lượng hóa đơn theo trạng thái
    const cancelledInvoices = invoices?.cancelledInvoices;
    const paidInvoices = invoices?.paidInvoices;
    const partiallyPaidInvoices = invoices?.partiallyPaidInvoices;
    const pendingInvoices = invoices?.pendingInvoices;

    return (
        <Card className="bg-white p-2">
            <CardContent className="p-6 flex items-center justify-center min-h-[350px]">
                <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full max-w-3xl mx-auto">
                    <Card className="p-4 text-center shadow-none border border-gray-100">
                        <div className="text-sm text-gray-500">Đã thanh toán</div>
                        <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
                    </Card>
                    <Card className="p-4 text-center shadow-none border border-gray-100">
                        <div className="text-sm text-gray-500">Chưa thanh toán</div>
                        <div className="text-2xl font-bold text-yellow-600">{pendingInvoices}</div>
                    </Card>
                    <Card className="p-4 text-center shadow-none border border-gray-100">
                        <div className="text-sm text-gray-500">Thanh toán một phần</div>
                        <div className="text-2xl font-bold text-blue-600">{partiallyPaidInvoices}</div>
                    </Card>
                    <Card className="p-4 text-center shadow-none border border-gray-100">
                        <div className="text-sm text-gray-500">Đã hủy</div>
                        <div className="text-2xl font-bold text-red-600">{cancelledInvoices}</div>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}
