import PromotionsPage from "@pages/Member/Profile/Right/PromotionContent"
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";

export default async function Vouchers() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    return (
        <>
            <PromotionsPage session={session} />
        </>
    )
}