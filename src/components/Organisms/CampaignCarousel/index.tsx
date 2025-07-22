"use client"

import React from "react"
import Link from "next/link"
import Marquee from "react-fast-marquee"
import { Percent, Gift, Star, Zap, Clock, Users } from "lucide-react"

interface VoucherItem {
    id: string
    name: string
    description: string
    status: boolean
    happened: string
    progress: number
    startDate: string
    endDate: string
    totalVoucher: number
    usedVoucher: number
    remainingVoucher: number
}

// Mock data từ API response bạn cung cấp
const mockVoucherData: VoucherItem[] = [
    {
        id: "c5c09305-6ed4-4488-85c2-cd5e1e9a1f2b",
        name: "Chào Bạn Mới",
        description:
            "Chương trình khuyến mãi đối với người mới tạo acc. Họ sẽ nhận được 1 voucher giảm tới 95% không giới hạn cho đơn hàng đầu tiên",
        status: true,
        happened: "Đang diễn ra",
        progress: 56,
        startDate: "2025-01-01",
        endDate: "2025-12-30",
        totalVoucher: 999997,
        usedVoucher: 3,
        remainingVoucher: 999994,
    },
    {
        id: "94f0709b-7e04-414c-b215-2e6be2114f93",
        name: "Tina gay v2",
        description: "<p>mưa huỳnh chích điện </p>",
        status: true,
        happened: "Đang diễn ra",
        progress: 0,
        startDate: "2025-07-22",
        endDate: "2025-11-30",
        totalVoucher: 1,
        usedVoucher: 0,
        remainingVoucher: 1,
    },
    {
        id: "extra-1",
        name: "Flash Sale Cuối Tuần",
        description: "Giảm giá sốc cho tất cả dịch vụ chụp ảnh trong cuối tuần",
        status: true,
        happened: "Đang diễn ra",
        progress: 25,
        startDate: "2025-01-20",
        endDate: "2025-01-31",
        totalVoucher: 500,
        usedVoucher: 125,
        remainingVoucher: 375,
    },
    {
        id: "extra-2",
        name: "Combo Studio + Makeup",
        description: "Ưu đãi đặc biệt khi đặt combo studio và makeup artist",
        status: true,
        happened: "Đang diễn ra",
        progress: 80,
        startDate: "2025-01-15",
        endDate: "2025-02-15",
        totalVoucher: 200,
        usedVoucher: 160,
        remainingVoucher: 40,
    },
]

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const icons = {
        Percent,
        Gift,
        Star,
        Zap,
        Clock,
        Users,
    }
    const Icon = icons[name as keyof typeof icons] || Gift
    return <Icon className={className} />
}

export default function VoucherSlider() {
    const processVoucherData = (apiVouchers: VoucherItem[]) => {
        const colors = [
            "bg-gradient-to-r from-pink-500 to-rose-500",
            "bg-gradient-to-r from-purple-500 to-indigo-500",
            "bg-gradient-to-r from-orange-500 to-red-500",
            "bg-gradient-to-r from-green-500 to-emerald-500",
            "bg-gradient-to-r from-blue-500 to-cyan-500",
            "bg-gradient-to-r from-violet-500 to-purple-500",
        ]
        const icons = ["Gift", "Star", "Zap", "Percent"] as const
        return apiVouchers
            .filter((voucher) => voucher.status && voucher.happened === "Đang diễn ra")
            .map((voucher, index) => {
                const discountPercent = Math.max(5, Math.min(95, 100 - voucher.progress))
                const cleanDescription = voucher.description.replace(/<[^>]*>/g, "").trim()
                const endDate = new Date(voucher.endDate)
                const today = new Date()
                const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
                return {
                    id: voucher.id,
                    title: voucher.name,
                    discount: `${discountPercent}%`,
                    description: cleanDescription.length > 60 ? cleanDescription.substring(0, 60) + "..." : cleanDescription,
                    icon: icons[index % icons.length],
                    color: colors[index % colors.length],
                    remainingVoucher: voucher.remainingVoucher,
                    totalVoucher: voucher.totalVoucher,
                    progress: voucher.progress,
                    daysLeft: daysLeft > 0 ? daysLeft : 0,
                    isLimitedQuantity: voucher.totalVoucher < 1000,
                    isAlmostOut: voucher.remainingVoucher < 50,
                }
            })
    }

    const processedVouchers = processVoucherData(mockVoucherData)

    return (
        <div className="relative overflow-hidden p-0 m-0 w-full">
            <Link href="/hehe/hehe" className="block">
                <Marquee gradient={false} speed={60} className="py-1">
                    {processedVouchers.map((voucher) => (
                        <div
                            key={voucher.id}
                            className="flex-shrink-0 w-52 mx-1"
                        >
                            <div
                                className={`${voucher.color} rounded-xl p-2 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden min-w-[208px]`}
                            >
                                <div className="relative min-h-[50px]">
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <IconComponent name={voucher.icon} className="w-4 h-4" />
                                        <span className="font-bold text-base truncate">{voucher.title}</span>
                                    </div>
                                    <div className="text-xl font-bold mb-1">GIẢM {voucher.discount}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Marquee>
            </Link>
        </div>
    )
}
