import { authOptions } from "@lib/authOptions";
import ChangePasswordPage from "@pages/Member/Profile/Right/ChangePasswordContent"
import { METADATA } from "../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";

export default async function ChangePassword() {

    const session = await getServerSession(authOptions) as METADATA.ISession;

    return (
        <>
            <ChangePasswordPage userId={session?.user?.id} />
        </>
    )
}

