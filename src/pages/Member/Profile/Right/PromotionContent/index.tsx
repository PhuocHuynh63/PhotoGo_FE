'use client'

import { useEffect, useState } from "react";
import { Card } from "@components/Atoms/Card";
import Button from "@components/Atoms/Button";
import { Gift, Coins, Megaphone, CameraIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@helpers/CN";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Molecules/Tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useSetLocalStorage } from "@utils/hooks/localStorage";
import Link from "next/link";
import { ROUTES } from "@routes";
import { PAGES } from "../../../../../types/IPages";
import { Skeleton } from "@components/Atoms/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@components/Atoms/ui/radio-group";
import { useVoucherFromCampaign } from "@utils/hooks/useVoucherFromCampaign";
import { IVoucherFromCampaign, IVoucherFromPoint } from "@models/voucher/common.model";
import { useVoucher } from "@utils/hooks/useVoucher";

export default function PromotionsPage({ session }: PAGES.IPromotionPageProps) {
    const [tab, setTab] = useState("all");
    const [statusTab, setStatusTab] = useState("hoạt động");
    const [selectedVoucherId, setSelectedVoucherId] = useState<string>("");

    const { vouchers: vouchersFromPoint, loading: loadingPoint, fetchVouchers: fetchVouchersPoint, pagination: paginationPoint } = useVoucher(session?.user?.id);
    const { vouchers: vouchersFromCampaign, loading: loadingCampaign, fetchVouchers: fetchVouchersCampaign, pagination: paginationCampaign } = useVoucherFromCampaign(session?.user?.id);

    // Lưu voucher ID vào localStorage khi có thay đổi
    useSetLocalStorage("selectedVoucherId", selectedVoucherId);

    useEffect(() => {
        const status = statusTab === "hoạt động" ? "hoạt động" : "used";

        // Only fetch vouchers for the currently active tab
        switch (tab) {
            case 'point':
                fetchVouchersPoint(1, 6, status);
                break;
            case 'campaign':
                fetchVouchersCampaign(1, 6, status);
                break;
            case 'all':
                // For "all" tab, fetch both types
                fetchVouchersPoint(1, 6, status);
                fetchVouchersCampaign(1, 6, status);
                break;
        }
    }, [fetchVouchersPoint, fetchVouchersCampaign, statusTab, tab]);

    const handleUseVoucher = (voucherId: string) => {
        setSelectedVoucherId(voucherId);
    };

    // Transform vouchersFromPoint to match the expected structure
    const transformedVouchersFromPoint = vouchersFromPoint?.map((item: IVoucherFromPoint) => ({
        ...item.voucher,
        id: item.voucher_id,
        status: item.status,
        assigned_at: item.assigned_at,
        used_at: item.used_at,
        is_valid: item.is_valid
    })) || [];

    const transformedVouchersFromCampaign = vouchersFromCampaign?.map((item: IVoucherFromCampaign) => ({
        ...item.voucher,
        id: item.voucher_id,
        status: item.status,
        assigned_at: item.assigned_at,
        used_at: item.used_at,
        is_valid: item.is_valid
    })) || [];

    const filterVouchers = (vouchers: Array<{ status: string; id: string; description: string; code: string; type: string; discount_type: string; discount_value: string; minPrice: number; maxPrice: number; quantity: number; point: number; start_date: string; end_date: string;[key: string]: unknown }>, isValid: boolean) => {
        if (!vouchers || !Array.isArray(vouchers)) return [];
        return vouchers.filter(voucher => voucher.status === (isValid ? "có sẵn" : "đã sử dụng")) || [];
    };

    // Get filtered vouchers for current status
    const getFilteredVouchers = (type: 'point' | 'campaign' | 'all') => {
        const pointVouchers = filterVouchers(transformedVouchersFromPoint, statusTab === "hoạt động");
        const campaignVouchers = filterVouchers(transformedVouchersFromCampaign, statusTab === "hoạt động");

        switch (type) {
            case 'point':
                return pointVouchers;
            case 'campaign':
                return campaignVouchers;
            case 'all':
                return [...pointVouchers, ...campaignVouchers];
            default:
                return [];
        }
    };

    // Get current pagination info
    const getCurrentPagination = () => {
        switch (tab) {
            case 'point': return paginationPoint;
            case 'campaign': return paginationCampaign;
            case 'all': return {
                currentPage: 1,
                totalPages: Math.ceil((paginationPoint.totalItems + paginationCampaign.totalItems) / 6),
                totalItems: paginationPoint.totalItems + paginationCampaign.totalItems,
                pageSize: 6
            };
            default: return paginationPoint;
        }
    };

    const handlePageChange = (newPage: number) => {
        const status = statusTab === "hoạt động" ? "hoạt động" : "đã sử dụng";

        switch (tab) {
            case 'point':
                fetchVouchersPoint(newPage, 6, status);
                break;
            case 'campaign':
                fetchVouchersCampaign(newPage, 6, status);
                break;
            case 'all':
                // For "all" tab, we need to fetch both types
                fetchVouchersPoint(newPage, 6, status);
                fetchVouchersCampaign(newPage, 6, status);
                break;
        }
    };

    const handleStatusChange = (newStatus: string) => {
        setStatusTab(newStatus);
        // Reset to page 1 when changing status
        const status = newStatus === "hoạt động" ? "hoạt động" : "đã sử dụng";

        switch (tab) {
            case 'point':
                fetchVouchersPoint(1, 6, status);
                break;
            case 'all':
                fetchVouchersPoint(1, 6, status);
                fetchVouchersCampaign(1, 6, status);
                break;
        }
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

    const VoucherCardSkeleton = () => (
        <Card className="relative flex border border-orange-200 bg-orange-50 shadow-sm rounded-xl overflow-hidden">
            {/* Left side skeleton */}
            <div className="p-5 w-2/3 flex flex-col justify-between">
                <div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-2/3 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex gap-4 mt-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>

            {/* Right side skeleton */}
            <div className="w-1/3 bg-white border-l border-dashed border-orange-300 flex flex-col justify-center items-center p-4 text-center">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-8 w-20 mb-3" />
                <Skeleton className="h-8 w-full" />
            </div>
        </Card>
    );

    const Pagination = ({ currentPage, totalPages, onPageChange }: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    }) => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1 text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Trước
                </Button>

                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => onPageChange(page)}
                            className="w-8 h-8 p-0 text-sm"
                        >
                            {page}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1 text-sm"
                >
                    Sau
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">Ưu đãi dành cho bạn</h1>

            <Tabs defaultValue="all" value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid grid-cols-3 gap-2 bg-orange-100 p-1 rounded-xl max-w-md mx-auto mb-6">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="point">Đổi điểm</TabsTrigger>
                    <TabsTrigger value="campaign">Chiến dịch</TabsTrigger>
                </TabsList>

                {/* Radio filter trạng thái */}
                <div className="flex justify-center mb-6">
                    <RadioGroup
                        value={statusTab}
                        onValueChange={handleStatusChange}
                        className="grid grid-cols-2 gap-6"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hoạt động" id="active" />
                            <label
                                htmlFor="active"
                                className={cn(
                                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                    statusTab === "hoạt động" ? "font-semibold text-orange-600" : "text-gray-600"
                                )}
                            >
                                Đang hoạt động
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="đã sử dụng" id="used" />
                            <label
                                htmlFor="used"
                                className={cn(
                                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                    statusTab === "đã sử dụng" ? "font-semibold text-orange-600" : "text-gray-600"
                                )}
                            >
                                Đã sử dụng
                            </label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Voucher count info */}
                <div className="text-center mb-4 text-sm text-gray-600">
                    {tab === "all" && (
                        <span>
                            Tổng cộng: {paginationPoint.totalItems + paginationCampaign.totalItems} voucher
                            {paginationPoint.totalItems > 0 && ` (${paginationPoint.totalItems} từ điểm, ${paginationCampaign.totalItems} từ chiến dịch)`}
                        </span>
                    )}
                    {tab === "point" && (
                        <span>Voucher từ điểm: {paginationPoint.totalItems} voucher</span>
                    )}
                    {tab === "campaign" && (
                        <span>Voucher từ chiến dịch: {paginationCampaign.totalItems} voucher</span>
                    )}
                </div>

                {["all", "point", "campaign"].map((voucherType) => (
                    <TabsContent value={voucherType} key={voucherType}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                            <AnimatePresence>
                                {loadingPoint || loadingCampaign ? (
                                    // Hiển thị skeleton khi loading
                                    [...Array(4)].map((_, index) => (
                                        <motion.div
                                            key={`skeleton-${index}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                        >
                                            <VoucherCardSkeleton />
                                        </motion.div>
                                    ))
                                ) : (
                                    // Hiển thị voucher thật khi không loading
                                    getFilteredVouchers(voucherType as 'point' | 'campaign' | 'all').map((voucher) => (
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
                                                        <h3 className="text-lg font-semibold text-orange-600 mt-8 h-16 overflow-hidden text-ellipsis line-clamp-2">{voucher.description}</h3>
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

                                                    {statusTab === "hoạt động" && (
                                                        <Button
                                                            className="mt-3 text-orange-500 border-orange-300 hover:bg-orange-100 w-full text-sm"
                                                            disabled={!voucher.quantity}
                                                            onClick={() => handleUseVoucher(voucher.id)}
                                                        >
                                                            {voucher.quantity > 0 ?
                                                                <div className="flex items-center gap-2">
                                                                    <Link href={`${ROUTES.PUBLIC.SEARCH_VENDORS}`} className="flex items-center gap-2">
                                                                        Sử dụng ngay <CameraIcon className="w-4 h-4" />
                                                                    </Link>
                                                                </div>
                                                                : 'Hết lượt dùng'}
                                                        </Button>
                                                    )}

                                                    {statusTab === "đã sử dụng" && (
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
                                    ))
                                )}
                            </AnimatePresence>

                            {!loadingPoint && !loadingCampaign && getFilteredVouchers(voucherType as 'point' | 'campaign' | 'all').length === 0 && (
                                <div className="text-center py-12 col-span-full">
                                    <Gift className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-4 text-gray-500">Không có ưu đãi nào trong mục này</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={getCurrentPagination().currentPage}
                            totalPages={getCurrentPagination().totalPages}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
