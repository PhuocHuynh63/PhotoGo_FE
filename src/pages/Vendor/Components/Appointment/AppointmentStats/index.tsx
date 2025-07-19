"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select"
import { BOOKING_STATUS } from "@constants/booking"

interface Appointment {
    id: string
    customerName: string
    customerPhone: string
    date: string
    from: string | null
    to: string | null
    service: string
    location: string
    status: BOOKING_STATUS
    notes: string
}

interface AppointmentStatsProps {
    appointments: Appointment[]
}

export default function AppointmentStats({ appointments }: AppointmentStatsProps) {
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)

    // Tạo mảng các năm từ 2020 đến năm hiện tại
    const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i)

    // Lọc lịch hẹn theo năm được chọn
    const filteredAppointments = appointments?.filter((appointment) => {
        const appointmentYear = new Date(appointment.date).getFullYear()
        return appointmentYear === selectedYear
    })

    // Đếm số lượng lịch hẹn theo trạng thái
    const pendingCount = filteredAppointments?.filter((appointment) => appointment.status === BOOKING_STATUS.PENDING).length
    const confirmedCount = filteredAppointments?.filter((appointment) => appointment.status === BOOKING_STATUS.CONFIRMED).length
    const cancelledCount = filteredAppointments?.filter((appointment) => appointment.status === BOOKING_STATUS.CANCELLED).length
    const totalCount = filteredAppointments?.length

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">Thống kê nhanh</CardTitle>
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Năm" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-blue-600">{confirmedCount}</p>
                        <p className="text-xs text-blue-600">Đơn chờ xác nhận</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">{pendingCount}</p>
                        <p className="text-xs text-green-600">Đơn đã xác nhận</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                        <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
                        <p className="text-xs text-red-600">Đơn hủy</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                        <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-purple-600">{totalCount}</p>
                        <p className="text-xs text-purple-600">Tổng đơn</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
