import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/Atoms/ui/dialog";
import userService from "@services/user";
import { IUserStatisticsResponse } from "@models/user/response.model";
import LucideIcon from "@components/Atoms/LucideIcon";
import { CalendarCheck, CheckCircle, XCircle, Clock, DollarSign, Gift, Star } from 'lucide-react';

interface StatDialogProps {
    open: boolean;
    onClose: () => void;
    userId: string;
}

export default function StatDialog({ open, onClose, userId }: StatDialogProps) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IUserStatisticsResponse["data"] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && userId) {
            setLoading(true);
            setError(null);
            userService.statisticUser(userId)
                .then((statRes: IUserStatisticsResponse) => {
                    if (statRes && statRes.data) setData(statRes.data);
                    else setError("Không có dữ liệu thống kê!");
                })
                .catch(() => setError("Không thể lấy thống kê người dùng!"))
                .finally(() => setLoading(false));
        } else {
            setData(null);
            setError(null);
        }
    }, [open, userId]);

    // Sau khi lấy data, destructure ra stat
    const stat = data;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl w-full">
                <DialogHeader>
                    <DialogTitle>Thống kê khách hàng</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="py-8 text-center text-blue-600">Đang tải dữ liệu...</div>
                ) : error ? (
                    <div className="py-8 text-center text-red-500">{error}</div>
                ) : stat? (
                    <div className="space-y-6">
                        {/* Booking Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-2 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <CalendarCheck className="text-blue-500" size={20} />
                                    <span className="font-semibold text-blue-700">Booking</span>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                        <span className="text-xs text-gray-500">Tổng số</span>
                                        <span className="font-bold text-lg text-gray-900">{stat.totalBookings}</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                        <span className="text-xs text-gray-500">Hoàn thành</span>
                                        <span className="font-bold text-lg text-green-600">{stat.completedBookings}</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                        <span className="text-xs text-gray-500">Huỷ</span>
                                        <span className="font-bold text-lg text-red-500">{stat.cancelledBookings}</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                        <span className="text-xs text-gray-500">Chờ xử lý</span>
                                        <span className="font-bold text-lg text-yellow-600">{stat.pendingBookings}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 flex flex-col gap-2 border border-green-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="text-green-500" size={20} />
                                    <span className="font-semibold text-green-700">Thanh toán</span>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                        <span className="text-xs text-gray-500">Tổng tiền đã thanh toán</span>
                                        <span className="font-bold text-lg text-gray-900">{stat.totalPaidAmount?.toLocaleString()} đ</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                        <span className="text-xs text-gray-500">Booking đã thanh toán</span>
                                        <span className="font-bold text-lg text-blue-700">{stat.totalPaidCompletedBookings}</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                        <span className="text-xs text-gray-500">Tổng gói dịch vụ</span>
                                        <span className="font-bold text-lg text-purple-700">{stat.totalSubscriptions}</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1 min-w-[120px]">
                                        <span className="text-xs text-gray-500">Gói đã thanh toán</span>
                                        <span className="font-bold text-lg text-green-700">{stat.totalPaidSubscription}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Điểm thưởng */}
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="text-yellow-500" size={20} />
                                <span className="font-semibold text-yellow-700">Điểm thưởng</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500">Số dư hiện tại</span>
                                    <span className="font-bold text-lg text-yellow-700">{stat.points.currentBalance}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500">Tổng tích luỹ</span>
                                    <span className="font-bold text-lg text-yellow-700">{stat.points.totalEarned}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500">Đã sử dụng</span>
                                    <span className="font-bold text-lg text-yellow-700">{stat.points.totalRedeemed}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500">Đã hết hạn</span>
                                    <span className="font-bold text-lg text-yellow-700">{stat.points.totalExpired}</span>
                                </div>
                            </div>
                        </div>
                        {/* Voucher */}
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Gift className="text-purple-500" size={20} />
                                <span className="font-semibold text-purple-700">Voucher</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500">Tổng voucher</span>
                                    <span className="font-bold text-lg text-purple-700">{stat.vouchers.totalVouchers}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500">Đã dùng</span>
                                    <span className="font-bold text-lg text-purple-700">{stat.vouchers.usedVouchers}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500">Còn lại</span>
                                    <span className="font-bold text-lg text-purple-700">{stat.vouchers.availableVouchers}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-500">Không có dữ liệu thống kê</div>
                )}
            </DialogContent>
        </Dialog>
    );
}
