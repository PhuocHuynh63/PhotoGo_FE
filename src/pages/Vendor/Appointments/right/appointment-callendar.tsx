"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"

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

interface AppointmentCalendarProps {
    appointments: Appointment[]
}

export default function AppointmentCalendar({ appointments }: AppointmentCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    // Lấy tháng và năm hiện tại
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Lấy ngày đầu tiên của tháng
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)

    // Lấy ngày cuối cùng của tháng
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

    // Lấy số ngày trong tháng
    const daysInMonth = lastDayOfMonth.getDate()

    // Lấy thứ của ngày đầu tiên (0 = Chủ Nhật, 1 = Thứ 2, ...)
    const firstDayOfWeek = firstDayOfMonth.getDay()

    // Tạo mảng các ngày trong tháng
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    // Tạo mảng các ngày trống trước ngày đầu tiên
    const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => null)

    // Kết hợp các ngày trống và các ngày trong tháng
    const allDays = [...emptyDays, ...days]

    // Tạo mảng các tuần
    const weeks = []
    for (let i = 0; i < allDays.length; i += 7) {
        weeks.push(allDays.slice(i, i + 7))
    }

    // Hàm để kiểm tra xem ngày có lịch hẹn không
    const hasAppointment = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        return appointments?.some((appointment) => appointment.date === dateStr)
    }

    // Hàm để lấy trạng thái của lịch hẹn trong ngày
    const getAppointmentStatus = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const appointmentsOnDay = appointments?.filter((appointment) => appointment.date === dateStr)

        if (appointmentsOnDay?.length === 0) return null

        if (appointmentsOnDay?.some((appointment) => appointment.status === "pending")) {
            return "pending"
        }
        if (appointmentsOnDay?.some((appointment) => appointment.status === "confirmed")) {
            return "confirmed"
        }
        if (appointmentsOnDay?.some((appointment) => appointment.status === "completed")) {
            return "completed"
        }
        if (appointmentsOnDay?.some((appointment) => appointment.status === "cancelled")) {
            return "cancelled"
        }

        return null
    }

    // Hàm để lấy màu chấm dựa trên trạng thái
    const getDotColor = (status: string | null) => {
        switch (status) {
            case "pending":
                return "bg-yellow-400"
            case "confirmed":
                return "bg-blue-400"
            case "completed":
                return "bg-green-400"
            case "cancelled":
                return "bg-red-400"
            default:
                return ""
        }
    }

    // Hàm để chuyển đến tháng trước
    const prevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    }

    // Hàm để chuyển đến tháng sau
    const nextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    }

    // Hàm để hiển thị tên tháng
    const getMonthName = () => {
        return `tháng ${currentMonth + 1} ${currentYear}`
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Lịch đặt</CardTitle>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-center mb-4">{getMonthName()}</div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                    <div className="text-gray-500">CN</div>
                    <div className="text-gray-500">T2</div>
                    <div className="text-gray-500">T3</div>
                    <div className="text-gray-500">T4</div>
                    <div className="text-gray-500">T5</div>
                    <div className="text-gray-500">T6</div>
                    <div className="text-gray-500">T7</div>
                </div>
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
                        {week.map((day, dayIndex) => {
                            if (day === null) {
                                return <div key={dayIndex} className="h-8 w-full"></div>
                            }

                            const status = getAppointmentStatus(day)
                            const dotColor = getDotColor(status)

                            return (
                                <div
                                    key={dayIndex}
                                    className="h-8 w-full flex flex-col items-center justify-center rounded-md hover:bg-gray-100 cursor-pointer relative"
                                >
                                    <span className="text-sm">{day}</span>
                                    {hasAppointment(day) && (
                                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
