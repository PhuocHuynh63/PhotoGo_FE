"use client"

import { useEffect, useState } from "react"
import { Gift, Loader2, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/Atoms/ui/tooltip"
import RewardExchangeModal from "@pages/Member/Profile/Right/RewardsContent/Components/RewardExchangeModal";
import { useAllVouchers, useVoucher } from "@utils/hooks/useVoucher";
import { IUser } from "@models/user/common.model"
import voucherService from "@services/voucher";
import toast from "react-hot-toast"
import { IExchangeVoucherResponseModel } from "@models/voucher/response.model"
import usePoint from "@utils/hooks/usePoint"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "@components/Atoms/ui/pagination";
import RewardVoucherCard from "./Components/RewardCard";
import { IVoucherModel } from "@models/voucher/common.model";
import Button from "@components/Atoms/Button";


export default function RewardPage({ user }: { user: IUser }) {
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucherModel | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isExchanging, setIsExchanging] = useState(false)
    const { point, refetch: refetchPoint } = usePoint();
    const points = point?.balance ?? 0;
    const [animatedPoints, setAnimatedPoints] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;


    useEffect(() => {
        let start: number | null = null
        const duration = 1000 // in ms
        const initialValue = animatedPoints
        const diff = points - initialValue

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

        const step = (timestamp: number) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            const eased = easeOutCubic(progress)
            setAnimatedPoints(Math.floor(initialValue + diff * eased))
            if (progress < 1) requestAnimationFrame(step)
        }

        requestAnimationFrame(step)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [points])

    const { vouchers, loading, error, fetchAllVouchers, pagination } = useAllVouchers({
        current: currentPage,
        pageSize,
        type: "điểm",
        status: "hoạt động",
        sortBy: "maxPrice",
        sortDirection: "asc"
    })


    const { vouchers: ownedVouchers, fetchVouchers, } = useVoucher({
        userId: user?.id,
        current: 1,
        pageSize: 100,
        status: "hoạt động",
        from: "đổi điểm"
    })

    useEffect(() => {
        fetchAllVouchers();
        refetchPoint();
        fetchVouchers()
    }, [currentPage]);

    const handleExchangeClick = (voucher: IVoucherModel) => {
        setSelectedVoucher(voucher)
        setIsConfirmOpen(true)
    }

    const handleConfirmExchange = async () => {
        if (!selectedVoucher) return;
        setIsExchanging(true);
        try {
            const response = await voucherService.attachVoucher(selectedVoucher.id, user.id) as IExchangeVoucherResponseModel

            if (response.statusCode === 201) {
                toast.success(response.message || "Quy đổi voucher thành công");
                refetchPoint()
            } else {
                toast.error(response.message || "Đã xảy ra lỗi không xác định");
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Đã xảy ra lỗi không xác định");
            }
        } finally {
            setIsExchanging(false);
            setIsConfirmOpen(false);
            setSelectedVoucher(null);
        }
    }


    return (
        <TooltipProvider>
            <div className="w-full max-w-full mx-auto px-2 pb-10 overflow-x-hidden">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <Gift className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">Cửa hàng Voucher</h1>
                            <p className="text-gray-600">Quy đổi điểm thành voucher giảm giá hấp dẫn</p>
                        </div>
                    </div>
                    {/* Points Display */}
                    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 mb-6 overflow-hidden">
                        {/* Decorative coins */}
                        <div className="absolute top-4 left-4 animate-bounce">
                            <div className="w-12 h-12 bg-yellow-400 rounded-full border-4 border-yellow-300 shadow-lg transform -rotate-12"></div>
                        </div>
                        <div className="absolute bottom-12 right-12 animate-bounce" style={{ animationDelay: "0.5s" }}>
                            <div className="w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-300 shadow-lg transform rotate-12"></div>
                        </div>
                        <div className="absolute top-16 left-32 animate-bounce" style={{ animationDelay: "0.3s" }}>
                            <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-300 shadow-lg"></div>
                        </div>

                        {/* Stars */}
                        <div className="absolute top-8 right-24">
                            <div className="text-yellow-300 text-2xl">✦</div>
                        </div>
                        <div className="absolute bottom-16 left-16">
                            <div className="text-yellow-300 text-xl">✦</div>
                        </div>
                        <div className="absolute bottom-8 right-8">
                            <div className="text-yellow-300 text-2xl">✦</div>
                        </div>

                        {/* Help button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="absolute top-2 right-2 text-white/80 hover:text-white hover:bg-white/10"
                                >
                                    <HelpCircle className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="z-50">
                                Thông tin về điểm thưởng
                            </TooltipContent>
                        </Tooltip>

                        {/* Content */}
                        <div className="relative text-center text-white">
                            <h1 className={`text-7xl font-bold mb-2`}>
                                {animatedPoints}
                            </h1>
                            <p className="text-white/90">
                                {points > 0
                                    ? `Bạn có ${points} PhotoGo Point để sử dụng!`
                                    : "Có vẻ như bạn đã hết điểm. Hãy đặt hoạt động để nhận điểm nhé!"
                                }
                            </p>
                        </div>
                    </div>
                </div>
                {/* Loading & Error */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg animate-pulse mb-4">
                            <Gift className="h-10 w-10 text-white animate-bounce" />
                        </div>
                        <div className="flex items-center gap-2 text-orange-600 font-bold text-lg mb-1">
                            <Loader2 className="animate-spin h-6 w-6" />
                            Đang tải voucher...
                        </div>
                        <span className="text-gray-500 text-sm">Vui lòng chờ trong giây lát</span>
                    </div>
                )}
                {error && (
                    <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-xl border border-red-200 mx-auto max-w-md">
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100 mb-3">
                            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                        </div>
                        <span className="text-red-600 font-bold text-lg mb-1">Đã xảy ra lỗi khi tải voucher</span>
                        <span className="text-gray-500 text-sm mb-3">{error.message || 'Không thể kết nối đến máy chủ hoặc dữ liệu không hợp lệ.'}</span>
                        <button
                            onClick={fetchAllVouchers}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold shadow"
                        >Thử lại</button>
                    </div>
                )}
                {/* Voucher Grid - PromotionContent style */}
                {!loading && !error && (
                    <div>
                        <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                            {vouchers && vouchers.length > 0 && vouchers?.map((voucher: IVoucherModel) => (
                                <RewardVoucherCard
                                    key={voucher.id}
                                    voucher={voucher}
                                    onExchange={handleExchangeClick}
                                    userPoints={point?.balance ?? 0}
                                    ownedVouchers={ownedVouchers}
                                />
                            ))}
                        </div>
                        {/* Pagination UI */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-6">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious className="cursor-pointer"
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                aria-disabled={currentPage === 1}
                                            />
                                        </PaginationItem>
                                        {Array.from({ length: pagination.totalPages }).map((_, idx) => (
                                            <PaginationItem key={idx}>
                                                <PaginationLink className="cursor-pointer"
                                                    isActive={currentPage === idx + 1}
                                                    onClick={() => setCurrentPage(idx + 1)}
                                                >
                                                    {idx + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext className="cursor-pointer"
                                                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                                                aria-disabled={currentPage === pagination.totalPages}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                )}
                <RewardExchangeModal
                    open={isConfirmOpen}
                    onOpenChange={setIsConfirmOpen}
                    selectedVoucher={selectedVoucher}
                    isExchanging={isExchanging}
                    onConfirm={handleConfirmExchange}
                    onCancel={() => setIsConfirmOpen(false)}
                    userPoints={point?.balance ?? 0}
                />
            </div>
        </TooltipProvider>
    )
}
