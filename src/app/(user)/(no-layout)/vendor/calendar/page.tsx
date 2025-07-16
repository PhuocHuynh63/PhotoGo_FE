import { authOptions } from "@lib/authOptions";
import CalendarManagement from "@pages/Vendor/Calendar"
import { METADATA } from "../../../../../types/IMetadata";
import { getServerSession } from "next-auth";

export default async function VendorCalendar() {

    const session = await getServerSession(authOptions) as METADATA.ISession;


    return (
        <>
            <CalendarManagement session={session} />
        </>
    )
}

