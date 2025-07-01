"use client"

import { User, Calendar, Wallet, BarChart, MessageSquare, HelpCircle, Settings, LogOut, Building2, Store, ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/Atoms/ui/collapsible"
import { LucideIcon } from "lucide-react"
import { signOut } from "next-auth/react"
import { ROUTES } from "@routes"

type MenuItem = {
    icon: LucideIcon
    label: string
    href: string
}

type CollapsibleMenuItem = {
    type: "collapsible"
    icon: LucideIcon
    label: string
    items: MenuItem[]
}

type SidebarItem = MenuItem | CollapsibleMenuItem

const isMenuItem = (item: SidebarItem): item is MenuItem => {
    return !('type' in item)
}

export default function Sidebar() {
    const pathname = usePathname()

    const menuItems: SidebarItem[] = [
        { icon: User, label: "Hồ sơ", href: ROUTES.VENDOR.PROFILE },
        { icon: BarChart, label: "Thống kê", href: ROUTES.VENDOR.STATISTICS },
        { icon: Calendar, label: "Lịch", href: ROUTES.VENDOR.CALENDAR },
        { icon: Wallet, label: "Tài chính", href: ROUTES.VENDOR.FINANCE },
        {
            type: "collapsible", icon: Store, label: "Quản lý dịch vụ", items: [
                { icon: Store, label: "Dịch vụ", href: ROUTES.VENDOR.SERVICES },
                { icon: Building2, label: "Chi nhánh", href: ROUTES.VENDOR.BRANCHES },
                { icon: BarChart, label: "Thống kê", href: ROUTES.VENDOR.SERVICE_STATISTICS },
            ]
        },
        { icon: MessageSquare, label: "Tin nhắn", href: ROUTES.VENDOR.CHAT },
        { icon: HelpCircle, label: "Hỗ trợ", href: "/vendor/support" },
        { icon: Settings, label: "Lịch làm việc", href: ROUTES.VENDOR.SETTINGS },
    ]

    return (
        <aside className="w-[240px] bg-white border-r border-gray-200 min-h-screen flex flex-col">
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

            <div className="flex-1 space-y-4 p-4">
                {menuItems.map((item, index) => {
                    if ('type' in item && item.type === "collapsible") {
                        return (
                            <Collapsible key={index} className="mb-0">
                                <CollapsibleTrigger className="group flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </div>
                                    <ChevronDown className="w-5 h-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </CollapsibleTrigger>

                                <CollapsibleContent className="ml-4 mt-2 space-y-2 cursor-pointer">
                                    {item.items.map((subItem, subIndex) => (
                                        <Link key={subIndex} href={subItem.href}>
                                            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${pathname === subItem.href
                                                ? "bg-orange-50 text-orange-600"
                                                : "text-gray-700 hover:bg-gray-100"
                                                }`}>
                                                <subItem.icon className="w-5 h-5" />
                                                <span>{subItem.label}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        )
                    }

                    if (isMenuItem(item)) {
                        return (
                            <Link key={index} href={item.href}>
                                <div className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${pathname === item.href
                                    ? "bg-orange-50 text-orange-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}>
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        )
                    }

                    return null
                })}
            </div>

            <div className="p-4 border-t border-gray-200">
                <button className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-md w-full justify-center cursor-pointer" onClick={() => {
                    signOut({ callbackUrl: "/" })
                }}>
                    <LogOut className="w-5 h-5" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    )
}