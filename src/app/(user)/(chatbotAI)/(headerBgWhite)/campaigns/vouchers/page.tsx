import CampaignVouchers from "@pages/Public/CampaignVouchers";
import { authOptions } from "@lib/authOptions";
import { getServerSession } from "next-auth";
import { METADATA } from "../../../../../../types/IMetadata";

export default async function PaymentError() {
    const session = await getServerSession(authOptions) as METADATA.ISession | null;
    const userId = session?.user?.id;
    return (
        <>
            <CampaignVouchers userId={userId} />
        </>
    )
}

