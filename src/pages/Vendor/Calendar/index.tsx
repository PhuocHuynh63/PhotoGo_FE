"use client"

import { useState } from "react"
import { Button } from "@/components/Atoms/ui/button"
import { CalendarDays, List, Plus } from "lucide-react"
import CalendarView from "../Components/Calendars/CalendarView"
import CalendarSidebar from "../Components/Calendars/CalendarSidebar"
import AppointmentTable from "../Components/Appointment/AppointmentTable"
import AppointmentStats from "../Components/Appointment/AppointmentStats"
import RecentAppointments from "../Components/Appointment/RecentAppointments"


interface Appointment {
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

interface CalendarManagementProps {
    appointments: Appointment[]
    workingHours: WorkingHours
    todayAppointments: TodayAppointment[]
    upcomingAppointments: UpcomingAppointment[]
    stats: Stats
}


const mockData: CalendarManagementProps = {
    appointments: [
        // Thứ 2 (25/05)
        {
            id: "apt1",
            title: "Chụp ảnh cưới - Nguyễn Văn A",
            customerName: "Nguyễn Văn A",
            customerPhone: "0905234567",
            customerEmail: "nguyenvana@email.com",
            service: "Chụp ảnh cưới",
            package: "Gói Cao Cấp",
            date: "2025-05-25",
            startTime: "09:00",
            endTime: "12:00",
            status: "confirmed",
            color: "blue",
            notes: "Khách hàng yêu cầu chụp ngoại cảnh, mang theo 3 bộ váy cưới",
            price: 8000000,
            deposit: 3000000,
            location: "Studio + Công viên Tao Đàn",
        },
        {
            id: "apt2",
            title: "Chụp ảnh gia đình - Trần Thị B",
            customerName: "Trần Thị B",
            customerPhone: "0912345678",
            customerEmail: "tranthib@email.com",
            service: "Chụp ảnh gia đình",
            package: "Gói Tiêu Chuẩn",
            date: "2025-05-25",
            startTime: "14:00",
            endTime: "16:00",
            status: "confirmed",
            color: "green",
            notes: "Gia đình 5 người, có 2 trẻ nhỏ",
            price: 3500000,
            deposit: 1500000,
            location: "Studio",
        },
        {
            id: "apt3",
            title: "Chụp ảnh chân dung - Lê Minh C",
            customerName: "Lê Minh C",
            customerPhone: "0923456789",
            customerEmail: "leminhc@email.com",
            service: "Chụp ảnh chân dung",
            package: "Gói Cá Nhân",
            date: "2025-05-25",
            startTime: "17:00",
            endTime: "18:00",
            status: "pending",
            color: "purple",
            notes: "Chụp ảnh profile cho LinkedIn",
            price: 1200000,
            deposit: 500000,
            location: "Studio",
        },

        // Thứ 3 (26/05)
        {
            id: "apt4",
            title: "Chụp ảnh sản phẩm - Công ty ABC",
            customerName: "Phạm Văn D (Công ty ABC)",
            customerPhone: "0934567890",
            customerEmail: "phamvand@abc.com",
            service: "Chụp ảnh sản phẩm",
            package: "Gói Doanh Nghiệp",
            date: "2025-05-26",
            startTime: "08:30",
            endTime: "11:30",
            status: "confirmed",
            color: "indigo",
            notes: "Chụp 50 sản phẩm điện tử, cần background trắng",
            price: 5000000,
            deposit: 2000000,
            location: "Studio",
        },
        {
            id: "apt5",
            title: "Chụp ảnh kỷ yếu - Trường THPT XYZ",
            customerName: "Cô Nguyễn Thị E",
            customerPhone: "0945678905",
            customerEmail: "nguyenthie@thptxyz.edu.vn",
            service: "Chụp ảnh kỷ yếu",
            package: "Gói Nhóm Lớn",
            date: "2025-05-26",
            startTime: "13:30",
            endTime: "16:30",
            status: "confirmed",
            color: "yellow",
            notes: "Lớp 12A1 - 45 học sinh, cần chụp ảnh lẻ và nhóm",
            price: 6500000,
            deposit: 3000000,
            location: "Trường THPT XYZ",
        },

        // Thứ 4 (27/05)
        {
            id: "apt6",
            title: "Chụp ảnh cưới - Hoàng Văn F",
            customerName: "Hoàng Văn F",
            customerPhone: "0956789052",
            customerEmail: "hoangvanf@email.com",
            service: "Chụp ảnh cưới",
            package: "Gói Cơ Bản",
            date: "2025-05-27",
            startTime: "09:00",
            endTime: "11:00",
            status: "confirmed",
            color: "blue",
            notes: "Chụp trong studio, 2 bộ trang phục",
            price: 4500000,
            deposit: 2000000,
            location: "Studio",
        },
        {
            id: "apt7",
            title: "Chụp ảnh thời trang - Model G",
            customerName: "Vũ Thị G",
            customerPhone: "0967890523",
            customerEmail: "vuthig@model.com",
            service: "Chụp ảnh thời trang",
            package: "Gói Chuyên Nghiệp",
            date: "2025-05-27",
            startTime: "14:00",
            endTime: "17:00",
            status: "pending",
            color: "red",
            notes: "Chụp lookbook thu đông, cần makeup artist",
            price: 7500000,
            deposit: 3500000,
            location: "Studio + Ngoại cảnh",
        },

        // Thứ 5 (28/05)
        {
            id: "apt8",
            title: "Chụp ảnh sự kiện - Công ty DEF",
            customerName: "Đặng Văn H (Công ty DEF)",
            customerPhone: "0978905234",
            customerEmail: "dangvanh@def.com",
            service: "Chụp ảnh sự kiện",
            package: "Gói Sự Kiện",
            date: "2025-05-28",
            startTime: "08:00",
            endTime: "12:00",
            status: "confirmed",
            color: "green",
            notes: "Lễ khai trương chi nhánh mới, cần 2 photographer",
            price: 8500000,
            deposit: 4000000,
            location: "Tòa nhà Bitexco",
        },
        {
            id: "apt9",
            title: "Chụp ảnh gia đình - Ngô Thị I",
            customerName: "Ngô Thị I",
            customerPhone: "0989052345",
            customerEmail: "ngothii@email.com",
            service: "Chụp ảnh gia đình",
            package: "Gói Ngoại Cảnh",
            date: "2025-05-28",
            startTime: "15:00",
            endTime: "17:00",
            status: "confirmed",
            color: "green",
            notes: "Gia đình 3 thế hệ, chụp tại công viên",
            price: 4000000,
            deposit: 1800000,
            location: "Công viên Lê Văn Tám",
        },

        // Thứ 6 (29/05)
        {
            id: "apt10",
            title: "Chụp ảnh cưới - Trịnh Văn J",
            customerName: "Trịnh Văn J",
            customerPhone: "0990523456",
            customerEmail: "trinhvanj@email.com",
            service: "Chụp ảnh cưới",
            package: "Gói Luxury",
            date: "2025-05-29",
            startTime: "08:00",
            endTime: "12:00",
            status: "confirmed",
            color: "blue",
            notes: "Chụp sunrise tại bãi biển Vũng Tàu, có ekip makeup",
            price: 15000000,
            deposit: 7000000,
            location: "Bãi biển Vũng Tàu",
        },
        {
            id: "apt11",
            title: "Chụp ảnh sản phẩm - Shop K",
            customerName: "Lý Thị K",
            customerPhone: "0905234567",
            customerEmail: "lythik@shopk.com",
            service: "Chụp ảnh sản phẩm",
            package: "Gói Thời Trang",
            date: "2025-05-29",
            startTime: "14:00",
            endTime: "16:00",
            status: "pending",
            color: "indigo",
            notes: "Chụp bộ sưu tập áo dài, cần model",
            price: 3500000,
            deposit: 1500000,
            location: "Studio",
        },

        // Thứ 7 (30/05)
        {
            id: "apt12",
            title: "Chụp ảnh baby - Gia đình L",
            customerName: "Bùi Văn L",
            customerPhone: "0912345678",
            customerEmail: "buivanl@email.com",
            service: "Chụp ảnh baby",
            package: "Gói Newborn",
            date: "2025-05-30",
            startTime: "10:00",
            endTime: "12:00",
            status: "confirmed",
            color: "pink",
            notes: "Em bé 2 tháng tuổi, cần studio ấm áp",
            price: 2500000,
            deposit: 1000000,
            location: "Studio",
        },
        {
            id: "apt13",
            title: "Chụp ảnh graduation - Sinh viên M",
            customerName: "Cao Thị M",
            customerPhone: "0923456789",
            customerEmail: "caothim@student.edu.vn",
            service: "Chụp ảnh tốt nghiệp",
            package: "Gói Sinh Viên",
            date: "2025-05-30",
            startTime: "15:00",
            endTime: "16:00",
            status: "confirmed",
            color: "purple",
            notes: "Chụp với áo cử nhân, cần background trường đại học",
            price: 1500000,
            deposit: 700000,
            location: "Đại học Kinh Tế",
        },

        // Chủ nhật (31/05)
        {
            id: "apt14",
            title: "Chụp ảnh cưới - Đinh Văn N",
            customerName: "Đinh Văn N",
            customerPhone: "0934567890",
            customerEmail: "dinhvann@email.com",
            service: "Chụp ảnh cưới",
            package: "Gói Cao Cấp",
            date: "2025-05-31",
            startTime: "08:00",
            endTime: "11:00",
            status: "pending",
            color: "blue",
            notes: "Chụp tại Landmark 81, cần booking trước",
            price: 12000000,
            deposit: 5000000,
            location: "Landmark 81",
        },
        {
            id: "apt15",
            title: "Chụp ảnh gia đình - Gia đình O",
            customerName: "Phạm Thị O",
            customerPhone: "0945678905",
            customerEmail: "phamthio@email.com",
            service: "Chụp ảnh gia đình",
            package: "Gói Lễ Tết",
            date: "2025-05-31",
            startTime: "14:00",
            endTime: "16:00",
            status: "confirmed",
            color: "green",
            notes: "Chụp ảnh Tết, trang phục áo dài truyền thống",
            price: 4500000,
            deposit: 2000000,
            location: "Chùa Ngọc Hoàng",
        },
    ],
    workingHours: {
        start: "08:00",
        end: "18:00",
        breakStart: "12:00",
        breakEnd: "13:00",
    },
    todayAppointments: [
        {
            id: "apt1",
            customerName: "Nguyễn Văn A",
            service: "Chụp ảnh cưới",
            time: "09:00 - 12:00",
            status: "confirmed",
        },
        {
            id: "apt2",
            customerName: "Trần Thị B",
            service: "Chụp ảnh gia đình",
            time: "14:00 - 16:00",
            status: "confirmed",
        },
        {
            id: "apt3",
            customerName: "Lê Minh C",
            service: "Chụp ảnh chân dung",
            time: "17:00 - 18:00",
            status: "pending",
        },
    ],
    upcomingAppointments: [
        {
            id: "apt4",
            customerName: "Phạm Văn D",
            service: "Chụp ảnh sản phẩm",
            date: "26/05",
            time: "08:30 - 11:30",
            status: "confirmed",
        },
        {
            id: "apt5",
            customerName: "Cô Nguyễn Thị E",
            service: "Chụp ảnh kỷ yếu",
            date: "26/05",
            time: "13:30 - 16:30",
            status: "confirmed",
        },
        {
            id: "apt6",
            customerName: "Hoàng Văn F",
            service: "Chụp ảnh cưới",
            date: "27/05",
            time: "09:00 - 11:00",
            status: "confirmed",
        },
        {
            id: "apt7",
            customerName: "Vũ Thị G",
            service: "Chụp ảnh thời trang",
            date: "27/05",
            time: "14:00 - 17:00",
            status: "pending",
        },
    ],
    stats: {
        totalThisWeek: 15,
        confirmedThisWeek: 11,
        pendingThisWeek: 4,
        revenueThisWeek: 89000000,
    },
}

export default function CalendarManagement(
    //     {
    //     appointments,
    //     workingHours,
    //     todayAppointments,
    //     upcomingAppointments,
    //     stats,
    // }: CalendarManagementProps
) {
    const [viewMode, setViewMode] = useState<"calendar" | "appointments">("calendar")

    return (
        <div>
            {/* Header với toggle buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Quản lý lịch làm việc</h2>
                    <p className="text-sm text-gray-500">
                        {viewMode === "calendar"
                            ? "Theo dõi lịch hẹn và quản lý thời gian làm việc"
                            : "Quản lý các đơn đặt lịch của khách hàng"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Toggle Buttons */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <Button
                            variant={viewMode === "calendar" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("calendar")}
                            className={`cursor-pointer gap-2 ${viewMode === "calendar" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                        >
                            <CalendarDays className="h-4 w-4" />
                            Lịch
                        </Button>
                        <Button
                            variant={viewMode === "appointments" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("appointments")}
                            className={`cursor-pointer gap-2 ${viewMode === "appointments" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                        >
                            <List className="h-4 w-4" />
                            Danh sách
                        </Button>
                    </div>

                    {/* Add Appointment Button */}
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Thêm lịch hẹn
                    </Button>
                </div>
            </div>

            {/* Content based on view mode */}
            {viewMode === "calendar" ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <CalendarView appointments={mockData.appointments} workingHours={mockData.workingHours} />
                    </div>
                    <div>
                        <CalendarSidebar
                            todayAppointments={mockData.todayAppointments}
                            upcomingAppointments={mockData.upcomingAppointments}
                            stats={mockData.stats}
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <AppointmentTable appointments={mockData.appointments} />
                    </div>
                    <div className="space-y-6">
                        <AppointmentStats appointments={mockData.appointments} />
                        <RecentAppointments appointments={mockData.appointments} />
                    </div>
                </div>
            )}
        </div>
    )
}
