"use client"

import { useState } from "react"
import { Phone, MessageSquare } from "lucide-react"
import { Badge } from "@components/Atoms/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { Button } from "@components/Atoms/ui/button"

interface Appointment {
    id: string
    customerName: string
    customerPhone: string
    date: string
    time: string
    duration: number
    service: string
    status: "confirmed" | "pending" | "cancelled"
    notes: string
}

interface AppointmentListProps {
    appointments: Appointment[]
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
    const [filter, setFilter] = useState<string>("upcoming")

    // Lọc lịch hẹn theo trạng thái
    const filteredAppointments = appointments?.filter((appointment) => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`)
        const now = new Date()

        if (filter === "upcoming") {
            return appointmentDate >= now && appointment.status !== "cancelled"
        } else if (filter === "past") {
            return appointmentDate < now || appointment.status === "cancelled"
        }
        return true
    })

    // Sắp xếp lịch hẹn theo ngày và giờ
    const sortedAppointments = filteredAppointments?.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        return dateA.getTime() - dateB.getTime()
    })

    // Hàm để hiển thị ngày
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })
    }

    // Hàm để hiển thị trạng thái
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xác nhận</Badge>
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang chờ</Badge>
            case "cancelled":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>
            default:
                return null
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Danh sách lịch hẹn</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="upcoming" onValueChange={setFilter}>
                    <TabsList className="mb-4 w-full">
                        <TabsTrigger value="upcoming" className="flex-1">
                            Sắp tới
                        </TabsTrigger>
                        <TabsTrigger value="past" className="flex-1">
                            Đã qua
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={filter}>
                        {sortedAppointments?.length > 0 ? (
                            <div className="space-y-3">
                                {sortedAppointments?.map((appointment) => (
                                    <div key={appointment.id} className="p-3 border rounded-md">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium">
                                                    {formatDate(appointment.date)} - {appointment.time}
                                                </p>
                                                <p className="text-sm text-gray-500">{appointment.service}</p>
                                            </div>
                                            {getStatusBadge(appointment.status)}
                                        </div>
                                        <p className="font-medium">{appointment.customerName}</p>
                                        <div className="mt-2 flex gap-2">
                                            <Button size="sm" variant="outline" className="h-8 px-2">
                                                <Phone className="h-3 w-3 mr-1" />
                                                Gọi
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-8 px-2">
                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                Nhắn tin
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Không có lịch hẹn nào</p>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export type { Appointment }
