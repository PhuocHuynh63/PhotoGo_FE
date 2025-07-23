import { authOptions } from "@lib/authOptions";
import SubscriptionPage from "@pages/Public/Subcription";
import { METADATA } from "../../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";
import { USER } from "@constants/user";
import { redirect } from "next/navigation";
import { ROUTES } from "@routes";

export default async function SubscriptionMembership() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const isVendorOwner = session?.user?.role?.id === USER.USER_ROLES_ID.VENDOR_OWNER

    if (isVendorOwner) {
        redirect(ROUTES.PUBLIC.SUBSCRIPTION.VENDOR)
    }

    return (
        <>
            <SubscriptionPage isMembership={true} />
        </>
    )
}