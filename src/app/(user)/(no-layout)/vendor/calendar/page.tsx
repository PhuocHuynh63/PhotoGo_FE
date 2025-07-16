import { authOptions } from "@lib/authOptions";
import CalendarManagement from "@pages/Vendor/Calendar"
import { METADATA } from "../../../../../types/IMetadata";
import { getServerSession } from "next-auth";
import vendorService from "@services/vendors";
import { IVendorResponse } from "@models/vendor/response.model";

async function getVendorById(userId: string) {
    const vendor = await vendorService.getVendorByUserId(userId)
    return vendor
}

export default async function VendorCalendar() {

    const session = await getServerSession(authOptions) as METADATA.ISession;
    const vendor = await getVendorById(session.user.id) as IVendorResponse
    const vendorId = vendor?.data?.id
    return (
        <>
            <CalendarManagement vendorId={vendorId} />
        </>
    )
}

