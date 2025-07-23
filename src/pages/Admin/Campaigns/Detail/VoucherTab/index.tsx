"use client";
import React, { useEffect, useState } from "react";
import { campaignService } from "@services/campaign";
import Button from "@components/Atoms/Button";
import ConfirmDialog from "@components/Atoms/ConfirmDialog";

interface Voucher {
    id: string;
    code: string;
    description: string;
    discount_type: string;
    discount_value: string;
    minPrice: number;
    maxPrice: number;
    quantity: number;
    usedCount: number;
    type: string;
    point: number;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface AssignedVoucher {
    voucherId: string;
    assignedAt: string;
    isAvailable: boolean;
    voucher: Voucher;
}

export default function VoucherTab({ campaignId }: { campaignId: string }) {
    const [assignedVouchers, setAssignedVouchers] = useState<AssignedVoucher[]>([]);
    const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'assigned' | 'available'>('assigned');
    const [processingVouchers, setProcessingVouchers] = useState<Set<string>>(new Set());
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        voucherId: string;
        voucherCode: string;
    }>({
        isOpen: false,
        voucherId: '',
        voucherCode: ''
    });

    const fetchAssignedVouchers = async () => {
        try {
            const params = new URLSearchParams({
                current: "1",
                pageSize: "100",
                sortBy: "createdAt",
                sortDirection: "asc",
            });

            const res: any = await campaignService.getVoucherOfCampaign(campaignId, params);
            // console.log('Assigned vouchers response:', res);
            // console.log('Assigned vouchers data:', res?.data?.vouchers);
            setAssignedVouchers(res?.data?.vouchers || []);
        } catch (error) {
            console.error('Lỗi khi tải voucher đã gán:', error);
        }
    };

