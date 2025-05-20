"use client"

import AppointmentCalendar from "./right/appointment-callendar"
import type { Appointment } from "./right/appointment-table"
import { AppointmentStats } from "./right/appointment-stats"
import { AppointmentTable } from "./right/appointment-table"
import { RecentAppointments } from "./right/recent-appoinment"

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
        <div className="mt-4">
            <h2 className="text-xl font-semibold">Quản lý đơn đặt lịch</h2>
            <p className="text-sm text-gray-500">Quản lý các đơn đặt lịch của khách hàng</p>

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
