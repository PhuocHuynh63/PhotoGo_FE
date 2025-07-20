'use client';

import { IVoucherModel } from "@models/voucher/common.model";
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card";
import { Badge } from "@components/Atoms/ui/badge";
import LucideIcon from "@components/Atoms/LucideIcon";
import { Button } from "@components/Atoms/Button/Button";
import { useState } from "react";
import VoucherCard from "../VoucherCard";
import EditVoucherDialog from "../EditVoucherDialog";

interface VoucherKanbanBoardProps {
    vouchers: IVoucherModel[];
    onVoucherUpdate: () => void;
}

interface KanbanColumn {
    id: string;
    title: string;
    status: string;
    icon: string;
    color: string;
    bgColor: string;
}

// Mapping status đúng với backend
const KANBAN_COLUMNS: KanbanColumn[] = [
    {
        id: 'active',
        title: 'Hoạt động',
        status: 'hoạt động',
        icon: 'CheckCircle',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200'
    },
    {
        id: 'inactive',
        title: 'Không hoạt động',
        status: 'không hoạt động',
        icon: 'PauseCircle',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200'
    },
    {
        id: 'expired',
        title: 'Hết hạn',
        status: 'hết hạn',
        icon: 'XCircle',
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200'
    }
];

// Hàm chuẩn hóa status
const normalizeStatus = (status: string | undefined | null) => (status || '').trim().toLowerCase();

export default function VoucherKanbanBoard({ vouchers, onVoucherUpdate }: VoucherKanbanBoardProps) {
    const [editingVoucher, setEditingVoucher] = useState<IVoucherModel | null>(null);

    // Debug: log status thực tế từ API
    if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log('Voucher status list:', vouchers?.map(v => v.status));
    }

    // Phân loại voucher theo trạng thái đúng với backend
    const getVouchersByStatus = (status: string) => {
        return vouchers?.filter(voucher => normalizeStatus(voucher?.status) === normalizeStatus(status)) || [];
    };

    // Đếm số lượng voucher trong mỗi cột
    const getVoucherCount = (status: string) => {
        return getVouchersByStatus(status)?.length || 0;
    };

    const handleEditVoucher = (voucher: IVoucherModel) => {
        setEditingVoucher(voucher);
    };

    const handleEditSuccess = () => {
        setEditingVoucher(null);
        onVoucherUpdate();
    };

    return (
        <div className="space-y-6">
            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {KANBAN_COLUMNS?.map((column) => (
                    <Card key={column.id} className={`${column.bgColor} border-2`}>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-lg">
                                <div className="flex items-center gap-2">
                                    <LucideIcon
                                        name={column.icon as any}
                                        className={column.color}
                                        iconSize={20}
                                    />
                                    <span className={column.color}>{column.title}</span>
                                </div>
                                <Badge variant="secondary" className="bg-white text-gray-700">
                                    {getVoucherCount(column.status)}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                {getVouchersByStatus(column.status)?.map((voucher) => (
                                    <VoucherCard
                                        key={voucher?.id}
                                        voucher={voucher}
                                        onEdit={() => handleEditVoucher(voucher)}
                                    />
                                ))}
                                {getVouchersByStatus(column.status).length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <LucideIcon name="Inbox" className="mx-auto mb-2" iconSize={24} />
                                        <p className="text-sm">Không có voucher nào</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
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