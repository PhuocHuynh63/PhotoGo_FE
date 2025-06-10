import { authOptions } from "@lib/authOptions";
import SettingPage from "@pages/Vendor/Settings";
import vendorService from "@services/vendors";
import { getServerSession } from "next-auth";

async function getVendorData(id: string) {
    const response = await vendorService.getVendorByUserId(id)
    return response;
}


export default async function VendorProfile() {

    const session = await getServerSession(authOptions) as METADATA.ISession;
    const vendor = await getVendorData(session.user.id);


    return (
        <>
            <SettingPage />
        </>
    )
}

