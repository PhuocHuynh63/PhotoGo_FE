import { authOptions } from "@lib/authOptions";
import PaymentSuccessPage from "@pages/Status/Payment/Successful";
import { METADATA } from "../../../../types/IMetadata";
import { getServerSession } from "next-auth";


export default async function PaymentSuccess() {
    const session = await getServerSession(authOptions) as METADATA.ISession;

    return (
        <>
            <PaymentSuccessPage session={session} />
        </>
    )
}

