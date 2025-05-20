"use client"

import AppointmentCalendar from "./right/appointment-callendar"
import AppointmentList from "./right/appointment-list"
import type { Appointment } from "./right/appointment-list"

export default function AppointmentsPage() {
    // Lấy dữ liệu lịch hẹn từ server
    const appointmentsData = {
        appointments: [
            {
                id: "APT001",
                customerName: "Nguyễn Văn A",
                customerPhone: "0901234567",
                date: "2023-05-18",
                time: "09:00",
                duration: 120,
                service: "Chụp ảnh cưới",
                status: "confirmed",
                notes: "Chụp tại studio",
            },
            {
                id: "APT002",
                customerName: "Trần Thị B",
                customerPhone: "0901234568",
                date: "2023-05-18",
                time: "13:00",
                duration: 60,
                service: "Chụp ảnh gia đình",
                status: "confirmed",
                notes: "Khách mang theo 2 trẻ em",
            },
            {
                id: "APT003",
                customerName: "Lê Văn C",
                customerPhone: "0901234569",
                date: "2023-05-19",
                time: "10:00",
                duration: 90,
                service: "Chụp ảnh kỷ yếu",
                status: "pending",
                notes: "Nhóm 5 người",
            },
            {
                id: "APT004",
                customerName: "Phạm Thị D",
                customerPhone: "0901234570",
                date: "2023-05-20",
                time: "15:00",
                duration: 60,
                service: "Chụp ảnh chân dung",
                status: "confirmed",
                notes: "",
            },
            {
                id: "APT005",
                customerName: "Hoàng Văn E",
                customerPhone: "0901234571",
                date: "2023-05-21",
                time: "11:00",
                duration: 180,
                service: "Chụp ảnh cưới",
                status: "confirmed",
                notes: "Chụp ngoại cảnh",
            },
        ] as Appointment[]
    }

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold">Lịch hẹn</h2>
            <p className="text-sm text-gray-500">Quản lý lịch hẹn của bạn</p>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AppointmentCalendar appointments={appointmentsData.appointments} />
                </div>
                <div>
                    <AppointmentList appointments={appointmentsData.appointments} />
                </div>
            </div>
        </div>
    )
}
