import AdminCampaignDetailPage from "@pages/Admin/Campaigns/Detail";

export default async function Page({ params }: SERVERS.CampaignDetailPageProps) {
    const resolvedParams = await params;
    return <AdminCampaignDetailPage campaignId={resolvedParams.id} />;
} 