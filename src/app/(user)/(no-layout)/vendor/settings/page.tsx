import { authOptions } from "@lib/authOptions";
import { IVendorResponse } from "@models/vendor/response.model";
import WorkingHoursSettings from "@pages/Vendor/Settings";
import vendorService from "@services/vendors";
import { getServerSession } from "next-auth";

async function getVendorData(id: string) {
    const response = await vendorService.getVendorByUserId(id)
    return response;
}


export default async function VendorProfile() {

    const session = await getServerSession(authOptions) as METADATA.ISession;
    const vendor = await getVendorData(session.user.id) as IVendorResponse;
    return (
        <>
            <WorkingHoursSettings vendor={vendor?.data} />
        </>
    )
}

