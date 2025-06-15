
import { authOptions } from "@lib/authOptions";
import { IUser } from "@models/user/common.model";
import { IVendor } from "@models/vendor/common.model";
import { IVendorResponse } from "@models/vendor/response.model";
import VendorProfilePage from "@pages/Vendor/Profile"
import vendorService from "@services/vendors";
import { getServerSession } from "next-auth";

async function getVendorProfileByUserId(userId: string) {
    const vendorProfile = await vendorService.getVendorByUserId(userId)
    return vendorProfile;
}

export default async function VendorProfile() {

    const session = await getServerSession(authOptions) as METADATA.ISession;
    const vendorProfile = await getVendorProfileByUserId(session.user.id) as IVendorResponse
    const vendorData = vendorProfile?.data as IVendor
    return (
        <>
            <VendorProfilePage vendorData={vendorData} />
        </>
    )
}

