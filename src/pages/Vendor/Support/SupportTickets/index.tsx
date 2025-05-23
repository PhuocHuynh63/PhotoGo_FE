"use client"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Badge } from "@components/Atoms/ui/badge"
import { Plus, Eye } from "lucide-react"

interface Ticket {
    id: string
    title: string
    category: string
    status: string
    priority: string
    createdAt: string
    updatedAt: string
}

interface SupportTicketsProps {
    tickets: Ticket[]
}

export default function SupportTickets({ tickets }: SupportTicketsProps) {
    // Hàm để hiển thị ngày
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    // Hàm để hiển thị trạng thái
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Đang xử lý":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đang xử lý</Badge>
            case "Đã xử lý":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xử lý</Badge>
            case "Đã gửi phản hồi":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đã gửi phản hồi</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
        }
    }

    // Hàm để hiển thị độ ưu tiên
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "Cao":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cao</Badge>
            case "Trung bình":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Trung bình</Badge>
            case "Thấp":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Thấp</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{priority}</Badge>
        }
    }

    return (
        <Card className="bg-white">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-medium">Yêu cầu hỗ trợ của tôi</h3>
                        <p className="text-sm text-gray-500">Quản lý các yêu cầu hỗ trợ của bạn</p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tạo yêu cầu mới
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tiêu đề</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Danh mục</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Trạng thái</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ưu tiên</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ngày tạo</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cập nhật cuối</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets?.map((ticket) => (
                                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{ticket.id}</td>
                                    <td className="py-3 px-4">{ticket.title}</td>
                                    <td className="py-3 px-4">{ticket.category}</td>
                                    <td className="py-3 px-4">{getStatusBadge(ticket.status)}</td>
                                    <td className="py-3 px-4">{getPriorityBadge(ticket.priority)}</td>
                                    <td className="py-3 px-4">{formatDate(ticket.createdAt)}</td>
                                    <td className="py-3 px-4">{formatDate(ticket.updatedAt)}</td>
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
