import CampaignVouchers from "@pages/Public/CampaignVouchers";
import { authOptions } from "@lib/authOptions";
import { getServerSession } from "next-auth";
import { METADATA } from "../../../../../../types/IMetadata";
import { redirect } from "next/navigation";

export default async function PaymentError() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    if (!session?.user?.id) {
        return redirect("/login");
    }
    const userId = session.user.id;
    return (
        <>
            <CampaignVouchers userId={userId} />
        </>
    )
}

