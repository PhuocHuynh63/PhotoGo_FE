'use client';

import { IVoucherModel } from "@models/voucher/common.model";
import { VOUCHER } from "@constants/voucher";
import { Card, CardContent } from "@components/Atoms/ui/card";
import { Badge } from "@components/Atoms/ui/badge";
import LucideIcon from "@components/Atoms/LucideIcon";
import { Button } from "@components/Atoms/Button/Button";

interface VoucherCardProps {
    voucher: IVoucherModel;
    onEdit: () => void;
}

export default function VoucherCard({ voucher, onEdit }: VoucherCardProps) {
    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case VOUCHER.STATUS.AVAILABLE:
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        <LucideIcon name="CheckCircle" className="mr-1" iconSize={12} />
                        Hoạt động
                    </Badge>
                );
            case VOUCHER.STATUS.INACTIVE:
                return (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <LucideIcon name="PauseCircle" className="mr-1" iconSize={12} />
                        Không hoạt động
                    </Badge>
                );
            case VOUCHER.STATUS.EXPIRED:
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        <LucideIcon name="XCircle" className="mr-1" iconSize={12} />
                        Hết hạn
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        {status}
                    </Badge>
                );
        }
    };

    // Get type badge
    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'point':
                return (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        <LucideIcon name="Star" className="mr-1" iconSize={12} />
                        Điểm
                    </Badge>
                );
            case 'campaign':
                return (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        <LucideIcon name="DollarSign" className="mr-1" iconSize={12} />
                        Tiền
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        {type}
                    </Badge>
                );
        }
    };

    // Get discount display
    const getDiscountDisplay = () => {
        if (voucher?.discount_type === VOUCHER.DISCOUNT_TYPE.PERCENT) {
            return `${voucher?.discount_value}%`;
        }
        return `${parseInt(voucher?.discount_value).toLocaleString('vi-VN')}đ`;
    };

    return (
        <Card
            className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {voucher?.code}
                        </h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                        <LucideIcon name="Edit" iconSize={14} />
                    </Button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {getStatusBadge(voucher?.status)}
                    {getTypeBadge(voucher?.type)}
                </div>

                {/* Discount Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Giảm giá</p>
                            <p className="text-lg font-bold text-blue-600">
                                {getDiscountDisplay()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-600">Áp dụng</p>
                            <p className="text-sm font-medium text-gray-900">
                                {voucher?.minPrice.toLocaleString('vi-VN')}đ - {voucher?.maxPrice.toLocaleString('vi-VN')}đ
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Số lượng:</span>
                        <span className="font-medium">{voucher?.quantity}</span>
                    </div>
                    {voucher?.usedCount !== undefined && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Đã sử dụng:</span>
                            <span className="font-medium">{voucher?.usedCount}</span>
                        </div>
                    )}
                    {voucher?.point && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Điểm yêu cầu:</span>
                            <span className="font-medium flex items-center gap-1">
                                <LucideIcon name="Star" iconSize={12} className="text-yellow-500" />
                                {voucher?.point}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Hiệu lực:</span>
                        <span className="font-medium">
                            {formatDate(voucher?.start_date)} - {formatDate(voucher?.end_date)}
                        </span>
                    </div>
                </div>

                {/* Created date */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Tạo: {formatDate(voucher?.created_at)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
} 