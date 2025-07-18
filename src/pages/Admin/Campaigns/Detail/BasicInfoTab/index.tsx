"use client";
import React, { useEffect, useState } from "react";
import { campaignService } from "@services/campaign";
import { Card } from "@components/Atoms/Card";
import { Badge } from "@components/Atoms/ui/badge";
import { Skeleton } from "@components/Atoms/ui/skeleton";
import { Label } from "@components/Atoms/ui/label";
import { Separator } from "@components/Atoms/ui/separator";
import LucideIcon from "@components/Atoms/LucideIcon";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@components/Atoms/ui/alert";
import { BadgeWrapper } from "@components/Atoms/Badge/BadgeWrapper";
import dynamic from "next/dynamic";

// Dynamically import TipTap editor with SSR disabled to avoid hydration errors
const TipTapEditor = dynamic(
  () => import("@components/Organisms/TipTapEditor"),
  { ssr: false }
);

interface Campaign {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status?: boolean | string;
    progress?: number;
    totalVoucher?: number;
    usedVoucher?: number;
    remainingVoucher?: number;
    createdAt?: string;
    updatedAt?: string;
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  } catch (e) {
    return dateString;
  }
};

const getStatusText = (status: boolean | string): "active" | "inactive" => {
  if (typeof status === "boolean") {
    return status ? "active" : "inactive";
  }
  // Convert string to valid badge value
  return status === "true" || status === "active" ? "active" : "inactive";
};

export default function BasicInfoTab({ campaignId }: { campaignId: string }) {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);
        campaignService.getCampaignById(campaignId)
            .then((res: any) => {
                if (!mounted) return;
                console.log("Campaign response:", res); 
                setCampaign(res?.data || null); 
            })
            .catch(() => {
                if (!mounted) return;
                setError("Không thể tải thông tin campaign");
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });
        return () => { mounted = false; };
    }, [campaignId]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Card>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-5 w-1/4" />
                        <div className="grid grid-cols-2 gap-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
    
    if (error) {
        return (
            <Alert variant="destructive">
                <LucideIcon name="AlertCircle" className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }
    
    if (!campaign) {
        return (
            <Alert>
                <LucideIcon name="Info" className="h-4 w-4" />
                <AlertTitle>Thông báo</AlertTitle>
                <AlertDescription>Không tìm thấy thông tin chiến dịch</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
                        <BadgeWrapper 
                            type="status" 
                            value={getStatusText(campaign.status || false)} 
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="campaign-name">Tên chiến dịch</Label>
                            <div id="campaign-name" className="border p-2.5 rounded-md bg-gray-50">
                                {campaign.name}
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="campaign-description">Mô tả</Label>
                            <div className="border rounded-md overflow-hidden">
                                <TipTapEditor 
                                    value={campaign.description || '<p>Không có mô tả</p>'}
                                    onChange={() => {}} 
                                    disabled={true}
                                    className="bg-gray-50"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="start-date">Ngày bắt đầu</Label>
                                <div id="start-date" className="border p-2.5 rounded-md bg-gray-50 flex items-center">
                                    <LucideIcon name="Calendar" className="mr-2 h-4 w-4 text-gray-500" />
                                    {formatDate(campaign.startDate)}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="end-date">Ngày kết thúc</Label>
                                <div id="end-date" className="border p-2.5 rounded-md bg-gray-50 flex items-center">
                                    <LucideIcon name="Calendar" className="mr-2 h-4 w-4 text-gray-500" />
                                    {formatDate(campaign.endDate)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            
            {/* Phần thông tin voucher đã được chuyển qua tab Voucher */}
            
            <Card>
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Thông tin khác</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {campaign.createdAt && (
                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">Ngày tạo</div>
                                <div className="flex items-center">
                                    <LucideIcon name="Clock" className="mr-2 h-4 w-4 text-gray-500" />
                                    {formatDate(campaign.createdAt)}
                                </div>
                            </div>
                        )}
                        
                        {campaign.updatedAt && (
                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">Cập nhật lần cuối</div>
                                <div className="flex items-center">
                                    <LucideIcon name="RefreshCcw" className="mr-2 h-4 w-4 text-gray-500" />
                                    {formatDate(campaign.updatedAt)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}