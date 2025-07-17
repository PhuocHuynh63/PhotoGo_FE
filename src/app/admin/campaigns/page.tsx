import AdminCampaignsPage from "@pages/Admin/Campaigns";
import { campaignService } from "@services/campaign";

export const dynamic = 'force-dynamic';

async function getCampaigns({ searchParams }: { searchParams: any }) {
    const resolvedParams = await searchParams;
    const params: Record<string, any> = {};
    if (typeof resolvedParams.name === "string") params.name = resolvedParams.name;
    if (typeof resolvedParams.status === "string") params.status = resolvedParams.status;
    if (typeof resolvedParams.startDate === "string") params.startDate = resolvedParams.startDate;
    if (typeof resolvedParams.endDate === "string") params.endDate = resolvedParams.endDate;
    if (typeof resolvedParams.current === "string") params.current = Number(resolvedParams.current);
    if (typeof resolvedParams.pageSize === "string") params.pageSize = Number(resolvedParams.pageSize);
    if (!params.pageSize) params.pageSize = 10;
    if (typeof resolvedParams.sortBy === "string") params.sortBy = resolvedParams.sortBy;
    if (typeof resolvedParams.sortDirection === "string") params.sortDirection = resolvedParams.sortDirection as "asc" | "desc";
    if (typeof resolvedParams.showAll === "string") params.showAll = resolvedParams.showAll;

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") urlParams.set(key, String(value));
    });

    try {
        const res = await campaignService.getCampaigns(urlParams) as any;
        const campaigns = res?.data?.data || [];
        const rawPagination = res?.data?.pagination || {
            current: 1,
            pageSize: 10,
            totalItem: 0,
            totalPage: 1
        };
        const pagination = {
            ...rawPagination,
            totalPage: rawPagination.totalPage || Math.ceil(rawPagination.totalItem / rawPagination.pageSize) || 1,
            current: rawPagination.current || 1,
            pageSize: rawPagination.pageSize || 10,
            totalItem: rawPagination.totalItem || 0
        };
        return { campaigns, pagination };
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return {
            campaigns: [],
            pagination: {
                current: 1,
                pageSize: 10,
                totalItem: 0,
                totalPage: 1
            }
        };
    }
}

export default async function Page({ searchParams }: { searchParams?: any }) {
    const { campaigns, pagination } = await getCampaigns({ searchParams });
    return <AdminCampaignsPage campaigns={campaigns || []} pagination={pagination} />;
}
