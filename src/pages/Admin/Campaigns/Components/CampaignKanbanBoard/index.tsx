import { ICampaign } from '@models/campaign/common.model';
import { Card, CardContent, CardHeader, CardTitle } from '@components/Atoms/ui/card';
import { Badge } from '@components/Atoms/ui/badge';
import LucideIcon from '@components/Atoms/LucideIcon';
import CampaignCard from '../CampaignCard';

interface CampaignKanbanBoardProps {
    campaigns: ICampaign[];
    onCampaignUpdate?: () => void;
}

interface KanbanColumn {
    id: string;
    title: string;
    status: boolean;
    icon: string;
    color: string;
    bgColor: string;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
    {
        id: 'active',
        title: 'Hoạt động',
        status: true,
        icon: 'CheckCircle',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
    },
    {
        id: 'inactive',
        title: 'Không hoạt động',
        status: false,
        icon: 'PauseCircle',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
    },
];

export default function CampaignKanbanBoard({ campaigns, onCampaignUpdate }: CampaignKanbanBoardProps) {
    // Phân loại campaign theo status boolean
    const getCampaignsByStatus = (status: boolean) => {
        return campaigns?.filter(campaign => campaign.status === status);
    };

    // Đếm số lượng campaign trong mỗi cột
    const getCampaignCount = (status: boolean) => {
        return getCampaignsByStatus(status)?.length;
    };

    return (
        <div className="space-y-6">
            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {KANBAN_COLUMNS.map((column) => (
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
                                    {getCampaignCount(column.status)}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                {getCampaignsByStatus(column.status)?.map((campaign) => (
                                    <CampaignCard
                                        key={campaign.id}
                                        campaign={campaign}
                                        onEdit={() => alert('Chỉnh sửa campaign: ' + campaign.name)}
                                    />
                                ))}
                                {getCampaignsByStatus(column.status)?.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <LucideIcon name="Inbox" className="mx-auto mb-2" iconSize={24} />
                                        <p className="text-sm">Không có chiến dịch nào</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 