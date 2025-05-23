"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { FileText, Download } from "lucide-react"

interface Report {
    id: string
    name: string
    createdAt: string
    fileUrl: string
}

interface RevenueReportsProps {
    reports: Report[]
}

export default function RevenueReports({ reports }: RevenueReportsProps) {
    // Hàm để hiển thị ngày
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    return (
        <Card className="bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Báo cáo doanh thu</CardTitle>
                <p className="text-sm text-gray-500">Tải xuống báo cáo doanh thu theo tháng</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {reports?.map((report) => (
                        <div
                            key={report.id}
                            className="flex items-center justify-between gap-4 p-4 border border-gray-100 rounded-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-50 rounded-md flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium">{report.name}</p>
                                    <p className="text-xs text-gray-500">Tạo ngày: {formatDate(report.createdAt)}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-9 gap-1">
                                <Download className="h-4 w-4" />
                                <span>Tải xuống</span>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
