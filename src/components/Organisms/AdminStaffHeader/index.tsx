'use client'

import { Avatar } from "@components/Molecules/Avatar"
import { ROUTES } from "@routes"
import { ArrowLeft } from "lucide-react";
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/Molecules/DropdownMenu"
import LucideIcon from "@components/Atoms/LucideIcon"
import { usePathname } from "next/navigation"


export default function AdminStaffHeader({
    userRole,
    userName = 'Admin User',
    userAvatar = "https://res.cloudinary.com/dodtzdovx/image/upload/v1744191261/mau_1_t47cab.svg"
}: ICOMPONENTS.AdminStaffHeaderProps) {
    const pathname = usePathname()

    return (
        <header className="bg-white shadow-sm p-2 px-6 w-full sticky top-0 z-50 flex items-center justify-between">
            <div className="flex items-center">
                <Link href={ROUTES.PUBLIC.HOME}>
                    <span className="text-orange-500 hover:underline cursor-pointer">
                        <ArrowLeft className="h-4 w-4 mr-1" />  PHOTOGO
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <LucideIcon name="Bell" iconSize={20} />
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            3
                        </span>
                    </button>
                </div>

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer p-1 px-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Avatar
                                src={userAvatar}
                                alt="User avatar"
                                size={36}
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium">{userName}</p>
                                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                            </div>
                            <LucideIcon name="ChevronDown" iconSize={16} />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/profile">
                            <DropdownMenuItem icon="UserCircle">
                                <span>Hồ sơ</span>
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/settings">
                            <DropdownMenuItem icon="Settings">
                                <span>Cài đặt</span>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link href={ROUTES.AUTH.LOGIN}>
                            <DropdownMenuItem icon="LogOut">
                                <span>Đăng xuất</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
