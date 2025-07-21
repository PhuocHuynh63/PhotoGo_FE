import { authOptions } from "@lib/authOptions";
import SubscriptionPage from "@pages/Public/Subcription";
import { METADATA } from "../../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";
import { USER } from "@constants/user";
import { redirect } from "next/navigation";
import { ROUTES } from "@routes";

export default async function SubscriptionVendor() {
    const session = await getServerSession(authOptions) as METADATA.ISession;

    const isVendorOwner = session?.user?.role?.id === USER.USER_ROLES_ID.VENDOR_OWNER ||
        session?.user?.role?.id === USER.USER_ROLES_ID.ADMIN ||
        session?.user?.role?.id === USER.USER_ROLES_ID.STAFF

    if (isVendorOwner) {
        return (
            <>
                <SubscriptionPage session={session} isMembership={false} />
            </>
        )
    }

    redirect(ROUTES.PUBLIC.SUBSCRIPTION.MEMBERSHIP)
}