"use client"
export const dynamic = "force-dynamic";
import React from "react";
import { Coins } from "lucide-react";
import { Button } from "@components/Atoms/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@components/Atoms/ui/tooltip";
import { IVoucherFilter, IVoucherModel } from "@models/voucher/common.model";
import { formatDate } from "@utils/helpers/Date";


export type RewardVoucherCardProps = {
    voucher: IVoucherModel; // Should be typed as the voucher object shape
    onExchange: (voucher: IVoucherModel) => void;
    userPoints: number;
    ownedVouchers: IVoucherFilter[];
};

export default function RewardVoucherCard({ voucher, onExchange, userPoints, ownedVouchers }: RewardVoucherCardProps) {

    const getUnavailableReason = (voucher: IVoucherModel) => {
        const status = getVoucherStatus(voucher)
        switch (status) {
            case "expired":
                return "Voucher đã hết hạn."
            case "soldout":
                return "Voucher đã hết số lượng."
            case "insufficient":
                return "Bạn không đủ điểm để đổi voucher này."
            case "inactive":
                return "Voucher không còn hoạt động."
            default:
                return "Không khả dụng."
        }
    }
    const isVoucherExpired = (endDate: string) => {
        return new Date(endDate) < new Date()
    }

    const isVoucherAvailable = (quantity: number, usedCount: number) => {
        return quantity > usedCount
    }

    const canAffordVoucher = (voucherPoints: number, userPoints: number) => {
        return userPoints >= voucherPoints
    }


    const getVoucherStatus = (voucher: IVoucherModel) => {
        if (voucher?.status !== "hoạt động") return "inactive"
        if (isVoucherExpired(voucher?.end_date)) return "expired"
        if (!isVoucherAvailable(voucher?.quantity, voucher?.usedCount ?? 0)) return "soldout"
        if (!canAffordVoucher(voucher?.point ?? 0, userPoints)) return "insufficient"
        return "available"
    }
    const status = getVoucherStatus(voucher);
    const isAvailable = status === "available";
    const isOwned = ownedVouchers?.some(v => v.voucher_id === voucher.id);
    const shouldDisable = !isAvailable || isOwned;
    const tooltipReason = isOwned
        ? "Bạn đã sở hữu voucher này."
        : !isAvailable
            ? getUnavailableReason(voucher)
            : "";


    return (
        <div
            className="relative flex border border-orange-200 bg-orange-50 shadow-sm rounded-xl hover:scale-[1.01] transition-transform duration-200 max-w-full"
        >
            {/* Icon & Badge */}
            <Coins className="w-5 h-5 text-yellow-500 absolute top-2 right-2" />
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Đổi điểm</div>
            {/* Left: Info */}
            <div className="p-5 w-2/3 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-orange-600 mt-8 h-16 overflow-hidden text-ellipsis line-clamp-2">{voucher?.description}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-medium">
                            {voucher?.discount_type === "phần trăm"
                                ? `Giảm ${voucher?.discount_value}%`
                                : `Giảm ${parseInt(voucher?.discount_value).toLocaleString()}đ`}
                        </span>
                        <span className="text-xs text-gray-500">({voucher?.point} điểm)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Đơn tối thiểu: {voucher?.minPrice?.toLocaleString()}đ
                    </p>
                    <p className="text-xs text-gray-500">
                        Giảm tối đa: {voucher?.maxPrice?.toLocaleString()}đ
                    </p>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 mt-3">
                    <p>Bắt đầu: <span className="font-bold text-orange-600">{formatDate(voucher?.start_date)}</span></p>
                    <p>Kết thúc: <span className="font-bold text-orange-600">{formatDate(voucher?.end_date)}</span></p>
                </div>
            </div>
            {/* Right: Code + Button */}
            <div className="w-1/3 bg-white border-l border-dashed border-orange-300 flex flex-col justify-center items-center p-4 text-center rounded-r-xl">
                <span className="text-xs text-gray-500 mb-1">Mã ưu đãi</span>
                <div className="bg-orange-100 px-3 py-1 rounded-md font-mono text-orange-600 text-sm font-bold tracking-wider shadow-inner">
                    {voucher?.code}
                </div>
                {/* Badge số điểm quy đổi */}
                <div className={`flex items-center justify-center gap-1 mt-3 mb-1 px-2 py-1 rounded-full text-xs font-semibold ${isAvailable ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-400'}`}>
                    <Coins className={`w-4 h-4 ${isAvailable ? 'text-orange-500' : 'text-gray-400'}`} />
                    {voucher?.point} điểm
                </div>
                <TooltipProvider>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="w-full">
                                <Button
                                    onClick={isAvailable && !isOwned ? () => onExchange(voucher) : undefined}
                                    disabled={shouldDisable}
                                    className={shouldDisable
                                        ? "mt-1 w-full bg-gray-300 text-gray-500 cursor-not-allowed text-sm"
                                        : "mt-1 w-full text-orange-500 border-orange-300 hover:bg-orange-100 text-sm"}
                                >
                                    Quy đổi
                                </Button>
                            </span>
                        </TooltipTrigger>
                        {shouldDisable && (
                            <TooltipContent side="left" className="z-50">
                                {tooltipReason}
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};