    const fetchAvailableVouchers = async () => {
        try {
            const res: any = await campaignService.getVoucherAvailable();
            // console.log('Available vouchers response:', res);
            // console.log('Available vouchers data:', res?.data);
            setAvailableVouchers(res?.data || []);
        } catch (error) {
            console.error('Lỗi khi tải voucher khả dụng:', error);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);

        try {
            await Promise.all([
                fetchAssignedVouchers(),
                fetchAvailableVouchers()
            ]);
        } catch (error) {
            setError("Không thể tải danh sách voucher");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [campaignId]);

    const handleAddVoucher = async (voucherId: string) => {
        setProcessingVouchers(prev => new Set(prev).add(voucherId));

        try {
            await campaignService.addVoucherToCampaign(campaignId, voucherId);

            // Fetch lại data sau khi thêm thành công
            await fetchAllData();

            // Chuyển sang tab "Đã gán" để user thấy kết quả
            setActiveTab('assigned');
        } catch (error) {
            console.error('Lỗi khi thêm voucher:', error);
            setError("Không thể thêm voucher. Vui lòng thử lại.");
        } finally {
            setProcessingVouchers(prev => {
                const newSet = new Set(prev);
                newSet.delete(voucherId);
                return newSet;
            });
        }
    };

    const handleRemoveVoucher = async (voucherId: string, voucherCode: string) => {
        setConfirmDialog({
            isOpen: true,
            voucherId,
            voucherCode
        });
    };

    const confirmRemoveVoucher = async () => {
        const { voucherId } = confirmDialog;

        setProcessingVouchers(prev => new Set(prev).add(voucherId));
        setConfirmDialog({ isOpen: false, voucherId: '', voucherCode: '' });

        try {
            await campaignService.removeVoucherFromCampaign(campaignId, voucherId);

            // Fetch lại data sau khi xóa thành công
            await fetchAllData();
        } catch (error) {
            console.error('Lỗi khi xóa voucher:', error);
            setError("Không thể xóa voucher. Vui lòng thử lại.");
        } finally {
            setProcessingVouchers(prev => {
                const newSet = new Set(prev);
                newSet.delete(voucherId);
                return newSet;
            });
        }
    };

    const cancelRemoveVoucher = () => {
        setConfirmDialog({ isOpen: false, voucherId: '', voucherCode: '' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const renderVoucherCard = (voucher: Voucher, showAddButton = false) => (
        <div key={voucher.id} className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{voucher.code}</h3>
                    <p className="text-sm text-gray-500">Mã: {voucher.code}</p>
                </div>
                <div className="flex items-center gap-2">
                    {showAddButton && (
                        <button
                            onClick={() => handleAddVoucher(voucher.id)}
                            disabled={processingVouchers.has(voucher.id)}
                            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Thêm voucher"
                        >
                            {processingVouchers.has(voucher.id) ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                    <span className="font-semibold text-gray-700">Giảm giá:</span>
                    <div className="text-lg font-bold text-blue-600 mt-1">
                        {voucher.discount_type === 'phần trăm'
                            ? `${voucher.discount_value}%`
                            : formatCurrency(parseFloat(voucher.discount_value))
                        }
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <span className="font-semibold text-gray-700">Giá trị tối thiểu:</span>
                    <div className="text-lg font-bold text-gray-900 mt-1">
                        {formatCurrency(voucher.minPrice)}
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <span className="font-semibold text-gray-700">Giảm tối đa:</span>
                    <div className="text-lg font-bold text-gray-900 mt-1">
                        {formatCurrency(voucher.maxPrice)}
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <span className="font-semibold text-gray-700">Đã sử dụng:</span>
                    <div className="text-lg font-bold text-gray-900 mt-1">
                        {voucher.usedCount}/{voucher.quantity}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                    Hiệu lực: {formatDate(voucher.start_date)} - {formatDate(voucher.end_date)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${voucher.status === 'hoạt động'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                    {voucher.status}
                </span>
            </div>
        </div>
    );

    if (loading) return <div className="text-center py-8">Đang tải danh sách voucher...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <>
            <div className="space-y-6">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('assigned')}
                        className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all duration-200 ${activeTab === 'assigned'
                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Voucher đã gán ({assignedVouchers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all duration-200 ${activeTab === 'available'
                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Voucher khả dụng ({availableVouchers.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'assigned' && (
                        <div className="space-y-4">
                            {assignedVouchers.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg">Chưa có voucher nào được gán</p>
                                </div>
                            ) : (
                                assignedVouchers.map(assignedVoucher => (
                                    <div key={assignedVoucher.voucherId} className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:border-red-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{assignedVoucher.voucher.code}</h3>
                                                <p className="text-sm text-gray-500">Mã: {assignedVoucher.voucher.code}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleRemoveVoucher(assignedVoucher.voucherId, assignedVoucher.voucher.code)}
                                                    disabled={processingVouchers.has(assignedVoucher.voucherId)}
                                                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Xóa voucher"
                                                >
                                                    {processingVouchers.has(assignedVoucher.voucherId) ? (
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <span className="font-semibold text-gray-700">Giảm giá:</span>
                                                <div className="text-lg font-bold text-blue-600 mt-1">
                                                    {assignedVoucher.voucher.discount_type === 'phần trăm'
                                                        ? `${assignedVoucher.voucher.discount_value}%`
                                                        : formatCurrency(parseFloat(assignedVoucher.voucher.discount_value))
                                                    }
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <span className="font-semibold text-gray-700">Giá trị tối thiểu:</span>
                                                <div className="text-lg font-bold text-gray-900 mt-1">
                                                    {formatCurrency(assignedVoucher.voucher.minPrice)}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <span className="font-semibold text-gray-700">Giảm tối đa:</span>
                                                <div className="text-lg font-bold text-gray-900 mt-1">
                                                    {formatCurrency(assignedVoucher.voucher.maxPrice)}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <span className="font-semibold text-gray-700">Đã sử dụng:</span>
                                                <div className="text-lg font-bold text-gray-900 mt-1">
                                                    {assignedVoucher.voucher.usedCount}/{assignedVoucher.voucher.quantity}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                            <span className="text-xs text-gray-500">
                                                Hiệu lực: {formatDate(assignedVoucher.voucher.start_date)} - {formatDate(assignedVoucher.voucher.end_date)}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${assignedVoucher.voucher.status === 'hoạt động'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {assignedVoucher.voucher.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === 'available' && (
                        <div className="space-y-4">
                            {availableVouchers.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg">Không có voucher nào khả dụng</p>
                                </div>
                            ) : (
                                availableVouchers.map(voucher => renderVoucherCard(voucher, true))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Xác nhận xóa voucher"
                message={`Bạn có chắc chắn muốn xóa voucher "${confirmDialog.voucherCode}" khỏi campaign này?`}
                confirmText="Xóa"
                cancelText="Hủy"
                onConfirm={confirmRemoveVoucher}
                onCancel={cancelRemoveVoucher}
                type="danger"
            />
        </>
    );
} 