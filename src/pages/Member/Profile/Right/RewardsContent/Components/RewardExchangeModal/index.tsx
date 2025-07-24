"use client"

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@components/Atoms/ui/dialog";
import { Button } from "@components/Atoms/ui/button";
import { Badge } from "@components/Atoms/ui/badge";
import { Gift } from "lucide-react";
import { IVoucherModel } from "@models/voucher/common.model";

export type RewardExchangeModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedVoucher: IVoucherModel | null;
    isExchanging: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    userPoints: number;
};

const RewardExchangeModal: React.FC<RewardExchangeModalProps> = ({
    open,
    onOpenChange,
    selectedVoucher,
    isExchanging,
    onConfirm,
    onCancel,
    userPoints,
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-orange-600" />
                    Xác nhận quy đổi voucher
                </DialogTitle>
                <DialogDescription>Bạn có chắc chắn muốn quy đổi điểm để nhận voucher này không?</DialogDescription>
            </DialogHeader>
            {selectedVoucher && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">{selectedVoucher.code}</span>
                        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                            {selectedVoucher.discount_value}% OFF
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3" dangerouslySetInnerHTML={{ __html: selectedVoucher.description }}></p>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Chi phí:</span>
                        <span className="font-bold text-orange-600">{selectedVoucher.point} điểm</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Điểm còn lại:</span>
                        <span className="font-bold text-gray-900">{userPoints - (selectedVoucher?.point ?? 0)} điểm</span>
                    </div>
                </div>
            )}
            <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={onCancel} disabled={isExchanging}>
                    Hủy bỏ
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={isExchanging}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                    {isExchanging ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Đang xử lý...
                        </>
                    ) : (
                        "Xác nhận quy đổi"
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default RewardExchangeModal; 