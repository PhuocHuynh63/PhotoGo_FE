"use client";
import React, { useEffect, useState } from "react";
import { campaignService } from "@services/campaign";
import LucideIcon from "@components/Atoms/LucideIcon";

function formatDate(dateStr: string) {
    if (!dateStr) return "--";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
}

function StatusBadge({ status }: { status: boolean | string }) {
    if (status === true || status === "true" || status === "active") {
        return (
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold shadow-sm">
                <LucideIcon name="CheckCircle" className="mr-2" iconSize={16} />
                Hoạt động
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold shadow-sm">
            <LucideIcon name="PauseCircle" className="mr-2" iconSize={16} />
            Không hoạt động
        </span>
    );
}

export default function BasicInfoTab({ campaignId }: { campaignId: string }) {
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        campaignService.getCampaignById(campaignId)
            .then(res => {
                const data = (res as any)?.data;
                setCampaign(data?.data || data || null);
            })
            .catch(() => setError("Không thể tải thông tin campaign"))
            .finally(() => setLoading(false));
    }, [campaignId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải thông tin campaign...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <p className="text-red-500 text-lg font-semibold">{error}</p>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-gray-500 text-lg">Không tìm thấy campaign</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{campaign.name}</h2>
                        <p className="text-gray-600">Thông tin chi tiết về chiến dịch</p>
                    </div>
                    <StatusBadge status={campaign.status} />
                </div>

                {campaign.description && (
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="flex items-start">
                            <LucideIcon name="FileText" className="mr-3 text-blue-500 mt-1" iconSize={18} />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Mô tả</h3>
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{campaign.description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Campaign Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Timeline Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <LucideIcon name="Calendar" className="text-blue-600" iconSize={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Thời gian chiến dịch</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center">
                                <LucideIcon name="PlayCircle" className="mr-3 text-green-600" iconSize={16} />
                                <span className="font-medium text-gray-700">Ngày bắt đầu</span>
                            </div>
                            <span className="font-semibold text-green-700">{formatDate(campaign.startDate)}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center">
                                <LucideIcon name="StopCircle" className="mr-3 text-red-600" iconSize={16} />
                                <span className="font-medium text-gray-700">Ngày kết thúc</span>
                            </div>
                            <span className="font-semibold text-red-700">{formatDate(campaign.endDate)}</span>
                        </div>
                    </div>
                </div>

                {/* System Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                            <LucideIcon name="Settings" className="text-purple-600" iconSize={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Thông tin hệ thống</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <LucideIcon name="Clock" className="mr-3 text-gray-500" iconSize={16} />
                                <span className="font-medium text-gray-700">Ngày tạo</span>
                            </div>
                            <span className="font-semibold text-gray-900">{formatDate(campaign.createdAt)}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <LucideIcon name="RefreshCcw" className="mr-3 text-gray-500" iconSize={16} />
                                <span className="font-medium text-gray-700">Cập nhật lần cuối</span>
                            </div>
                            <span className="font-semibold text-gray-900">{formatDate(campaign.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Stats (if available) */}
            {campaign.stats && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg mr-3">
                            <LucideIcon name="BarChart3" className="text-orange-600" iconSize={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Thống kê chiến dịch</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{campaign.stats.totalVendors || 0}</div>
                            <div className="text-sm text-gray-600">Vendor tham gia</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{campaign.stats.totalVouchers || 0}</div>
                            <div className="text-sm text-gray-600">Voucher được gán</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{campaign.stats.totalBookings || 0}</div>
                            <div className="text-sm text-gray-600">Đơn đặt hàng</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{campaign.stats.totalRevenue || 0}</div>
                            <div className="text-sm text-gray-600">Doanh thu (VNĐ)</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}