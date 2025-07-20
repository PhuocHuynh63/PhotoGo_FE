"use client";
import React from "react";
import { Button } from "@components/Atoms/Button/Button";
import LucideIcon from "@components/Atoms/LucideIcon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/Atoms/ui/tabs";
import BasicInfoTab from "./BasicInfoTab";
import VoucherTab from "./VoucherTab";
import VendorTab from "./VendorTab";

export default function AdminCampaignDetailPage({ campaignId }: { campaignId: string }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-1 hover:text-gray-700 transition-colors duration-200"
                        >
                            <LucideIcon name="ArrowLeft" iconSize={16} />
                            Quay lại
                        </button>
                        <LucideIcon name="ChevronRight" iconSize={14} />
                        <span>Campaigns</span>
                        <LucideIcon name="ChevronRight" iconSize={14} />
                        <span className="text-gray-900 font-medium">Chi tiết</span>
                    </div>

                    {/* Main Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <LucideIcon name="Target" className="text-blue-600" iconSize={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Chi tiết Campaign</h1>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <LucideIcon name="Hash" iconSize={14} />
                                        <span className="font-mono text-sm">ID: {campaignId}</span>
                                    </div>
                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                    <div className="flex items-center gap-1">
                                        <LucideIcon name="Calendar" iconSize={14} />
                                        <span className="text-sm">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                

                {/* Tabs Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <Tabs defaultValue="info" className="w-full">
                        <div className="border-b border-gray-200 bg-gray-50">
                            <TabsList className="bg-transparent border-none p-0 h-auto">
                                <TabsTrigger
                                    value="info"
                                    className="flex items-center gap-2 px-6 py-4 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                                >
                                    <LucideIcon name="Info" iconSize={18} />
                                    Thông tin cơ bản
                                </TabsTrigger>
                                <TabsTrigger
                                    value="voucher"
                                    className="flex items-center gap-2 px-6 py-4 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                                >
                                    <LucideIcon name="Ticket" iconSize={18} />
                                    Gán Voucher
                                </TabsTrigger>
                                <TabsTrigger
                                    value="vendor"
                                    className="flex items-center gap-2 px-6 py-4 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                                >
                                    <LucideIcon name="Users" iconSize={18} />
                                    Mời Vendor
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-6">
                            <TabsContent value="info" className="mt-0">
                                <BasicInfoTab campaignId={campaignId} />
                            </TabsContent>
                            <TabsContent value="voucher" className="mt-0">
                                <VoucherTab campaignId={campaignId} />
                            </TabsContent>
                            <TabsContent value="vendor" className="mt-0">
                                <VendorTab campaignId={campaignId} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
} 