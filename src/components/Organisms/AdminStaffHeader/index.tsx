"use client"

import { Bell } from "lucide-react"
import { IUser } from "@models/user/common.model"
import { Search } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/Atoms/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar } from "@components/Molecules/Avatar"

export default function AdminStaffHeader({ userData }: { userData: IUser }) {
    const router = useRouter()
    return (
        <div className="grid grid-cols-3 items-center">
            <div className="flex items-center gap-4"></div>
            <div className="flex justify-center w-full">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 justify-end">
                <button className="relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        3
                    </span>
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
                        <Avatar src={userData?.avatarUrl} alt={userData?.fullName} size={32} />
                        <div>
                            <p className="text-sm font-medium">{userData?.fullName}</p>
                            <p className="text-xs text-gray-500">{userData?.email}</p>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem
                            icon="LogOut"
                            className="text-red-600"
                            onClick={() => {
                                signOut({ callbackUrl: "/" })
                            }}
                        >
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
} 