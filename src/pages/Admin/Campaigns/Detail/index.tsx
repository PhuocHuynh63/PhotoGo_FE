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
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => window.history.back()} className="px-2 py-1">
                        <LucideIcon name="ArrowLeft" className="mr-1" iconSize={18} />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Chỉnh sửa Campaign</h1>
                        <div className="text-gray-500 text-base font-medium">ID: {campaignId}</div>
                    </div>
                </div>
               
            </div>
            {/* Tabs */}
            <Tabs defaultValue="info">
                <TabsList className="mb-4">
                    <TabsTrigger className="cursor-pointer" value="info">Thông tin cơ bản</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="voucher">Gán Voucher</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="vendor">Mời Vendor</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                    <BasicInfoTab campaignId={campaignId} />
                </TabsContent>
                <TabsContent value="voucher">
                    <VoucherTab campaignId={campaignId} />
                </TabsContent>
                <TabsContent value="vendor">
                    <VendorTab campaignId={campaignId} />
                </TabsContent>
            </Tabs>
        </div>
    );
} 