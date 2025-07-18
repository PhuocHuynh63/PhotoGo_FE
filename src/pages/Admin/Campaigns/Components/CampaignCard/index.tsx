import { ICampaign } from '@models/campaign/common.model';
import { Card, CardContent } from '@components/Atoms/ui/card';
import { Badge } from '@components/Atoms/ui/badge';
import LucideIcon from '@components/Atoms/LucideIcon';
import { Button } from '@components/Atoms/Button/Button';
import { useRouter } from 'next/navigation';

interface CampaignCardProps {
    campaign: ICampaign;
    onEdit?: () => void;
}

const getStatusBadge = (status: boolean) => {
    if (status === true) {
        return (
            <Badge className="bg-green-100 text-green-800 border-green-200">
                <LucideIcon name="CheckCircle" className="mr-1" iconSize={12} />
                Hoạt động
            </Badge>
        );
    }
    if (status === false) {
        return (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <LucideIcon name="PauseCircle" className="mr-1" iconSize={12} />
                Không hoạt động
            </Badge>
        );
    }
    return null;
};

const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
};

export default function CampaignCard({ campaign }: CampaignCardProps) {
    const router = useRouter();
    if (!campaign) return null; // Tránh lỗi khi campaign bị undefined
    return (
        <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer relative">
            {/* Dấu chấm cam nếu đang diễn ra */}
            {campaign?.happened === 'Đang diễn ra' && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-orange-500 z-10"></span>
            )}
            <CardContent className="p-4 pb-3">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">{campaign.name}</h3>
                    </div>
                </div>
                {/* Mô tả */}
                <div className="text-gray-700 text-sm mb-2 line-clamp-2">{campaign.description}</div>
                {/* Ngày bắt đầu */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <LucideIcon name="Calendar" iconSize={14} />
                    <span>{formatDate(campaign.startDate)}</span>
                </div>
                {/* Tiến độ */}
                <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span>Tiến độ</span>
                        <span className="font-semibold text-blue-600">{Math.round(campaign.progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${campaign.progress}%` }} />
                    </div>
                </div>
                {/* Tổng/Đã dùng/Còn lại */}
                <div className="flex justify-between text-xs text-gray-700 mb-2">
                    <div className="flex flex-col items-center">
                        <span className="font-semibold">{campaign.totalVoucher.toLocaleString('vi-VN')}</span>
                        <span className="text-gray-500">Tổng</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-semibold">{campaign.usedVoucher.toLocaleString('vi-VN')}</span>
                        <span className="text-gray-500">Đã dùng</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-semibold">{campaign.remainingVoucher.toLocaleString('vi-VN')}</span>
                        <span className="text-gray-500">Còn lại</span>
                    </div>
                </div>
                <div className="border-t pt-2 mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Kết thúc: {formatDate(campaign.endDate)}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); router.push(`/admin/campaigns/${campaign.id}`); }}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        aria-label="Chỉnh sửa"
                    >
                        <LucideIcon name="Edit" iconSize={18} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 