'use client'

import { useEffect, useState, useMemo } from "react";
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
import { useVoucher } from "@utils/hooks/useVoucher";
import { IVoucherFilter } from "@models/voucher/common.model";

const motionConfig = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
};

export default function PromotionsPage({ session }: PAGES.IPromotionPageProps) {
    const [tab, setTab] = useState("all");
    const [statusTab, setStatusTab] = useState("hoạt động");
    const [selectedVoucherId, setSelectedVoucherId] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);

    // Use only one hook for all vouchers
    const {
        vouchers,
        loading,
        fetchVouchers,
        pagination
    } = useVoucher({
        userId: session?.user?.id,
        current: currentPage,
        pageSize: 6,
        status: statusTab === "hoạt động" ? "hoạt động" : "used"
    });

    // Lưu voucher ID vào localStorage khi có thay đổi
    useSetLocalStorage("selectedVoucherId", selectedVoucherId);

    useEffect(() => {
        const status = statusTab === "hoạt động" ? "hoạt động" : "used";
        fetchVouchers(currentPage, 6, status);
    }, [fetchVouchers, statusTab, currentPage]);

    const handleUseVoucher = (voucherId: string) => {
        setSelectedVoucherId(voucherId);
    };

    // Transform vouchers to match the expected structure
    const transformedVouchers = useMemo(() =>
    (vouchers?.map((item: IVoucherFilter) => ({
        ...item.voucher,
        id: item.voucher_id,
        status: item.status,
        from: item.from,
        assigned_at: item.assigned_at,
        used_at: item.used_at,
        is_valid: item.is_valid,
        point: item.voucher?.point,
        minPrice: item.voucher?.minPrice,
        maxPrice: item.voucher?.maxPrice,
        discount_type: item.voucher?.discount_type,
        discount_value: item.voucher?.discount_value,
        code: item.voucher?.code,
        description: item.voucher?.description,
        start_date: item.voucher?.start_date,
        end_date: item.voucher?.end_date,
        quantity: item.voucher?.quantity,
    })) || []), [vouchers]
    );

    // Filter vouchers by tab and status
    const filteredVouchers = useMemo(() => ({
        all: transformedVouchers.filter(v => v.status === (statusTab === "hoạt động" ? "có sẵn" : "đã sử dụng")),
        point: transformedVouchers.filter(v => v.from === 'đổi điểm' && v.status === (statusTab === "hoạt động" ? "có sẵn" : "đã sử dụng")),
        campaign: transformedVouchers.filter(v => v.from === 'chiến dịch' && v.status === (statusTab === "hoạt động" ? "có sẵn" : "đã sử dụng")),
    }), [transformedVouchers, statusTab]);

    // Pagination info
    const getCurrentPagination = () => pagination;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleStatusChange = (newStatus: string) => {
        setStatusTab(newStatus);
        setCurrentPage(1);
    };

    const getVoucherIcon = (from: string) => {
        return from === "đổi điểm" ?
            <Coins className="w-5 h-5 text-yellow-500 absolute top-2 right-2" /> :
            <Megaphone className="w-5 h-5 text-blue-500 absolute top-2 right-2" />;
    };

    const getVoucherBadge = (from: string) => {
        return (
            <div className={cn(
                "absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium",
                from === "đổi điểm" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
            )}>
                {from === "đổi điểm" ? "Đổi điểm" : "Chiến dịch"}
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

    const voucherCountInfo = useMemo(() => {
        const pointCount = transformedVouchers.filter(v => v.from === 'đổi điểm').length;
        const campaignCount = transformedVouchers.filter(v => v.from === 'chiến dịch').length;
        return { pointCount, campaignCount, total: transformedVouchers.length };
    }, [transformedVouchers]);

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
                            Tổng cộng: {voucherCountInfo.total} voucher
                            {(() => {
                                const pointCount = voucherCountInfo.pointCount;
                                const campaignCount = voucherCountInfo.campaignCount;
                                return pointCount > 0 ? ` (${pointCount} từ điểm, ${campaignCount} từ chiến dịch)` : '';
                            })()}
                        </span>
                    )}
                    {tab === "point" && (
                        <span>Voucher từ điểm: {voucherCountInfo.pointCount} voucher</span>
                    )}
                    {tab === "campaign" && (
                        <span>Voucher từ chiến dịch: {voucherCountInfo.campaignCount} voucher</span>
                    )}
                </div>
                {["all", "point", "campaign"].map((voucherType) => (
                    <TabsContent value={voucherType} key={voucherType}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                            <AnimatePresence>
                                {loading ? (
                                    // Hiển thị skeleton khi loading
                                    [...Array(4)].map((_, index) => (
                                        <motion.div
                                            key={`skeleton-${index}`}
                                            initial={motionConfig.initial}
                                            animate={motionConfig.animate}
                                            exit={motionConfig.exit}
                                            transition={motionConfig.transition}
                                        >
                                            <VoucherCardSkeleton />
                                        </motion.div>
                                    ))
                                ) : (
                                    // Hiển thị voucher thật khi không loading
                                    filteredVouchers[voucherType as 'point' | 'campaign' | 'all'].map((voucher) => (
                                        <motion.div
                                            key={voucher.id}
                                            initial={motionConfig.initial}
                                            animate={motionConfig.animate}
                                            exit={motionConfig.exit}
                                            transition={motionConfig.transition}
                                        >
                                            <Card
                                                className={cn(
                                                    "relative flex border border-orange-200 bg-orange-50 shadow-sm rounded-xl overflow-hidden hover:scale-[1.01] transition-transform duration-200"
                                                )}
                                            >
                                                {getVoucherIcon(voucher.from)}
                                                {getVoucherBadge(voucher.from)}
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
                                                            {voucher.from === "đổi điểm" && (
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
                                                            initial={motionConfig.initial}
                                                            animate={motionConfig.animate}
                                                            transition={motionConfig.transition}
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
                            {!loading && filteredVouchers[voucherType as 'point' | 'campaign' | 'all'].length === 0 && (
                                <div className="text-center py-12 col-span-full">
                                    <Gift className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-4 text-gray-500">Không có ưu đãi nào trong mục này</p>
                                </div>
                            )}
                        </div>
                        {/* Pagination */}
                        <Pagination
                            currentPage={getCurrentPagination().current}
                            totalPages={getCurrentPagination().totalPages}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
