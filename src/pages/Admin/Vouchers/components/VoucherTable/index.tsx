'use client';

import { IVoucherModel } from "@models/voucher/common.model";
import { IPagination } from "@models/metadata";
import { VOUCHER } from "@constants/voucher";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/Atoms/ui/table";
import { Badge } from "@components/Atoms/ui/badge";
import { Button } from "@components/Atoms/Button/Button";
import LucideIcon from "@components/Atoms/LucideIcon";
import { useState } from "react";
import EditVoucherDialog from "../EditVoucherDialog";

interface VoucherTableProps {
    vouchers: IVoucherModel[];
    pagination: IPagination;
    onPageChange: (page: number) => void;
    onVoucherUpdate: () => void;
}

export default function VoucherTable({ vouchers, pagination, onPageChange, onVoucherUpdate }: VoucherTableProps) {
    const [editingVoucher, setEditingVoucher] = useState<IVoucherModel | null>(null);



    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Get discount display
    const getDiscountDisplay = (voucher: IVoucherModel) => {
        if (voucher?.discount_type === VOUCHER.DISCOUNT_TYPE.PERCENT) {
            return `${voucher?.discount_value}%`;
        }
        return `${parseInt(voucher?.discount_value).toLocaleString('vi-VN')}đ`;
    };

    // Format price range
    const getPriceRange = (voucher: IVoucherModel) => {
        const min = voucher?.minPrice.toLocaleString('vi-VN');
        const max = voucher?.maxPrice.toLocaleString('vi-VN');
        return `${min}đ - ${max}đ`;
    };

    // Pagination controls
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const totalPages = pagination?.totalPage;
        const currentPage = pagination.current;

        // Hiển thị tối đa 7 trang
        let startPage = Math.max(1, currentPage - 3);
        let endPage = Math.min(totalPages, currentPage + 3);

        // Điều chỉnh để luôn hiển thị 7 trang nếu có thể
        if (endPage - startPage < 6) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 6);
            } else {
                startPage = Math.max(1, endPage - 6);
            }
        }

        // Thêm dấu ... nếu cần
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const handleEditVoucher = (voucher: IVoucherModel) => {
        setEditingVoucher(voucher);
    };

    const handleEditSuccess = () => {
        setEditingVoucher(null);
        onVoucherUpdate();
    };

    return (
        <div className="space-y-4">


            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-[120px] min-w-[120px]">Mã voucher</TableHead>
                                <TableHead className="w-[100px] min-w-[100px]">Loại</TableHead>
                                <TableHead className="w-[120px] min-w-[120px]">Giảm giá</TableHead>
                                <TableHead className="w-[100px] min-w-[100px]">Số lượng</TableHead>
                                <TableHead className="w-[120px] min-w-[120px]">Đã sử dụng</TableHead>
                                <TableHead className="w-[120px] min-w-[120px]">Hiệu lực</TableHead>
                                <TableHead className="w-[100px] min-w-[100px]">Trạng thái</TableHead>
                                <TableHead className="w-[80px] min-w-[80px]">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vouchers?.length > 0 ? (
                                vouchers.map((voucher) => (
                                    <TableRow key={voucher?.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <LucideIcon name="Tag" className="text-blue-500 flex-shrink-0" iconSize={16} />
                                                <span className="truncate">{voucher?.code}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={
                                                voucher?.type === 'point' || (voucher?.type && voucher?.type.toLowerCase() === 'điểm') ? 'text-purple-700 font-semibold' :
                                                    voucher?.type === 'campaign' || (voucher?.type && voucher?.type.toLowerCase() === 'tiền') ? 'text-orange-700 font-semibold' :
                                                        'text-gray-700 font-semibold'
                                            }>
                                                {voucher?.type === 'point' || (voucher?.type && voucher?.type.toLowerCase() === 'điểm') ? 'Điểm' :
                                                    voucher?.type === 'campaign' || (voucher?.type && voucher?.type.toLowerCase() === 'tiền') ? 'Tiền' : voucher?.type}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <span className="font-semibold text-blue-600">
                                                    {getDiscountDisplay(voucher)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">
                                                {voucher?.quantity.toLocaleString('vi-VN')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-600">
                                                {voucher?.usedCount?.toLocaleString('vi-VN') || 0}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-600">
                                                <div>{formatDate(voucher?.start_date)}</div>
                                                <div className="text-xs text-gray-500">đến</div>
                                                <div>{formatDate(voucher?.end_date)}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={
                                                voucher?.status === VOUCHER.STATUS.AVAILABLE || (voucher?.status && voucher?.status.toLowerCase() === 'hoạt động') ? 'text-green-700 font-semibold' :
                                                    voucher?.status === VOUCHER.STATUS.INACTIVE || (voucher?.status && voucher?.status.toLowerCase() === 'không hoạt động') ? 'text-gray-500 font-semibold' :
                                                        voucher?.status === VOUCHER.STATUS.EXPIRED || (voucher?.status && voucher?.status.toLowerCase() === 'hết hạn') ? 'text-red-700 font-semibold' :
                                                            'text-gray-700 font-semibold'
                                            }>
                                                {voucher?.status === VOUCHER.STATUS.AVAILABLE || (voucher?.status && voucher?.status.toLowerCase() === 'hoạt động') ? 'Hoạt động' :
                                                    voucher?.status === VOUCHER.STATUS.INACTIVE || (voucher?.status && voucher?.status.toLowerCase() === 'không hoạt động') ? 'Không hoạt động' :
                                                        voucher?.status === VOUCHER.STATUS.EXPIRED || (voucher?.status && voucher?.status.toLowerCase() === 'hết hạn') ? 'Hết hạn' : voucher?.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditVoucher(voucher)}
                                                className="h-8 w-8 p-0 hover:bg-blue-50 flex-shrink-0"
                                            >
                                                <LucideIcon name="Edit" iconSize={14} className="text-blue-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <LucideIcon name="Inbox" className="text-gray-400" iconSize={48} />
                                            <div className="text-gray-500">
                                                <p className="font-medium">Không có voucher nào</p>
                                                <p className="text-sm">Hãy tạo voucher đầu tiên để bắt đầu</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>
                        {pagination?.totalPage > 1 ? (
                            <>
                                Hiển thị {((pagination.current - 1) * pagination.pageSize) + 1} - {Math.min(pagination.current * pagination.pageSize, pagination?.totalItem)}
                                trong tổng số {pagination?.totalItem.toLocaleString('vi-VN')} voucher
                            </>
                        ) : (
                            <>
                                Hiển thị tất cả {pagination?.totalItem.toLocaleString('vi-VN')} voucher
                            </>
                        )}
                    </span>
                </div>

                {pagination?.totalPage > 1 && (
                    <div className="flex items-center gap-1">
                        {/* Previous button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.current - 1)}
                            disabled={pagination.current <= 1}
                            className="h-8 w-8 p-0"
                        >
                            <LucideIcon name="ChevronLeft" iconSize={16} />
                        </Button>

                        {/* Page numbers */}
                        {getPageNumbers().map((page, index) => (
                            typeof page === 'number' ? (
                                <Button
                                    key={page}
                                    variant={page === pagination.current ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(page)}
                                    className="h-8 w-8 p-0"
                                >
                                    {page}
                                </Button>
                            ) : (
                                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                                    {page}
                                </span>
                            )
                        ))}

                        {/* Next button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.current + 1)}
                            disabled={pagination.current >= pagination?.totalPage}
                            className="h-8 w-8 p-0"
                        >
                            <LucideIcon name="ChevronRight" iconSize={16} />
                        </Button>
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            {editingVoucher && (
                <EditVoucherDialog
                    voucher={editingVoucher}
                    open={!!editingVoucher}
                    onClose={() => setEditingVoucher(null)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
} 