"use client"

import { Bell, Menu } from "lucide-react"
import { IUser } from "@models/user/common.model"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/Atoms/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { ROUTES } from "@routes"
import { useRouter } from "next/navigation"
import { Avatar } from "@components/Molecules/Avatar"
import ButtonServiceOffer from "@components/Atoms/ServiceOffer"
import { ROLE } from "@constants/common"

export default function Header({ userData, setSidebarOpen }: { userData: IUser, setSidebarOpen: (open: boolean) => void }) {
    const router = useRouter()
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                {/* Hamburger menu for mobile */}
                <button className="md:hidden p-2 rounded-md border border-gray-200 bg-white mr-2" onClick={() => setSidebarOpen(true)} aria-label="Mở menu">
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-2xl font-bold">Quản lý hồ sơ</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div> */}

                {userData?.role?.name === ROLE.VENDOR_OWNER && (
                    <ButtonServiceOffer roleName={userData?.role?.name} />
                )}

                {/* <button className="cursor-pointer relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        3
                    </span>
                </button> */}

                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
                        <Avatar src={userData?.avatarUrl} alt={userData?.fullName} size={32} />
                        <div>
                            <p className="text-sm font-medium">{userData?.fullName}</p>
                            <p className="text-xs text-gray-500">{userData?.email}</p>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem icon="User" onClick={() => {
                            router.push(ROUTES.VENDOR.PROFILE)
                        }}>
                            Hồ sơ
                        </DropdownMenuItem>
                        <DropdownMenuItem icon="Settings" className="cursor-pointer" onClick={() => {
                            router.push(ROUTES.VENDOR.CALENDAR)
                        }}>
                            Lịch làm việc
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem icon="LogOut" className="text-red-600" onClick={() => {
                            signOut({ callbackUrl: "/" })
                        }}>
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
} 