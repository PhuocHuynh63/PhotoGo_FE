"use client"

import React, { useState } from "react"
import { Search, Ticket, Star, Gift } from "lucide-react"
import { Button } from "@components/Atoms/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/Atoms/ui/dialog"
import { Input } from "@components/Atoms/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import VoucherDetailModal from "../components/VoucherDetail"
import VoucherCard from "../components/VoucherCard"

interface Voucher {
    id: string
    code: string
    title: string
    description: string
    discount: string
    minOrder?: number
    maxDiscount?: number
    expiryDate: string
    isUsable: boolean
    type: "points" | "campaign"
    pointsRequired?: number
}

interface VoucherDetail extends Voucher {
    termsAndConditions: string[]
    usageLimit?: number
    usedCount?: number
    validFrom: string
    applicableProducts?: string[]
    excludedProducts?: string[]
    howToUse: string
}

const mockPointVouchers: VoucherDetail[] = [
    {
        id: "1",
        code: "POINT10",
        title: "Giảm 10% cho đơn hàng",
        description: "Áp dụng cho đơn hàng từ 100,000đ",
        discount: "10%",
        minOrder: 100000,
        maxDiscount: 50000,
        expiryDate: "31/12/2024",
        isUsable: true,
        type: "points",
        pointsRequired: 100,
        termsAndConditions: [
            "Áp dụng cho đơn hàng từ 100,000đ trở lên",
            "Giảm tối đa 50,000đ",
            "Không áp dụng cùng với các khuyến mãi khác",
            "Chỉ sử dụng được 1 lần",
        ],
        usageLimit: 1,
        usedCount: 0,
        validFrom: "01/01/2024",
        applicableProducts: ["Tất cả sản phẩm"],
        howToUse: "Chọn voucher này và nhấn 'Áp dụng' khi thanh toán",
    },
    {
        id: "2",
        code: "POINT20",
        title: "Giảm 20,000đ",
        description: "Áp dụng cho đơn hàng từ 200,000đ",
        discount: "20,000đ",
        minOrder: 200000,
        expiryDate: "30/11/2024",
        isUsable: false,
        type: "points",
        pointsRequired: 200,
        termsAndConditions: [
            "Áp dụng cho đơn hàng từ 200,000đ trở lên",
            "Không áp dụng cho sản phẩm đang giảm giá",
            "Chỉ sử dụng được 1 lần",
        ],
        usageLimit: 1,
        usedCount: 1,
        validFrom: "01/01/2024",
        applicableProducts: ["Sản phẩm thường"],
        excludedProducts: ["Sản phẩm sale"],
        howToUse: "Voucher đã được sử dụng hết lượt",
    },
]

const mockCampaignVouchers: VoucherDetail[] = [
    {
        id: "3",
        code: "SUMMER30",
        title: "Khuyến mãi mùa hè",
        description: "Giảm 30% tối đa 100,000đ",
        discount: "30%",
        minOrder: 150000,
        maxDiscount: 100000,
        expiryDate: "31/08/2024",
        isUsable: true,
        type: "campaign",
        termsAndConditions: [
            "Áp dụng cho đơn hàng từ 150,000đ",
            "Giảm tối đa 100,000đ",
            "Áp dụng cho tất cả sản phẩm mùa hè",
            "Có thể sử dụng nhiều lần trong thời gian khuyến mãi",
        ],
        usageLimit: 5,
        usedCount: 2,
        validFrom: "01/06/2024",
        applicableProducts: ["Sản phẩm mùa hè", "Đồ bơi", "Quần áo mùa hè"],
        howToUse: "Thêm sản phẩm vào giỏ hàng và áp dụng mã này khi thanh toán",
    },
    {
        id: "4",
        code: "NEWUSER",
        title: "Ưu đãi khách hàng mới",
        description: "Giảm 50,000đ cho lần đầu mua hàng",
        discount: "50,000đ",
        minOrder: 300000,
        expiryDate: "31/12/2024",
        isUsable: false,
        type: "campaign",
        termsAndConditions: [
            "Chỉ dành cho khách hàng mới",
            "Áp dụng cho đơn hàng đầu tiên từ 300,000đ",
            "Không áp dụng cùng voucher khác",
            "Chỉ sử dụng được 1 lần",
        ],
        usageLimit: 1,
        usedCount: 0,
        validFrom: "01/01/2024",
        applicableProducts: ["Tất cả sản phẩm"],
        howToUse: "Bạn không đủ điều kiện sử dụng voucher này",
    },
]

interface VoucherPopupProps {
    onVoucherSelect?: (voucher: Voucher | null) => void
}

