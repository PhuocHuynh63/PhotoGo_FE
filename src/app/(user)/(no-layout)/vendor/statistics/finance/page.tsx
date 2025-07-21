import { authOptions } from "@lib/authOptions";
import FinancePage from "@pages/Vendor/Finances"
import { METADATA } from "../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";
import vendorService from "@services/vendors";
import { IVendorResponse } from "@models/vendor/response.model";

async function getVendorData(id: string) {
    const response = await vendorService.getVendorByUserId(id)
    return response;
}


export default async function VendorProfile() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const vendor = await getVendorData(session.user.id) as IVendorResponse;
    const vendorLocations = vendor.data?.locations
    return (
        <>
            <FinancePage locations={vendorLocations || []} />
        </>
    )
}

