"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Gift, Clock, Users, Tag, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { Badge } from "@components/Atoms/ui/badge"
import { Button } from "@components/Atoms/ui/button"
import { useAllCampaignAndVoucher } from "@utils/hooks/useCampaign"
import { campaignService } from "@services/campaign"
import { toast } from "react-hot-toast"
import { IAddUserToCampaignModel } from "@models/campaign/reponse.model"


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount)
}

const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
}

export default function CampaignVouchers({ userId }: { userId: string }) {
    const [currentPage, setCurrentPage] = useState(1)
    // const [claimedVouchers, setClaimedVouchers] = useState<Set<string>>(new Set()) // Đã bỏ, không còn dùng
    const [joinedCampaignIds, setJoinedCampaignIds] = useState<Set<string>>(new Set());


    const { campaigns, refetch, loading } = useAllCampaignAndVoucher();

    useEffect(() => {
        refetch();
        if (!userId) return;
        campaignService.getUserJoinedCampaigns(userId).then((res) => {
            const response = res as { statusCode: number; data?: { data: { id: string }[] } };
            if (response.statusCode === 200 && response.data?.data) {
                setJoinedCampaignIds(new Set(response.data.data.map((c) => c.id)));
            }
        });
    }, [userId]);
    // Lấy cả voucher và campaignId
    const vouchers = campaigns.flatMap(campaign =>
        campaign.campaignVouchers.map(cv => ({
            ...cv.voucher,
            campaignId: campaign.id
        }))
    )
    const itemsPerPage = 9 // 3x3 grid
    const totalPages = Math.ceil(vouchers.length / itemsPerPage)

    // Get current page items
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentVouchers = vouchers.slice(startIndex, endIndex)

    // Sửa lại handleClaimVoucher để nhận campaignId và userId
    const handleClaimVoucher = async (campaignId: string, userId: string) => {
        try {
            // setClaimedVouchers((prev) => new Set([...prev, campaignId])) // Đã bỏ, không còn dùng
            const response = await campaignService.addUserToCampaign(campaignId, userId) as IAddUserToCampaignModel
            if (response.statusCode === 200) {
                toast.success("Nhận voucher thành công!")
            } else {
                toast.error(response.message)
            }
            refetch()
        } catch (error: unknown) {
            toast.error("Có lỗi xảy ra khi nhận voucher!")
            // setClaimedVouchers((prev) => { // Đã bỏ, không còn dùng
            //     const newSet = new Set(prev)
            //     newSet.delete(campaignId)
            //     return newSet
            // })
            if (error instanceof Error) {
                console.error(error.message)
            } else {
                console.error(error)
            }
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        // Scroll to top when changing page
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push("...")
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push("...")
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push("...")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push("...")
                pages.push(totalPages)
            }
        }

        return pages
    }



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-bold mb-4">🎉 Kho Voucher PhotoGo 🎉</h1>
                        <p className="text-xl opacity-90">Nhận ngay các ưu đãi hấp dẫn cho dịch vụ chụp ảnh</p>
                        <div className="mt-4 text-lg">
                            <span className="bg-white/20 px-4 py-2 rounded-full">Tổng cộng: {vouchers.length} voucher</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Voucher Grid */}
                {loading ? <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin" /></div> :

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                    >
                        {currentVouchers.map((voucher, index) => {
                            const daysLeft = calculateDaysLeft(voucher.end_date)
                            const isLowStock = (voucher.quantity ?? 0) - (voucher.usedCount ?? 0) < 50
                            const isClaimed = joinedCampaignIds.has(voucher.campaignId)
                            const isExpiringSoon = daysLeft <= 7 && daysLeft > 0
                            const isExpired = daysLeft <= 0

                            return (
                                <motion.div
                                    key={voucher.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="relative"
                                >
                                    <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl transition-all duration-300">
                                        {/* Gradient Header */}
                                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white relative overflow-hidden">
                                            {/* Background Pattern */}
                                            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -translate-y-10 translate-x-10"></div>
                                            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 translate-y-8 -translate-x-8"></div>

                                            {/* Badges */}
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                {isLowStock && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Sắp hết!
                                                    </Badge>
                                                )}
                                                {isExpiringSoon && (
                                                    <Badge variant="secondary" className="text-xs bg-yellow-500 text-white">
                                                        Sắp hết hạn!
                                                    </Badge>
                                                )}
                                                {/* {voucher.point && voucher.point > 0 && (
                                                <Badge variant="secondary" className="text-xs bg-purple-500 text-white">
                                                    {voucher.point} điểm
                                                </Badge>
                                            )} */}
                                            </div>

                                            <div className="relative flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Gift className="w-5 h-5" />
                                                        <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                                                            Chiến dịch
                                                        </Badge>
                                                    </div>
                                                    <div className="text-2xl font-black mb-1">
                                                        {voucher.discount_type === "phần trăm"
                                                            ? `${voucher.discount_value}% OFF`
                                                            : `${formatCurrency(Number.parseFloat(voucher.discount_value))}`}
                                                    </div>
                                                    <div className="text-sm font-bold bg-white/20 px-2 py-1 rounded inline-block">
                                                        {voucher.code}
                                                    </div>
                                                </div>
                                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center ml-4">
                                                    <Gift className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-4">
                                            {/* Description */}
                                            <p className="text-gray-700 mb-4 min-h-[3rem] text-sm leading-relaxed">{voucher.description}</p>

                                            {/* Conditions */}
                                            <div className="space-y-2 mb-4 text-xs text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-3 h-3" />
                                                    <span>Đơn tối thiểu: {formatCurrency(voucher.minPrice)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-3 h-3" />
                                                    <span>
                                                        Còn lại: {(voucher.quantity ?? 0) - (voucher.usedCount ?? 0)}/{voucher.quantity ?? 0}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{isExpired ? "Đã hết hạn" : `Còn ${daysLeft} ngày`}</span>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${isLowStock ? "bg-red-500" : "bg-green-500"
                                                            }`}
                                                        style={{
                                                            width: `${((voucher.usedCount ?? 0) / (voucher.quantity ?? 1)) * 100}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Đã sử dụng: {(voucher.usedCount ?? 0)}/{voucher.quantity ?? 0}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <Button
                                                onClick={() => handleClaimVoucher(voucher.campaignId, userId)}
                                                disabled={isClaimed || isExpired || (voucher.quantity ?? 0) - (voucher.usedCount ?? 0) <= 0}
                                                className={`w-full font-semibold transition-all duration-300 ${isClaimed
                                                    ? "bg-green-500 hover:bg-green-600"
                                                    : isExpired || (voucher.quantity ?? 0) - (voucher.usedCount ?? 0) <= 0
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-orange-500 hover:bg-orange-600 hover:scale-105"
                                                    }`}
                                            >
                                                {isClaimed
                                                    ? "✓ Đã nhận"
                                                    : isExpired
                                                        ? "Hết hạn"
                                                        : (voucher.quantity ?? 0) - (voucher.usedCount ?? 0) <= 0
                                                            ? "Hết voucher"
                                                            : "Nhận ngay"}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                }

                {/* Pagination */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex justify-center items-center gap-2 mt-8"
                >
                    {/* Previous Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Trước
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                        {getPageNumbers().map((page, index) => (
                            <div key={index}>
                                {page === "..." ? (
                                    <span className="px-3 py-2 text-gray-500">...</span>
                                ) : (
                                    <Button
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page as number)}
                                        className={`min-w-[40px] ${currentPage === page ? "bg-orange-500 hover:bg-orange-600 text-white" : "hover:bg-orange-50"
                                            }`}
                                    >
                                        {page}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1"
                    >
                        Sau
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </motion.div>

                {/* Pagination Info */}
                <div className="text-center mt-4 text-sm text-gray-600">
                    Hiển thị {startIndex + 1}-{Math.min(endIndex, vouchers.length)} trong tổng số {vouchers.length}{" "}
                    voucher
                </div>
            </div>
        </div>
    )
}
