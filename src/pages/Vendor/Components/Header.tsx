"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@components/Atoms/ui/avatar"
import { Bell } from "lucide-react"
import { IUser } from "@models/user/common.model"

export default function Header({ userData }: { userData: IUser }) {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Quản lý hồ sơ</h1>

            <div className="flex items-center gap-4">
                {/* <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div> */}

                <button className="relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        3
                    </span>
                </button>

                <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={userData?.avatarUrl} alt="Admin" />
                        <AvatarFallback>{userData?.avatarUrl}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">{userData?.fullName}</p>
                        <p className="text-xs text-gray-500">{userData?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    )
} 