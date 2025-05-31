// pages/VendorProfile.tsx
import ServicesPage from "@pages/Vendor/Services";
import packageService from "@services/packageServices";
import { IServiceTypesResponse } from "@models/serviceTypes/repsonse.model";
import vendorService from "@services/vendors";
import { IBackendResponse } from "@models/backend/backendResponse.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";

async function getBranches() {
    // TODO: Replace with actual API call
    return [];
}

async function getServices() {
    // TODO: Replace with actual API call
    return [];
}

async function getServiceTypes() {
    const response = await packageService.getServiceTypes() as IServiceTypesResponse;
    return response;
}

async function getVendorByUserId(userId: string) {
    const response = await vendorService.getVendorByUserId(userId) as IBackendResponse<any>;
    return response;
}

export default async function VendorProfile() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const serviceTypes = await getServiceTypes();
    const vendor = await getVendorByUserId(session.user.id);

    return (
        <>
            <ServicesPage
                serviceTypes={serviceTypes?.data?.data ?? []}
                vendor={vendor?.data}
                onGetVendorData={async () => {
                    "use server";
                    const response = await vendorService.getVendorByUserId(
                        session.user.id
                    ) as IBackendResponse<any>;
                    return response.data; // Trả về dữ liệu vendor mới
                }}
            />
        </>
    );
}