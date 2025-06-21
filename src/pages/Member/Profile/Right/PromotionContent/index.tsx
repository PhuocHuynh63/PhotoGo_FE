'use client';

import { useState } from "react";
import { Card } from "@components/Atoms/Card";
import Button from "@components/Atoms/Button";
import { Gift, Coins, Megaphone } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@helpers/CN";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Molecules/Tabs";
import { motion, AnimatePresence } from "framer-motion";
import { PAGES } from "../../../../../types/IPages";

export default function PromotionsPage({ promotionFromPoint, promotionFromCampaign }: PAGES.IPromotionPageProps) {
    const [tab, setTab] = useState("active");

    const filterVouchers = (vouchers: typeof promotionFromPoint, isValid: boolean) => {
        return vouchers?.filter(voucher => voucher.status === (isValid ? "hoạt động" : "đã sử dụng")) || [];
    };

    const getVoucherIcon = (type: string) => {
        return type === "điểm" ?
            <Coins className="w-5 h-5 text-yellow-500 absolute top-2 right-2" /> :
            <Megaphone className="w-5 h-5 text-blue-500 absolute top-2 right-2" />;
    };

    const getVoucherBadge = (type: string) => {
        return (
            <div className={cn(
                "absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium",
                type === "điểm" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
            )}>
                {type === "điểm" ? "Đổi điểm" : "Chiến dịch"}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">Ưu đãi dành cho bạn</h1>

            <Tabs defaultValue="active" value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid grid-cols-2 gap-2 bg-orange-100 p-1 rounded-xl max-w-md mx-auto mb-6">
                    <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
                    <TabsTrigger value="used">Đã sử dụng</TabsTrigger>
                </TabsList>

                {["active", "used"].map((status) => (
                    <TabsContent value={status} key={status}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                            <AnimatePresence mode="wait">
                                {[...filterVouchers(promotionFromPoint, status === "active"),
                                ...filterVouchers(promotionFromCampaign, status === "active")].map((voucher) => (
                                    <motion.div
                                        key={voucher.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        <Card
                                            className={cn(
                                                "relative flex border border-orange-200 bg-orange-50 shadow-sm rounded-xl overflow-hidden hover:scale-[1.01] transition-transform duration-200"
                                            )}
                                        >
                                            {getVoucherIcon(voucher.type)}
                                            {getVoucherBadge(voucher.type)}

                                            {/* Left */}
                                            <div className="p-5 w-2/3 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-orange-600 mt-8">{voucher.description}</h3>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-sm font-medium">
                                                            {voucher.discount_type === "phần trăm"
                                                                ? `Giảm ${voucher.discount_value}%`
                                                                : `Giảm ${parseInt(voucher.discount_value).toLocaleString()}đ`}
                                                        </span>
                                                        {voucher.type === "điểm" && (
                                                            <span className="text-xs text-gray-500">
                                                                ({voucher.point} điểm)
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Đơn tối thiểu: {voucher.minPrice.toLocaleString()}đ
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Giảm tối đa: {voucher.maxPrice.toLocaleString()}đ
                                                    </p>
                                                </div>
                                                <div className="flex gap-4 text-xs text-gray-500 mt-3">
                                                    <p>Bắt đầu: <span className="font-bold text-orange-600">{format(new Date(voucher.start_date), 'dd/MM/yyyy')}</span></p>
                                                    <p>Kết thúc: <span className="font-bold text-orange-600">{format(new Date(voucher.end_date), 'dd/MM/yyyy')}</span></p>
                                                </div>
                                            </div>

                                            {/* Right */}
                                            <div className="w-1/3 bg-white border-l border-dashed border-orange-300 flex flex-col justify-center items-center p-4 text-center">
                                                <span className="text-xs text-gray-500 mb-1">Mã ưu đãi</span>
                                                <div className="bg-orange-100 px-3 py-1 rounded-md font-mono text-orange-600 text-sm font-bold tracking-wider shadow-inner">
                                                    {voucher.code}
                                                </div>

                                                {status === "active" && (
                                                    <Button
                                                        className="mt-3 text-orange-500 border-orange-300 hover:bg-orange-100 w-full text-sm"
                                                        disabled={!voucher.quantity}
                                                    >
                                                        {voucher.quantity > 0 ? 'Sử dụng ngay' : 'Hết lượt dùng'}
                                                    </Button>
                                                )}

                                                {status === "used" && (
                                                    <motion.span
                                                        className="text-xs text-gray-400 mt-3 italic"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        Đã sử dụng
                                                    </motion.span>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {[...filterVouchers(promotionFromPoint, status === "active"),
                            ...filterVouchers(promotionFromCampaign, status === "active")].length === 0 && (
                                    <div className="text-center py-12 col-span-full">
                                        <Gift className="mx-auto h-12 w-12 text-gray-300" />
                                        <p className="mt-4 text-gray-500">Không có ưu đãi nào trong mục này</p>
                                    </div>
                                )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
