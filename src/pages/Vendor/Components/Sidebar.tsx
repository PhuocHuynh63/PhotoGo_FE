"use client"

import { User, Calendar, Wallet, BarChart, MessageSquare, HelpCircle, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
    const pathname = usePathname()

    const menuItems = [
        { icon: User, label: "Hồ sơ", href: "/vendor/profile" },
        { icon: BarChart, label: "Thống kê", href: "/vendor/statistics" },
        { icon: Calendar, label: "Lịch hẹn", href: "/vendor/appointments" },
        { icon: Wallet, label: "Tài chính", href: "/vendor/finance" },
        { icon: MessageSquare, label: "Tin nhắn", href: "/vendor/messages" },
        { icon: HelpCircle, label: "Hỗ trợ", href: "/vendor/support" },
        { icon: Settings, label: "Cài đặt", href: "/vendor/settings" },
    ]

    return (
        <aside className="w-[240px] bg-white border-r border-gray-200 min-h-screen">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-500 font-bold text-lg">P</span>
                    </div>
                    <div>
                        <h2 className="text-base font-semibold">PhotoGo Partner</h2>
                        <p className="text-sm text-gray-500">Quản lý đối tác của bạn</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {menuItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${pathname === item.href
                                ? "bg-orange-50 text-orange-600"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}>
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="absolute bottom-4 left-4">
                <button className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-md">
                    <LogOut className="w-5 h-5" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    )
}