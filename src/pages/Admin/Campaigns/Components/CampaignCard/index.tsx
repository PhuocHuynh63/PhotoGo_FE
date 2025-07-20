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
    if (!campaign) return null;
    
    // Tính toán màu sắc cho progress bar dựa trên tiến độ
    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'bg-red-500';
        if (progress >= 60) return 'bg-orange-500';
        if (progress >= 40) return 'bg-yellow-500';
        if (progress >= 20) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const progressColor = getProgressColor(campaign.progress);
    
    return (
        <Card className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
            {/* Dấu chấm cam nếu đang diễn ra */}
            {campaign?.happened === 'Đang diễn ra' && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-orange-500 z-10 animate-pulse"></span>
            )}
            
            <CardContent className="p-5 h-full flex flex-col">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{campaign.name}</h3>
                </div>
                
                {/* Ngày bắt đầu */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                        <LucideIcon name="Calendar" iconSize={14} className="text-blue-600" />
                    </div>
                    <span className="font-medium">{formatDate(campaign.startDate)}</span>
                </div>
                
                {/* Tiến độ */}
                <div className="mb-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">Tiến độ</span>
                        <span className="font-bold text-blue-600 text-lg">{Math.round(campaign.progress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${progressColor} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${campaign.progress}%` }}
                        />
                    </div>
                </div>
                
                {/* Tổng/Đã dùng/Còn lại */}
                <div className="grid grid-cols-3 gap-3 mb-5 flex-1">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="font-bold text-lg text-gray-900 mb-1 truncate">
                            {campaign.totalVoucher.toLocaleString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Tổng</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="font-bold text-lg text-blue-600 mb-1 truncate">
                            {campaign.usedVoucher.toLocaleString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Đã dùng</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="font-bold text-lg text-green-600 mb-1 truncate">
                            {campaign.remainingVoucher.toLocaleString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Còn lại</div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="border-t border-gray-100 pt-3 mt-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <LucideIcon name="Clock" iconSize={14} className="text-gray-400" />
                            <span className="font-medium">Kết thúc: {formatDate(campaign.endDate)}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                router.push(`/admin/campaigns/${campaign.id}`); 
                            }}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 hover:scale-110 transition-all duration-200 flex-shrink-0"
                            aria-label="Chỉnh sửa"
                        >
                            <LucideIcon name="Edit" iconSize={16} />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 