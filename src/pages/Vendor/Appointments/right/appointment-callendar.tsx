"use client"

import { Badge } from "@components/Atoms/ui/badge"
import { Calendar } from "@components/Atoms/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { useState } from "react"
import "react-day-picker/dist/style.css"

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

export type { Appointment }

interface AppointmentCalendarProps {
    appointments: Appointment[]
}

export default function AppointmentCalendar({ appointments = [] }: AppointmentCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    // Tạo một map các ngày có lịch hẹn
    const appointmentDates = appointments.reduce(
        (acc, appointment) => {
            const dateStr = appointment.date
            if (!acc[dateStr]) {
                acc[dateStr] = []
            }
            acc[dateStr].push(appointment)
            return acc
        },
        {} as Record<string, Appointment[]>,
    )

    // Tạo danh sách lịch hẹn cho ngày đã chọn
    const selectedDateStr = date ? date.toISOString().split("T")[0] : ""
    const selectedDateAppointments = appointmentDates[selectedDateStr] || []

    // Hàm để hiển thị thời gian
    const formatTime = (timeStr: string) => {
        return timeStr
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
                <CardTitle>Lịch hẹn</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            modifiers={{
                                booked: Object.keys(appointmentDates || {}).map((dateStr) => new Date(dateStr)),
                            }}
                            modifiersClassNames={{
                                booked: "font-bold bg-orange-100 text-orange-500 hover:bg-orange-200"
                            }}
                        />
                    </div>

                    <div>
                        <h3 className="font-medium mb-4">
                            {date
                                ? date.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                                : ""}
                        </h3>

                        {selectedDateAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {selectedDateAppointments.map((appointment) => (
                                    <div key={appointment.id} className="p-3 border rounded-md">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium">{formatTime(appointment.time)}</p>
                                                <p className="text-sm text-gray-500">{appointment.duration} phút</p>
                                            </div>
                                            {getStatusBadge(appointment.status)}
                                        </div>
                                        <p className="font-medium">{appointment.customerName}</p>
                                        <p className="text-sm text-gray-500">{appointment.service}</p>
                                        {appointment.notes && <p className="text-sm mt-2 italic">{appointment.notes}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Không có lịch hẹn nào vào ngày này</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
