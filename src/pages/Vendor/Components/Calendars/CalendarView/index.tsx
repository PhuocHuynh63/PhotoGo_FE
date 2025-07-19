"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Button } from "@/components/Atoms/ui/button"
import { Badge } from "@/components/Atoms/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select"
import AppointmentModal from "@pages/Vendor/Components/Calendars/AppointmentModal"
import { BookingStatus } from "@constants/bookingStatus"
import React from "react"

export interface Appointment {
    id: string
    title: string
    customerName: string
    customerPhone: string
    customerEmail: string
    service: string
    package: string
    date: string
    from: string | null
    to: string | null
    status: BookingStatus
    color: string
    notes: string
    alreadyPaid: number
    remain: number
    total: number
    location: string
}

interface WorkingHours {
    start: string
    end: string
    breakStart: string
    breakEnd: string
}

interface Location {
    id: string
    name: string
}

interface CalendarViewProps {
    appointments: Appointment[]
    workingHours: WorkingHours
    locations: Location[]
    selectedLocationId: string
    onLocationChange: (locationId: string) => void
    onDateRangeChange?: (from: string, to: string) => void
    onAppointmentUpdate?: (updatedAppointment: Appointment) => void
    isLoading?: boolean
}

export default function CalendarView({
    appointments,
    workingHours,
    locations,
    selectedLocationId,
    onLocationChange,
    onDateRangeChange,
    onAppointmentUpdate,
    isLoading = false
}: CalendarViewProps) {
    // Use sessionStorage to persist currentDate across re-renders
    const getInitialDate = () => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('calendar-current-date')
            if (saved) {
                return new Date(saved)
            }
        }
        return new Date()
    }
    const [currentDate, setCurrentDate] = useState(getInitialDate)
    const [viewMode, setViewMode] = useState<"week" | "day">("week")
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [localAppointments, setLocalAppointments] = useState<Appointment[]>(appointments)

    // Update local appointments when props change
    useEffect(() => {
        setLocalAppointments(appointments)
    }, [appointments])

    // Track component lifecycle
    useEffect(() => {
        return () => {
            // Cleanup if needed
        }
    }, [])

    // Save currentDate to sessionStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('calendar-current-date', currentDate.toISOString())
        }
    }, [currentDate])

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

    // Format date to DD/MM/YYYY for API
    const formatDateForAPI = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    // Get date range for current view and notify parent
    const updateDateRange = (date: Date) => {
        if (viewMode === "week") {
            const weekDays = getWeekDays(date)
            const from = formatDateForAPI(weekDays[0]) // Monday
            const to = formatDateForAPI(weekDays[6])   // Sunday
            onDateRangeChange?.(from, to)
        } else {
            // For day view, use single day
            const singleDay = formatDateForAPI(date)
            onDateRangeChange?.(singleDay, singleDay)
        }
    }

    // Update date range when component mounts or view mode changes
    React.useEffect(() => {
        updateDateRange(currentDate)
    }, [currentDate, viewMode])

    // Tạo range ngày cho appointment nhiều ngày
    const getMultiDayRange = (fromDate: string, toDate?: string) => {
        const startDate = new Date(fromDate.split('/').reverse().join('-'))
        let endDate: Date

        if (toDate) {
            // Nếu có toDate, sử dụng nó
            endDate = new Date(toDate.split('/').reverse().join('-'))
        } else {
            // Nếu không có toDate, mặc định là 7 ngày từ startDate
            endDate = new Date(startDate)
            endDate.setDate(startDate.getDate() + 6) // 7 ngày (0-6)
        }

        const formatDate = (date: Date) => {
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit'
            })
        }

        return `${formatDate(startDate)} - ${formatDate(endDate)}`
    }

    // Kiểm tra xem appointment có phải là booking nhiều ngày không
    const isMultiDayBooking = (appointment: Appointment) => {
        // Kiểm tra nếu from và to có format DD/MM/YYYY (nhiều ngày) thay vì HH:MM (trong ngày)
        if (appointment.from && appointment.to) {
            // Nếu chứa dấu '/' thì là date format (DD/MM/YYYY), không phải time format (HH:MM)
            return appointment.from.includes('/') && appointment.to.includes('/')
        }
        // Nếu từ và to đều null thì cũng có thể là booking nhiều ngày
        return (!appointment.from || !appointment.to)
    }

    // Tạo khung giờ làm việc
    const generateTimeSlots = () => {
        const slots = []
        const start = Number.parseInt(workingHours?.start?.split(":")[0] || "00")
        const end = Number.parseInt(workingHours?.end?.split(":")[0] || "00")

        for (let hour = start; hour <= end; hour++) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`)
        }
        return slots
    }

    const timeSlots = generateTimeSlots()
    const weekDays = getWeekDays(currentDate)

    // Constants for calendar layout
    const HOUR_HEIGHT = 64 // Match h-16 class (4rem = 64px)

    // Lấy lịch hẹn cho ngày cụ thể
    const getAppointmentsForDate = (date: Date) => {
        const dateStr = date.toISOString().split("T")[0]
        return localAppointments?.filter((apt) => apt?.date === dateStr)
    }

    // Tính toán vị trí của appointment trong lưới
    const getAppointmentPosition = (appointment: Appointment) => {
        // Nếu from hoặc endTime là null, đây là booking full ngày
        if (!appointment?.from || !appointment?.to) {
            const workStart = Number.parseInt(workingHours?.start?.split(":")[0] || "00")
            const workEnd = Number.parseInt(workingHours?.end?.split(":")[0] || "00")
            const fullDayDuration = workEnd - workStart
            return {
                top: 0,
                height: fullDayDuration * HOUR_HEIGHT - 2,
                isFullDay: true
            }
        }

        const startHour = Number.parseInt(appointment?.from?.split(":")[0] || "00")
        const startMinute = Number.parseInt(appointment?.from?.split(":")[1] || "00")
        const endHour = Number.parseInt(appointment?.to?.split(":")[0] || "00")
        const endMinute = Number.parseInt(appointment?.to?.split(":")[1] || "00")

        const workStart = Number.parseInt(workingHours?.start?.split(":")[0] || "00")
        const top = ((startHour - workStart) + startMinute / 60) * HOUR_HEIGHT
        const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) / 60
        const height = duration * HOUR_HEIGHT - 2 // -2px for gap

        return { top, height, isFullDay: false }
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

        if (status === "chờ xử lý") {
            return "bg-yellow-100 border-yellow-300 text-yellow-800"
        } else if (status === "đã hủy") {
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
        const today = new Date()
        setCurrentDate(today)
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

    const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
        setLocalAppointments(prevAppointments =>
            prevAppointments.map(apt =>
                apt.id === updatedAppointment.id ? updatedAppointment : apt
            )
        )
        onAppointmentUpdate?.(updatedAppointment)
    }

    return (
        <Card className="bg-white">
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-lg font-medium">Lịch làm việc</CardTitle>
                        <p className="text-sm text-gray-500">{formatDateRange()}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Location Select */}
                        <Select value={selectedLocationId} onValueChange={onLocationChange} disabled={isLoading}>
                            <SelectTrigger className="w-48 cursor-pointer">
                                <SelectValue placeholder="Chọn studio" />
                            </SelectTrigger>
                            <SelectContent>
                                {locations?.map((location) => (
                                    <SelectItem key={location.id} value={location.id}>
                                        {location.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>



                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-1 w-full">
                            {/* View Mode Select */}
                            <Select value={viewMode} onValueChange={(value: "week" | "day") => setViewMode(value)} disabled={isLoading}>
                                <SelectTrigger className="w-32 cursor-pointer">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">Tuần</SelectItem>
                                    <SelectItem value="day">Ngày</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="sm" onClick={() => {
                                goToPrevious()
                            }} className="cursor-pointer" disabled={isLoading}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                                goToToday()
                            }} className={`cursor-pointer ${currentDate.toDateString() === (new Date()).toDateString() ? "bg-orange-300 text-white hover:bg-orange-300/100" : ""}`} disabled={isLoading}>
                                Hôm nay
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                                goToNext()
                            }} className="cursor-pointer" disabled={isLoading}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
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
                                {weekDays?.map((day, index) => (
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
                                        {timeSlots?.map((time) => (
                                            <div key={time} className="h-16 p-2 text-xs text-gray-500 border-b">
                                                {time}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Các cột ngày */}
                                    {weekDays?.map((day, dayIndex) => (
                                        <div key={dayIndex} className="relative border-r last:border-r-0">
                                            {timeSlots?.map((time) => (
                                                <div key={time} className="h-16 border-b border-gray-100 hover:bg-gray-50">
                                                    {/* Hiển thị giờ nghỉ trưa */}
                                                    {time === workingHours?.breakStart && (
                                                        <div className="absolute inset-0 bg-gray-100 opacity-50 z-10 flex items-center justify-center">
                                                            <span className="text-xs text-gray-500">Nghỉ trưa</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Hiển thị appointments */}
                                            {getAppointmentsForDate(day)?.map((appointment) => {
                                                const position = getAppointmentPosition(appointment)
                                                return (
                                                    <div
                                                        key={appointment.id}
                                                        className={`absolute left-1 right-1 rounded-md border-l-4 p-2 cursor-pointer z-20 ${getStatusColor(appointment.status, appointment.color)} ${position.isFullDay ? 'border-2 border-dashed' : ''}`}
                                                        style={{
                                                            top: `${position.top}px`,
                                                            height: `${position.height}px`,
                                                        }}
                                                        onClick={() => handleAppointmentClick(appointment)}
                                                    >
                                                        <div className="text-xs font-medium truncate">{appointment.customerName}</div>
                                                        <div className="text-xs opacity-90 truncate">{appointment.service}</div>
                                                        <div className="text-xs opacity-75">
                                                            {appointment.from && appointment.to && !isMultiDayBooking(appointment)
                                                                ? `${appointment.from} - ${appointment.to}`
                                                                : isMultiDayBooking(appointment) && appointment.from
                                                                    ? `🗓️ ${getMultiDayRange(appointment.from, appointment.to || undefined)}`
                                                                    : "🗓️ Cả ngày"
                                                            }
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
                                getAppointmentsForDate(currentDate)?.map((appointment) => (
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
                                                    {appointment.from && appointment.to && !isMultiDayBooking(appointment)
                                                        ? `${appointment.from} - ${appointment.to}`
                                                        : isMultiDayBooking(appointment) && appointment.from
                                                            ? getMultiDayRange(appointment.from, appointment.to || undefined)
                                                            : "Cả ngày"
                                                    }
                                                </p>
                                                <Badge
                                                    variant='outline'
                                                    className={`mt-1 ${appointment.status === "đã thanh toán"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {appointment.status}
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
            <AppointmentModal
                appointment={selectedAppointment}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAppointmentUpdate={handleAppointmentUpdate}
            />
        </Card>
    )
}
