import { authOptions } from "@lib/authOptions";
import PromotionsPage from "@pages/Member/Profile/Right/PromotionContent"
import voucherService from "@services/voucher"
import { getServerSession } from "next-auth";

async function getPromotionFromPoint(userId: string) {
    const response = await voucherService.getVoucherFromPoint(userId);
    return response;
}

async function getPromotionFromCampaign(userId: string) {
    const response = await voucherService.getVoucherFromCampaign(userId);
    return response;
}

export default async function Vouchers() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const promotionFromPoint = await getPromotionFromPoint(session.user.id);
    const promotionFromCampaign = await getPromotionFromCampaign(session.user.id);
    console.log(promotionFromPoint);
    console.log(promotionFromCampaign);
    return (
        <>
            <PromotionsPage />
        </>
    )
}