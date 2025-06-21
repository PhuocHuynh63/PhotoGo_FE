import { authOptions } from "@lib/authOptions";
import PromotionsPage from "@pages/Member/Profile/Right/PromotionContent"
import voucherService from "@services/voucher"
import { getServerSession } from "next-auth";
import { IVoucherResponseModel } from "@models/voucher/response.model";

async function getPromotionFromPoint(userId: string): Promise<IVoucherResponseModel> {
    const response = await voucherService.getVoucherFromPoint(userId) as IVoucherResponseModel;
    return response;
}

async function getPromotionFromCampaign(userId: string): Promise<IVoucherResponseModel> {
    const response = await voucherService.getVoucherFromCampaign(userId) as IVoucherResponseModel;
    return response;
}

export default async function Vouchers() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const promotionFromPoint = await getPromotionFromPoint(session.user.id);
    const vouchersFromPoint = Array.isArray(promotionFromPoint.data) ? promotionFromPoint.data.map(item => item.voucher) : [];
    const promotionFromCampaign = await getPromotionFromCampaign(session.user.id);
    const vouchersFromCampaign = Array.isArray(promotionFromCampaign.data) ? promotionFromCampaign.data.map(item => item.voucher) : [];
    
    return (
        <>
            <PromotionsPage promotionFromPoint={vouchersFromPoint} promotionFromCampaign={vouchersFromCampaign} />
        </>
    )
}