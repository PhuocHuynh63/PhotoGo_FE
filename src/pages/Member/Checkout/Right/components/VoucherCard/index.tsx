'use client';

import React from "react"
import { Star, Calendar, Gift, Sparkles } from "lucide-react"
import { Badge } from "@components/Atoms/ui/badge"
import { IVoucherFilter } from "@models/voucher/common.model";
import { VOUCHER } from "@constants/voucher";



const VoucherCard = ({ voucher, selectedVoucher, onSelect }: {
    voucher: IVoucherFilter;
    selectedVoucher: IVoucherFilter | null;
    onSelect: (voucher: IVoucherFilter) => void;
    // onViewDetail: (voucherId, e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
    const formattedValue = Number(voucher?.voucher.discount_value).toLocaleString('vi-VN', { maximumFractionDigits: 0 });
    const unit = voucher?.voucher.type === VOUCHER.TYPE.POINT ? 'đ' : ' %';
    return (
        <div
            className={`
                relative border rounded-lg sm:rounded-xl p-2 sm:p-5 w-full box-border max-w-full
                cursor-pointer transition-all duration-200 hover:shadow-lg
                ${voucher?.is_valid
                    ? selectedVoucher?.voucher.id === voucher?.voucher.id
                        ? "border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 shadow-md"
                        : "border-gray-200 hover:border-orange-300 bg-white hover:shadow-md"
                    : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                }
            `}
            style={{ maxWidth: '100%' }}
            onClick={() => onSelect(voucher)}
        >
            {/* Voucher Header */}
            <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2 sm:gap-3 w-full max-w-full">
                <div className="flex items-center gap-2 sm:gap-3 w-full max-w-full">
                    <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg flex items-center justify-center ${voucher?.voucher.type === VOUCHER.TYPE.POINT
                            ? "bg-gradient-to-br from-purple-100 to-purple-200"
                            : "bg-gradient-to-br from-blue-100 to-blue-200"
                            }`}
                    >
                        {voucher?.voucher.type === VOUCHER.TYPE.POINT ? (
                            <Star className={`w-5 h-5 ${voucher?.is_valid ? "text-purple-600" : "text-gray-400"}`} />
                        ) : (
                            <Gift className={`w-5 h-5 ${voucher?.is_valid ? "text-blue-600" : "text-gray-400"}`} />
                        )}
                    </div>
                    <div className="break-words w-full max-w-full">
                        <span className={`font-bold text-base sm:text-lg ${voucher?.is_valid ? "text-gray-900" : "text-gray-500"} break-words w-full max-w-full`}>{voucher?.voucher.code}</span>
                        {voucher?.voucher.point && (
                            <div className="flex items-center gap-1 mt-1">
                                <Sparkles className="w-3 h-3 text-purple-500" />
                                <span className="text-xs text-purple-600 font-medium break-words w-full max-w-full">{voucher?.voucher.point} điểm</span>
                            </div>
                        )}
                    </div>
                </div>
                <Badge
                    variant={voucher?.is_valid ? "default" : "secondary"}
                    className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 ${voucher?.is_valid ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" : "bg-gray-200 text-gray-500"
                        } max-w-full w-auto truncate break-words`}
                >
                    {
                        voucher?.voucher.type === VOUCHER.TYPE.POINT ?
                            formattedValue + unit :
                            formattedValue + unit
                    }
                </Badge>
            </div>
            {/* Voucher Content */}
            <div className="mb-2 sm:mb-4 break-words w-full max-w-full">
                <h4 className={`font-semibold text-sm sm:text-base mb-1 sm:mb-2 ${voucher?.is_valid ? "text-gray-900" : "text-gray-500"} break-words w-full max-w-full`}>
                    <div
                        dangerouslySetInnerHTML={{ __html: voucher?.voucher.description || '' }}
                    />
                </h4>
            </div>
            {/* Voucher Meta */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs mb-2 sm:mb-3 gap-2 w-full max-w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full max-w-full">
                    <div className="flex items-center gap-1 break-words w-full max-w-full">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500 break-words w-full max-w-full">HSD: {voucher?.voucher.end_date}</span>
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 gap-2 w-full max-w-full">
                {/* <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0 h-auto font-medium min-w-0 max-w-full truncate"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => onViewDetail(voucher, e)}
                >
                    <span className="break-words w-full max-w-full truncate">Xem chi tiết</span>
                    <ChevronRight className="w-3 h-3 ml-1" />
                </Button> */}
                {!voucher?.is_valid && <span className="text-xs text-red-500 font-medium break-words w-full max-w-full">Không khả dụng</span>}
                {voucher?.is_valid && selectedVoucher?.voucher.id === voucher?.voucher.id && (
                    <Badge className="bg-green-100 text-green-700 text-xs max-w-full truncate break-words">Đã chọn</Badge>
                )}
            </div>
        </div>
    );
}

export default VoucherCard;