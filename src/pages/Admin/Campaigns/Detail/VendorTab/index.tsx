"use client";
import React, { useEffect, useState } from "react";
import { campaignService } from "@services/campaign";
import LucideIcon from "@components/Atoms/LucideIcon";

interface Vendor {
    id: string;
    isAvailable: boolean;
    invited: boolean;
    createdAt: string;
    updatedAt: string;
    vendor: {
        id: string;
        name: string;
        slug: string;
        description: string;
        logo: string;
        banner: string | null;
        status: string;
        priority: number;
        created_at: string;
        updated_at: string;
    };
}

export default function VendorTab({ campaignId }: { campaignId: string }) {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'joined' | 'invited' | 'available'>('available');
    const [invitingVendors, setInvitingVendors] = useState<Set<string>>(new Set());

    const fetchVendors = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                current: "1",
                pageSize: "100",
                sortBy: "created_at",
                sortDirection: "asc",
            });

            const res: any = await campaignService.getVendorOfCampaign(campaignId, params);
            console.log('API Response:', res);
            console.log('Vendors data:', res?.data?.data);
            const vendorsData = res?.data?.data || [];
            setVendors(vendorsData);
        } catch (error) {
            setError("Không thể tải danh sách vendor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, [campaignId]);

    const handleInviteVendor = async (vendorId: string) => {
        setInvitingVendors(prev => new Set(prev).add(vendorId));

        try {
            await campaignService.inviteVendorToCampaign({
                campaignId,
                vendorId,
            });

            // Fetch lại data sau khi mời thành công
            await fetchVendors();

            // Chuyển sang tab "Đã mời" để user thấy kết quả
            setActiveTab('invited');
        } catch (error) {
            console.error('Lỗi khi mời vendor:', error);
            setError("Không thể mời vendor. Vui lòng thử lại.");
        } finally {
            setInvitingVendors(prev => {
                const newSet = new Set(prev);
                newSet.delete(vendorId);
                return newSet;
            });
        }
    };

    // Debug state changes
    useEffect(() => {
        console.log('Vendors state changed:', vendors);
        console.log('Vendors state length:', vendors.length);
    }, [vendors]);

    // Phân loại vendor theo trạng thái
    console.log('All vendors:', vendors);
    console.log('Vendors length:', vendors.length);

    const joinedVendors = vendors.filter(v => v.isAvailable === true);
    const invitedVendors = vendors.filter(v => v.invited === true && v.isAvailable === false);
    const availableVendors = vendors.filter(v => v.invited === false && v.isAvailable === false);

    console.log('Joined vendors:', joinedVendors.length);
    console.log('Invited vendors:', invitedVendors.length);
    console.log('Available vendors:', availableVendors.length);

    const getStatusBadge = (vendor: Vendor) => {
        if (vendor.isAvailable) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    <LucideIcon name="CheckCircle" className="mr-1" iconSize={12} />
                    Đã tham gia
                </span>
            );
        } else if (vendor.invited) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    <LucideIcon name="Clock" className="mr-1" iconSize={12} />
                    Đã mời
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                    <LucideIcon name="User" className="mr-1" iconSize={12} />
                    Khả dụng
                </span>
            );
        }
    };

    const renderVendorCard = (vendor: Vendor, showInviteButton = false) => (
        <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200">
            <div className="flex items-start gap-4">
                {/* Vendor Avatar */}
                <div className="flex-shrink-0">
                    <div className="relative">
                        <img
                            src={vendor.vendor.logo}
                            alt={vendor.vendor.name}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 shadow-sm"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder-avatar.png';
                            }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                            <LucideIcon
                                name={vendor.isAvailable ? "CheckCircle" : vendor.invited ? "Clock" : "User"}
                                className={vendor.isAvailable ? "text-green-500" : vendor.invited ? "text-blue-500" : "text-gray-400"}
                                iconSize={12}
                            />
                        </div>
                    </div>
                </div>

                {/* Vendor Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{vendor.vendor.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <LucideIcon name="Hash" className="text-gray-400" iconSize={14} />
                                <span>{vendor.vendor.slug}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(vendor)}
                            {showInviteButton && !vendor.isAvailable && !vendor.invited && (
                                <button
                                    onClick={() => handleInviteVendor(vendor.vendor.id)}
                                    disabled={invitingVendors.has(vendor.vendor.id)}
                                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Mời vendor"
                                >
                                    {invitingVendors.has(vendor.vendor.id) ? (
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <LucideIcon name="Mail" className="w-4 h-4" iconSize={16} />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {vendor.vendor.description && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-start">
                                <LucideIcon name="FileText" className="mr-2 text-gray-400 mt-0.5" iconSize={14} />
                                <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                                    {vendor.vendor.description.replace(/<[^>]*>/g, '')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Vendor Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center mb-1">
                                <LucideIcon name="Star" className="mr-2 text-blue-500" iconSize={14} />
                                <span className="font-semibold text-gray-700">Độ ưu tiên</span>
                            </div>
                            <div className="text-lg font-bold text-blue-600">{vendor.vendor.priority}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                            <div className="flex items-center mb-1">
                                <LucideIcon name="Activity" className="mr-2 text-purple-500" iconSize={14} />
                                <span className="font-semibold text-gray-700">Trạng thái</span>
                            </div>
                            <div className="text-lg font-bold text-purple-600 capitalize">{vendor.vendor.status}</div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-4">
                        <span className="text-xs text-gray-500">
                            <LucideIcon name="Calendar" className="inline mr-1" iconSize={12} />
                            Tạo: {new Date(vendor.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-xs text-gray-500">
                            <LucideIcon name="RefreshCcw" className="inline mr-1" iconSize={12} />
                            Cập nhật: {new Date(vendor.updatedAt).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEmptyState = (message: string, icon: any) => (
        <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
                <LucideIcon name={icon} className="w-16 h-16 mx-auto" iconSize={64} />
            </div>
            <p className="text-gray-500 text-lg">{message}</p>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải danh sách vendor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-400 mb-4">
                    <LucideIcon name="AlertCircle" className="w-16 h-16 mx-auto" iconSize={64} />
                </div>
                <p className="text-red-500 text-lg font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('joined')}
                    className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all duration-200 ${activeTab === 'joined'
                        ? 'border-green-500 text-green-600 bg-green-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <LucideIcon name="CheckCircle" className="inline mr-2" iconSize={16} />
                    Đã tham gia ({joinedVendors.length})
                </button>
                <button
                    onClick={() => setActiveTab('invited')}
                    className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all duration-200 ${activeTab === 'invited'
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <LucideIcon name="Clock" className="inline mr-2" iconSize={16} />
                    Đã mời ({invitedVendors.length})
                </button>
                <button
                    onClick={() => setActiveTab('available')}
                    className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all duration-200 ${activeTab === 'available'
                        ? 'border-gray-500 text-gray-600 bg-gray-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <LucideIcon name="UserPlus" className="inline mr-2" iconSize={16} />
                    Khả dụng ({availableVendors.length})
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'joined' && (
                    <div className="space-y-4">
                        {joinedVendors.length === 0
                            ? renderEmptyState('Chưa có vendor nào tham gia', 'User')
                            : joinedVendors.map(vendor => renderVendorCard(vendor))
                        }
                    </div>
                )}
                {activeTab === 'invited' && (
                    <div className="space-y-4">
                        {invitedVendors.length === 0
                            ? renderEmptyState('Chưa có vendor nào được mời', 'Mail')
                            : invitedVendors.map(vendor => renderVendorCard(vendor))
                        }
                    </div>
                )}
                {activeTab === 'available' && (
                    <div className="space-y-4">
                        {availableVendors.length === 0
                            ? renderEmptyState('Không có vendor nào khả dụng', 'X')
                            : availableVendors.map(vendor => renderVendorCard(vendor, true))
                        }
                    </div>
                )}
            </div>
        </div>
    );
} 