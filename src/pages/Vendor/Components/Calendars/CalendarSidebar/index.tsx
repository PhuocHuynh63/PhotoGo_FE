"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Badge } from "@/components/Atoms/ui/badge"
import { Button } from "@/components/Atoms/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Atoms/ui/avatar"
import { Calendar, Clock, Users, DollarSign, Phone, MessageSquare } from "lucide-react"

interface TodayAppointment {
    id: string
    customerName: string
    service: string
    time: string
    status: string
}

interface UpcomingAppointment {
    id: string
    customerName: string
    service: string
    date: string
    time: string
    status: string
}

interface Stats {
    totalThisWeek: number
    confirmedThisWeek: number
    pendingThisWeek: number
    revenueThisWeek: number
}

interface CalendarSidebarProps {
    todayAppointments: TodayAppointment[]
    upcomingAppointments: UpcomingAppointment[]
    stats: Stats
}

export default function CalendarSidebar({ todayAppointments, upcomingAppointments, stats }: CalendarSidebarProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge variant="outline" className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 "></span>
                </Badge>
            case "pending":
                return <Badge variant="outline" className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                </Badge>
            case "cancelled":
                return <Badge variant="outline" className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                </Badge>
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            {/* Thống kê tuần */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Thống kê tuần này</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats?.totalThisWeek}</p>
                            <p className="text-xs text-gray-500">Tổng lịch hẹn</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats?.confirmedThisWeek}</p>
                            <p className="text-xs text-gray-500">Đã xác nhận</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats?.pendingThisWeek}</p>
                            <p className="text-xs text-gray-500">Chờ xác nhận</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-lg font-bold">{formatCurrency(stats?.revenueThisWeek || 0)}</p>
                            <p className="text-xs text-gray-500">Doanh thu dự kiến</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lịch hẹn hôm nay */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Hôm nay</CardTitle>
                    <p className="text-sm text-gray-500">{todayAppointments?.length} lịch hẹn</p>
                </CardHeader>
                <CardContent>
                    {todayAppointments?.length > 0 ? (
                        <div className="space-y-3">
                            {todayAppointments?.map((appointment) => (
                                <div key={appointment?.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/placeholder.svg" alt={appointment?.customerName} />
                                            <AvatarFallback>{appointment?.customerName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{appointment?.customerName}</p>
                                            <p className="text-xs text-gray-500 truncate">{appointment?.service}</p>
                                            <p className="text-xs text-blue-600 font-medium">{appointment?.time}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex gap-1">
                                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs cursor-pointer">
                                            <Phone className="h-3 w-3 mr-1" />
                                            Gọi
                                        </Button>
                                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs cursor-pointer">
                                            <MessageSquare className="h-3 w-3 mr-1" />
                                            Nhắn
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">Không có lịch hẹn nào hôm nay</p>
                    )}
                </CardContent>
            </Card>

            {/* Lịch hẹn sắp tới */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Sắp tới</CardTitle>
                </CardHeader>
                <CardContent>
                    {upcomingAppointments?.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingAppointments?.map((appointment) => (
                                <div key={appointment?.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder.svg" alt={appointment?.customerName} />
                                        <AvatarFallback>{appointment?.customerName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-sm">{appointment?.customerName}</p>
                                                <p className="text-xs text-gray-500 truncate">{appointment?.service}</p>
                                                <p className="text-xs text-blue-600">
                                                    {appointment?.date} • {appointment?.time}
                                                </p>
                                            </div>
                                            {getStatusBadge(appointment?.status || "")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">Không có lịch hẹn sắp tới</p>
                    )}
                </CardContent>
            </Card>

            {/* Giờ làm việc */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Giờ làm việc</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Thứ 2 - Chủ nhật</span>
                            <span className="font-medium">08:00 - 18:00</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Nghỉ trưa</span>
                            <span className="font-medium">12:00 - 13:00</span>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3 cursor-pointer">
                        Chỉnh sửa giờ làm việc
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