export default function VoucherPopup({ onVoucherSelect }: VoucherPopupProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [detailVoucher, setDetailVoucher] = useState<VoucherDetail | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // Memoized filtered vouchers
    const filteredPointVouchers = React.useMemo(() => {
        return mockPointVouchers.filter(
            (voucher) =>
                voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voucher.title.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }, [searchTerm])
    const filteredCampaignVouchers = React.useMemo(() => {
        return mockCampaignVouchers.filter(
            (voucher) =>
                voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voucher.title.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }, [searchTerm])

    const handleVoucherSelect = (voucher: VoucherDetail) => {
        if (!voucher.isUsable) return
        setSelectedVoucher(voucher)
    }

    const handleApplyVoucher = () => {
        if (selectedVoucher) {
            onVoucherSelect?.(selectedVoucher)
            setIsOpen(false)
        }
    }

    const handleViewDetail = (voucher: VoucherDetail, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setDetailVoucher(voucher)
        setIsDetailOpen(true)
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:shadow-md transition-all duration-200 bg-white">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                            <Ticket className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">Mã giảm giá</div>
                            {selectedVoucher ? (
                                <div className="text-xs text-orange-600 font-medium">
                                    {selectedVoucher.code} - {selectedVoucher.discount}
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500">Chọn hoặc nhập mã giảm giá</div>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 hover:from-orange-600 hover:to-orange-700 font-medium px-4"
                        >
                            Áp dụng
                        </Button>
                    </div>
                </DialogTrigger>

                <DialogContent className="xl:max-w-[800px] max-h-[90vh] p-0 flex flex-col h-[90vh] w-full overflow-x-hidden">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 border-b w-full overflow-x-hidden">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl w-full max-w-full break-words">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg flex items-center justify-center">
                                    <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700" />
                                </div>
                                <span className="break-words w-full max-w-full">Chọn mã giảm giá</span>
                            </DialogTitle>
                            <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-base w-full max-w-full break-words">Chọn voucher phù hợp để tiết kiệm chi phí cho đơn hàng của bạn</p>
                        </DialogHeader>
                    </div>
                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto p-2 sm:p-4 xl:p-6 space-y-2 sm:space-y-6 w-full max-w-full overflow-x-hidden">
                        {/* Search */}
                        <div className="relative w-full max-w-full">
                            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Tìm kiếm mã giảm giá theo tên hoặc mã voucher..."
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                className="focus-visible:ring-transparent pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base focus:border-orange-400 focus:border-2 focus:ring-orange-400 w-full max-w-full break-words"
                            />
                        </div>
                        {/* Voucher Tabs */}
                        <Tabs defaultValue="points" className="w-full max-w-full">
                            <TabsList className="grid w-full max-w-full grid-cols-1 sm:grid-cols-2 h-auto bg-gray-100 p-1 rounded-lg gap-1 overflow-x-hidden">
                                <TabsTrigger
                                    value="points"
                                    className="cursor-pointer flex items-center justify-center gap-1 sm:gap-2 h-10 sm:h-12 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 transition-all w-full max-w-full break-words"
                                >
                                    <Star className="w-4 h-4 flex-shrink-0 hidden sm:inline" />
                                    <span className="truncate break-words w-full max-w-full">Voucher điểm</span>

                                </TabsTrigger>
                                <TabsTrigger
                                    value="campaign"
                                    className="cursor-pointer flex items-center justify-center gap-1 sm:gap-2 h-10 sm:h-12 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 transition-all w-full max-w-full break-words"
                                >
                                    <Gift className="w-4 h-4 flex-shrink-0 hidden sm:inline" />
                                    <span className="truncate break-words w-full max-w-full">Khuyến mãi</span>

                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="points" className="mt-2 sm:mt-6 w-full max-w-full">
                                <div className="space-y-2 sm:space-y-4 w-full max-w-full">
                                    {filteredPointVouchers.length > 0 ? (
                                        filteredPointVouchers.map((voucher) => (
                                            <VoucherCard
                                                key={voucher.id}
                                                voucher={voucher}
                                                selectedVoucher={selectedVoucher}
                                                onSelect={handleVoucherSelect}
                                                onViewDetail={handleViewDetail}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 sm:py-12 w-full max-w-full">
                                            <Star className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-4" />
                                            <div className="text-gray-500 text-base sm:text-lg font-medium break-words w-full max-w-full">Không tìm thấy voucher phù hợp</div>
                                            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2 break-words w-full max-w-full">Thử tìm kiếm với từ khóa khác</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="campaign" className="mt-2 sm:mt-6 w-full max-w-full">
                                <div className="space-y-2 sm:space-y-4 w-full max-w-full">
                                    {filteredCampaignVouchers.length > 0 ? (
                                        filteredCampaignVouchers.map((voucher) => (
                                            <VoucherCard
                                                key={voucher.id}
                                                voucher={voucher}
                                                selectedVoucher={selectedVoucher}
                                                onSelect={handleVoucherSelect}
                                                onViewDetail={handleViewDetail}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 sm:py-12 w-full max-w-full">
                                            <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-4" />
                                            <div className="text-gray-500 text-base sm:text-lg font-medium break-words w-full max-w-full">Không tìm thấy voucher phù hợp</div>
                                            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2 break-words w-full max-w-full">Thử tìm kiếm với từ khóa khác</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                    {/* Action buttons always at bottom */}
                    <div className="flex gap-2 sm:gap-3 border-t bg-white px-2 sm:px-4 pt-4 w-full max-w-full overflow-x-hidden">
                        <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium max-w-full truncate break-words">
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={handleApplyVoucher}
                            disabled={!selectedVoucher}
                            className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed max-w-full truncate break-words"
                        >
                            {selectedVoucher ? `Áp dụng ${selectedVoucher.code}` : "Chọn voucher"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <VoucherDetailModal
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                detailVoucher={detailVoucher}
                onSelect={handleVoucherSelect}
            />
        </>
    )
}