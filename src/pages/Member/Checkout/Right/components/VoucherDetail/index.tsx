'use client';

import { Badge } from "@components/Atoms/ui/badge";
import { Button } from "@components/Atoms/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/Atoms/ui/dialog";
import { Tag, Ticket } from "lucide-react";

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

const VoucherDetailModal = ({
    open,
    onOpenChange,
    detailVoucher,
    onSelect
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    detailVoucher: VoucherDetail | null;
    onSelect: (voucher: VoucherDetail) => void;
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                            <Ticket className="w-4 h-4 text-orange-600" />
                        </div>
                        Chi tiết voucher
                    </DialogTitle>
                </DialogHeader>
                {detailVoucher && (
                    <div className="space-y-6">
                        {/* Voucher Header */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-bold text-2xl text-gray-900">{detailVoucher.code}</span>
                                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg px-4 py-2">
                                    {detailVoucher.discount}
                                </Badge>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">{detailVoucher.title}</h3>
                            <p className="text-gray-700">{detailVoucher.description}</p>
                        </div>
                        {/* Usage Information */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-orange-500" />
                                Thông tin sử dụng
                            </h4>
                            <div className="grid grid-cols-2 gap-6 text-sm">
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-500 block mb-1">Có hiệu lực từ:</span>
                                        <div className="font-medium text-gray-900">{detailVoucher.validFrom}</div>
                                    </div>
                                    {detailVoucher.minOrder && (
                                        <div>
                                            <span className="text-gray-500 block mb-1">Đơn hàng tối thiểu:</span>
                                            <div className="font-medium text-gray-900">{detailVoucher.minOrder.toLocaleString()}đ</div>
                                        </div>
                                    )}
                                    {detailVoucher.pointsRequired && (
                                        <div>
                                            <span className="text-gray-500 block mb-1">Điểm yêu cầu:</span>
                                            <div className="font-medium text-purple-600">{detailVoucher.pointsRequired} điểm</div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-500 block mb-1">Hết hạn:</span>
                                        <div className="font-medium text-gray-900">{detailVoucher.expiryDate}</div>
                                    </div>
                                    {detailVoucher.maxDiscount && (
                                        <div>
                                            <span className="text-gray-500 block mb-1">Giảm tối đa:</span>
                                            <div className="font-medium text-gray-900">{detailVoucher.maxDiscount.toLocaleString()}đ</div>
                                        </div>
                                    )}
                                    {detailVoucher.usageLimit && (
                                        <div>
                                            <span className="text-gray-500 block mb-1">Lượt sử dụng:</span>
                                            <div className="font-medium text-gray-900">
                                                {detailVoucher.usedCount}/{detailVoucher.usageLimit}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Applicable Products */}
                        {detailVoucher.applicableProducts && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                                <h4 className="font-semibold text-gray-900 mb-3">Sản phẩm áp dụng</h4>
                                <div className="flex flex-wrap gap-2">
                                    {detailVoucher.applicableProducts.map((product, index) => (
                                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                                            {product}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Excluded Products */}
                        {detailVoucher.excludedProducts && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                                <h4 className="font-semibold text-gray-900 mb-3">Sản phẩm không áp dụng</h4>
                                <div className="flex flex-wrap gap-2">
                                    {detailVoucher.excludedProducts.map((product, index) => (
                                        <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 px-3 py-1">
                                            {product}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Terms and Conditions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 mb-3">Điều kiện sử dụng</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                {detailVoucher.termsAndConditions.map((term, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-blue-500 mt-1 text-lg">•</span>
                                        <span>{term}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* How to Use */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 mb-3">Cách sử dụng</h4>
                            <p className="text-sm text-purple-800 leading-relaxed">{detailVoucher.howToUse}</p>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4 border-t">
                            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-12">
                                Đóng
                            </Button>
                            {detailVoucher.isUsable && (
                                <Button
                                    onClick={() => {
                                        onSelect(detailVoucher)
                                        onOpenChange(false)
                                    }}
                                    className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                                >
                                    Chọn voucher này
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default VoucherDetailModal;
