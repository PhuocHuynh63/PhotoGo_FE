"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Button } from "@/components/Atoms/ui/button"
import { Badge } from "@/components/Atoms/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select"
import AppointmentModal from "@pages/Vendor/Components/Calendars/AppointmentModal"

export interface Appointment {
    id: string
    title: string
    customerName: string
    customerPhone: string
    customerEmail: string
    service: string
    package: string
    date: string
    startTime: string
    endTime: string
    status: "confirmed" | "pending" | "cancelled"
    color: string
    notes: string
    price: number
    deposit: number
    location: string
}

interface WorkingHours {
    start: string
    end: string
    breakStart: string
    breakEnd: string
}

interface CalendarViewProps {
    appointments: Appointment[]
    workingHours: WorkingHours
}

export default function CalendarView({ appointments, workingHours }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewMode, setViewMode] = useState<"week" | "day">("week")
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Lấy tuần hiện tại
    const getWeekDays = (date: Date) => {
        const week = []
        const startOfWeek = new Date(date)
        const day = startOfWeek.getDay()
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Bắt đầu từ thứ 2
        startOfWeek.setDate(diff)

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek)
            day.setDate(startOfWeek.getDate() + i)
            week.push(day)
        }
        return week
    }

    // Tạo khung giờ làm việc
    const generateTimeSlots = () => {
        const slots = []
        const start = Number.parseInt(workingHours.start.split(":")[0])
        const end = Number.parseInt(workingHours.end.split(":")[0])

        for (let hour = start; hour <= end; hour++) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`)
        }
        return slots
    }

    const timeSlots = generateTimeSlots()
    const weekDays = getWeekDays(currentDate)

    // Lấy lịch hẹn cho ngày cụ thể
    const getAppointmentsForDate = (date: Date) => {
        const dateStr = date.toISOString().split("T")[0]
        return appointments.filter((apt) => apt.date === dateStr)
    }

    // Tính toán vị trí của appointment trong lưới
    const getAppointmentPosition = (appointment: Appointment) => {
        const startHour = Number.parseInt(appointment.startTime.split(":")[0])
        const startMinute = Number.parseInt(appointment.startTime.split(":")[1])
        const endHour = Number.parseInt(appointment.endTime.split(":")[0])
        const endMinute = Number.parseInt(appointment.endTime.split(":")[1])

        const workStart = Number.parseInt(workingHours.start.split(":")[0])
        const top = (((startHour - workStart) * 60 + startMinute) / 60) * 60 // 60px per hour
        const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) / 60
        const height = duration * 60 - 2 // -2px for gap

        return { top, height }
    }

    // Hàm để hiển thị màu theo trạng thái
    const getStatusColor = (status: string, color: string) => {
        const baseColors = {
            blue: "bg-blue-500",
            green: "bg-green-500",
            yellow: "bg-yellow-500",
            purple: "bg-purple-500",
            indigo: "bg-indigo-500",
            red: "bg-red-500",
        }

        if (status === "pending") {
            return "bg-yellow-100 border-yellow-300 text-yellow-800"
        } else if (status === "cancelled") {
            return "bg-red-100 border-red-300 text-red-800"
        }

        return `${baseColors[color as keyof typeof baseColors]} text-white`
    }

    // Navigation functions
    const goToPrevious = () => {
        const newDate = new Date(currentDate)
        if (viewMode === "week") {
            newDate.setDate(currentDate.getDate() - 7)
        } else {
            newDate.setDate(currentDate.getDate() - 1)
        }
        setCurrentDate(newDate)
    }

    const goToNext = () => {
        const newDate = new Date(currentDate)
        if (viewMode === "week") {
            newDate.setDate(currentDate.getDate() + 7)
        } else {
            newDate.setDate(currentDate.getDate() + 1)
        }
        setCurrentDate(newDate)
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    // Format date for display
    const formatDateRange = () => {
        if (viewMode === "week") {
            const firstDay = weekDays[0]
            const lastDay = weekDays[6]
            return `${firstDay.getDate()}/${firstDay.getMonth() + 1} - ${lastDay.getDate()}/${lastDay.getMonth() + 1}/${lastDay.getFullYear()}`
        } else {
            return currentDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        }
    }

    const handleAppointmentClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedAppointment(null)
    }

    return (
        <Card className="bg-white">
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-lg font-medium">Lịch làm việc</CardTitle>
                        <p className="text-sm text-gray-500">{formatDateRange()}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={viewMode} onValueChange={(value: "week" | "day") => setViewMode(value)}>
                            <SelectTrigger className="w-32 cursor-pointer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">Tuần</SelectItem>
                                <SelectItem value="day">Ngày</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={goToPrevious} className="cursor-pointer">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={goToToday} className="cursor-pointer">
                                Hôm nay
                            </Button>
                            <Button variant="outline" size="sm" onClick={goToNext} className="cursor-pointer">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <Button variant="outline" size="sm" className="cursor-pointer">
                            <Filter className="h-4 w-4 mr-1" />
                            Lọc
                        </Button>

                        <Button size="sm" className="gap-1 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Thêm lịch
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {viewMode === "week" ? (
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* Header với các ngày trong tuần */}
                            <div className="grid grid-cols-8 border-b">
                                <div className="p-3 text-sm font-medium text-gray-500 border-r">Giờ</div>
                                {weekDays.map((day, index) => (
                                    <div key={index} className="p-3 text-center border-r last:border-r-0">
                                        <div className="text-sm font-medium">{day.toLocaleDateString("vi-VN", { weekday: "short" })}</div>
                                        <div
                                            className={`text-lg font-semibold ${day.toDateString() === new Date().toDateString() ? "text-blue-600" : "text-gray-900"
                                                }`}
                                        >
                                            {day.getDate()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Lưới thời gian */}
                            <div className="relative">
                                <div className="grid grid-cols-8">
                                    {/* Cột thời gian */}
                                    <div className="border-r">
                                        {timeSlots.map((time) => (
                                            <div key={time} className="h-16 p-2 text-xs text-gray-500 border-b">
                                                {time}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Các cột ngày */}
                                    {weekDays.map((day, dayIndex) => (
                                        <div key={dayIndex} className="relative border-r last:border-r-0">
                                            {timeSlots.map((time) => (
                                                <div key={time} className="h-16 border-b border-gray-100 hover:bg-gray-50">
                                                    {/* Hiển thị giờ nghỉ trưa */}
                                                    {time === workingHours.breakStart && (
                                                        <div className="absolute inset-0 bg-gray-100 opacity-50 z-10 flex items-center justify-center">
                                                            <span className="text-xs text-gray-500">Nghỉ trưa</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Hiển thị appointments */}
                                            {getAppointmentsForDate(day).map((appointment) => {
                                                const position = getAppointmentPosition(appointment)
                                                return (
                                                    <div
                                                        key={appointment.id}
                                                        className={`absolute left-1 right-1 rounded-md border-l-4 p-2 cursor-pointer z-20 ${getStatusColor(appointment.status, appointment.color)}`}
                                                        style={{
                                                            top: `${position.top}px`,
                                                            height: `${position.height}px`,
                                                        }}
                                                        onClick={() => handleAppointmentClick(appointment)}
                                                    >
                                                        <div className="text-xs font-medium truncate">{appointment.customerName}</div>
                                                        <div className="text-xs opacity-90 truncate">{appointment.service}</div>
                                                        <div className="text-xs opacity-75">
                                                            {appointment.startTime} - {appointment.endTime}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Day view
                    <div className="p-4">
                        <div className="space-y-2">
                            {getAppointmentsForDate(currentDate).length > 0 ? (
                                getAppointmentsForDate(currentDate).map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className={`p-4 rounded-lg border-l-4 cursor-pointer ${getStatusColor(appointment.status, appointment.color)}`}
                                        onClick={() => handleAppointmentClick(appointment)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{appointment.customerName}</h4>
                                                <p className="text-sm opacity-90">{appointment.service}</p>
                                                <p className="text-sm opacity-75">{appointment.package}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">
                                                    {appointment.startTime} - {appointment.endTime}
                                                </p>
                                                <Badge
                                                    className={`mt-1 ${appointment.status === "confirmed"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {appointment.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">Không có lịch hẹn nào trong ngày này</div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
            <AppointmentModal appointment={selectedAppointment} isOpen={isModalOpen} onClose={handleCloseModal} />
        </Card>
    )
}
