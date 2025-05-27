"use client"

import AppointmentCalendar from "@pages/Vendor/Components/Appointment/AppointmentCallendar"
import type { Appointment } from "@pages/Vendor/Components/Appointment/AppointmentTable"
import AppointmentStats from "@pages/Vendor/Components/Appointment/AppointmentStats"
import AppointmentTable from "@pages/Vendor/Components/Appointment/AppointmentTable"
import RecentAppointments from "@pages/Vendor/Components/Appointment/RecentAppointments"
import { Tabs, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"

export default function AppointmentsPage() {
    // Lấy dữ liệu lịch hẹn từ server
    const appointmentsData: { appointments: Appointment[] } = {
        appointments: [
            {
                id: "BK-001",
                customerName: "Nguyễn Văn A",
                customerPhone: "0901234567",
                date: "2023-05-25",
                startTime: "09:00",
                endTime: "11:00",
                service: "Chụp ảnh cưới",
                location: "Gói Cơ Bản",
                status: "confirmed",
                notes: "",
            },
            {
                id: "BK-002",
                customerName: "Trần Thị B",
                customerPhone: "0912345678",
                date: "2023-05-26",
                startTime: "14:00",
                endTime: "16:00",
                service: "Chụp ảnh gia đình",
                location: "Gói Tiêu Chuẩn",
                status: "pending",
                notes: "",
            },
            {
                id: "BK-003",
                customerName: "Lê Văn C",
                customerPhone: "0923456789",
                date: "2023-05-27",
                startTime: "10:00",
                endTime: "12:00",
                service: "Chụp ảnh sản phẩm",
                location: "Gói Nâng Cao",
                status: "completed",
                notes: "",
            },
            {
                id: "BK-004",
                customerName: "Phạm Thị D",
                customerPhone: "0934567890",
                date: "2023-05-28",
                startTime: "15:00",
                endTime: "17:00",
                service: "Chụp ảnh kỷ yếu",
                location: "Gói Nâng Cao",
                status: "cancelled",
                notes: "",
            },
            {
                id: "BK-005",
                customerName: "Hoàng Văn E",
                customerPhone: "0945678901",
                date: "2023-05-25",
                startTime: "13:00",
                endTime: "15:00",
                service: "Chụp ảnh chân dung",
                location: "Gói Cơ Bản",
                status: "confirmed",
                notes: "",
            },
            {
                id: "BK-006",
                customerName: "Vũ Thị F",
                customerPhone: "0956789012",
                date: "2023-05-29",
                startTime: "09:00",
                endTime: "12:00",
                service: "Chụp ảnh cưới",
                location: "Gói Cao Cấp",
                status: "confirmed",
                notes: "",
            },
            {
                id: "BK-007",
                customerName: "Đặng Văn G",
                customerPhone: "0967890123",
                date: "2023-05-30",
                startTime: "14:00",
                endTime: "16:00",
                service: "Chụp ảnh sự kiện",
                location: "Gói Doanh Nghiệp",
                status: "pending",
                notes: "",
            },
            {
                id: "BK-008",
                customerName: "Ngô Thị H",
                customerPhone: "0978901234",
                date: "2023-05-31",
                startTime: "10:00",
                endTime: "12:00",
                service: "Chụp ảnh thời trang",
                location: "Gói Chuyên Nghiệp",
                status: "confirmed",
                notes: "",
            },
        ],
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Quản lý đơn đặt lịch</h2>
            <p className="text-sm text-gray-500">Quản lý các đơn đặt lịch của khách hàng</p>
            {/* <div className="border-b border-gray-200">
                <Tabs defaultValue="all">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                        <TabsTrigger
                            value="all"
                            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            Tất cả
                        </TabsTrigger>
                        <TabsTrigger
                            value="pending"
                            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            Chờ xác nhận
                        </TabsTrigger>
                        <TabsTrigger
                            value="confirmed"
                            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            Đã xác nhận
                        </TabsTrigger>
                        <TabsTrigger
                            value="completed"
                            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            Hoàn thành
                        </TabsTrigger>
                        <TabsTrigger
                            value="cancelled"
                            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            Đã hủy
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div> */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AppointmentTable appointments={appointmentsData.appointments} />
                </div>
                <div className="space-y-6">
                    <AppointmentCalendar appointments={appointmentsData.appointments} />
                    <AppointmentStats appointments={appointmentsData.appointments} />
                    <RecentAppointments appointments={appointmentsData.appointments} />
                </div>
            </div>
        </div>
    )
}
