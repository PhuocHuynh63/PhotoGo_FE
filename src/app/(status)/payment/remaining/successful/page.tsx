import { authOptions } from "@lib/authOptions";
import { METADATA } from "../../../../../types/IMetadata";
import { getServerSession } from "next-auth";
import RemainingSuccessPage from "@pages/Status/Remaining/Successful";


export default async function PaymentRemainingSuccess() {
    const session = await getServerSession(authOptions) as METADATA.ISession;

    return (
        <>
            <RemainingSuccessPage session={session} />
        </>
    )
}

