import { authOptions } from "@lib/authOptions";
import SubscriptionPage from "@pages/Public/Subcription";
import { METADATA } from "../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";

export default async function Subscription() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    return (
        <>
            <SubscriptionPage session={session} />
        </>
    )
}