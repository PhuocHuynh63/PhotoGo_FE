"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { Button } from "@components/Atoms/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@components/Atoms/ui/avatar"
import { MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { BookingStatus } from "@constants/bookingStatus"

interface Appointment {
    id: string
    customerName: string
    customerPhone: string
    date: string
    from: string | null
    to: string | null
    service: string
    location: string
    status: BookingStatus
    notes: string
}

export type { Appointment }

interface AppointmentTableProps {
    appointments: Appointment[]
}

export default function AppointmentTable({ appointments }: AppointmentTableProps) {
    const [filter, setFilter] = useState<BookingStatus>(BookingStatus.PENDING)

    // Lọc lịch hẹn theo trạng thái
    const filteredAppointments = appointments?.filter((appointment) => {
        if (filter === BookingStatus.PENDING) return appointment.status === BookingStatus.PENDING
        if (filter === BookingStatus.PAID) return appointment.status === BookingStatus.PAID
        if (filter === BookingStatus.COMPLETED) return appointment.status === BookingStatus.COMPLETED
        if (filter === BookingStatus.CANCELLED) return appointment.status === BookingStatus.CANCELLED
        return true
    })

    // Hàm để hiển thị ngày
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    // Hàm để hiển thị trạng thái
    const getStatusBadge = (status: string) => {
        switch (status) {
            case BookingStatus.PENDING:
                return (
                    <div className="flex items-center justify-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5"></span>
                        Chờ xử lý
                    </div>
                )
            case BookingStatus.PAID:
                return (
                    <div className="flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                        Đã thanh toán
                    </div>
                )
            case BookingStatus.COMPLETED:
                return (
                    <div className="flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>
                        Hoàn thành
                    </div>
                )
            case BookingStatus.CANCELLED:
                return (
                    <div className="flex items-center justify-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs">
                        <span className="w-2 h-2 rounded-full bg-red-400 mr-1.5"></span>
                        Đã hủy
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="border-b border-gray-200">
                    <Tabs defaultValue={BookingStatus.PENDING} onValueChange={(value) => setFilter(value as BookingStatus)} className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                            <TabsTrigger
                                value={BookingStatus.PENDING}
                                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                Chờ xác nhận
                            </TabsTrigger>
                            <TabsTrigger
                                value={BookingStatus.PAID}
                                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                Đã xác nhận
                            </TabsTrigger>
                            <TabsTrigger
                                value={BookingStatus.COMPLETED}
                                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                Hoàn thành
                            </TabsTrigger>
                            <TabsTrigger
                                value={BookingStatus.CANCELLED}
                                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                Đã hủy
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 text-xs text-gray-500">
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Mã đơn</th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Khách hàng</th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Ngày & giờ</th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Dịch vụ</th>
                                <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Trạng thái</th>
                                <th className="whitespace-nowrap px-4 py-3 text-center font-medium">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments?.map((appointment) => (
                                <tr key={appointment.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-4 py-3 font-medium">{appointment.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="/placeholder.svg" alt={appointment.customerName} />
                                                <AvatarFallback>{appointment.customerName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{appointment.customerName}</p>
                                                <p className="text-xs text-gray-500">{appointment.customerPhone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <p className="text-sm">{formatDate(appointment.date)}</p>
                                        <p className="text-xs text-gray-500">
                                            {appointment.from} - {appointment.to}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm">{appointment.service}</p>
                                        <p className="text-xs text-gray-500">{appointment.location}</p>
                                    </td>
                                    <td className="px-4 py-3">{getStatusBadge(appointment.status)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
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
