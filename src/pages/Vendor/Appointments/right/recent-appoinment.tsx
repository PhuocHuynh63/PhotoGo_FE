"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@components/Atoms/ui/avatar"
import { Badge } from "@components/Atoms/ui/badge"

interface Appointment {
    id: string
    customerName: string
    customerPhone: string
    date: string
    startTime: string
    endTime: string
    service: string
    location: string
    status: "pending" | "confirmed" | "completed" | "cancelled"
    notes: string
}

interface RecentAppointmentsProps {
    appointments?: Appointment[]
}

export default function RecentAppointments({ appointments = [] }: RecentAppointmentsProps) {
    // Lấy 3 lịch hẹn gần nhất
    const recentAppointments = [...(appointments || [])]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)

    // Hàm để hiển thị ngày
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    // Hàm để hiển thị trạng thái
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Chờ xác nhận</Badge>
                )
            case "confirmed":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Đã xác nhận</Badge>
            case "completed":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Hoàn thành</Badge>
            case "cancelled":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Đã hủy</Badge>
            default:
                return null
        }
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Đơn gần đây</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg" alt={appointment.customerName} />
                            <AvatarFallback>{appointment.customerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-sm">{appointment.customerName}</p>
                                    <p className="text-xs text-gray-500">
                                        {appointment.service} - {formatDate(appointment.date)}
                                    </p>
                                </div>
                                {getStatusBadge(appointment.status)}
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
