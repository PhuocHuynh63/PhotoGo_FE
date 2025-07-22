"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { Button } from "@components/Atoms/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@components/Atoms/ui/avatar"
import { MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { BOOKING_STATUS } from "@constants/booking"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "@/components/Atoms/ui/pagination"
import React from "react"

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

export type { Appointment }

interface AppointmentTableProps {
    appointments: Appointment[]
}

export default function AppointmentTable({ appointments }: AppointmentTableProps) {
    const [filter, setFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10 // Số dòng mỗi trang

    // Lọc lịch hẹn theo trạng thái
    const filteredAppointments = appointments?.filter((appointment) => {
        if (filter === "all") return true
        if (filter === BOOKING_STATUS.PENDING) return appointment.status === BOOKING_STATUS.PENDING
        if (filter === BOOKING_STATUS.PAID) return appointment.status === BOOKING_STATUS.PAID
        if (filter === BOOKING_STATUS.COMPLETED) return appointment.status === BOOKING_STATUS.COMPLETED
        if (filter === BOOKING_STATUS.CANCELLED) return appointment.status === BOOKING_STATUS.CANCELLED
        return true
    })

    // Reset về trang 1 khi filter thay đổi
    React.useEffect(() => {
        setCurrentPage(1)
    }, [filter])

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredAppointments.length / pageSize)
    const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    // Hàm để hiển thị ngày
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    // Hàm để hiển thị trạng thái
    const getStatusBadge = (status: string) => {
        switch (status) {
            case BOOKING_STATUS.PENDING:
                return (
                    <div className="flex items-center justify-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5"></span>
                        Chờ xử lý
                    </div>
                )
            case BOOKING_STATUS.PAID:
                return (
                    <div className="flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                        Đã thanh toán
                    </div>
                )
            case BOOKING_STATUS.COMPLETED:
                return (
                    <div className="flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>
                        Hoàn thành
                    </div>
                )
            case BOOKING_STATUS.CANCELLED:
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
                    <Tabs defaultValue="all" onValueChange={(value) => setFilter(value)} className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                            <TabsTrigger
                                value="all"
                                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                Tất cả
                            </TabsTrigger>
                            <TabsTrigger
                                value={BOOKING_STATUS.PENDING}
                                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                Chờ xác nhận
                            </TabsTrigger>
                            <TabsTrigger
                                value={BOOKING_STATUS.PAID}
                                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                Đã xác nhận
                            </TabsTrigger>
                            <TabsTrigger
                                value={BOOKING_STATUS.COMPLETED}
                                className="cursor-pointer rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                Hoàn thành
                            </TabsTrigger>
                            <TabsTrigger
                                value={BOOKING_STATUS.CANCELLED}
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
                            {(paginatedAppointments as Appointment[])?.map((appointment: Appointment) => (
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
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="py-4 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault()
                                            setCurrentPage(p => Math.max(1, p - 1))
                                        }}
                                        aria-disabled={currentPage === 1}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <PaginationItem key={idx}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === idx + 1}
                                            onClick={e => {
                                                e.preventDefault()
                                                setCurrentPage(idx + 1)
                                            }}
                                        >
                                            {idx + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault()
                                            setCurrentPage(p => Math.min(totalPages, p + 1))
                                        }}
                                        aria-disabled={currentPage === totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
