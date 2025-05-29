import ServicesPage from "@pages/Vendor/Services"
import packageService from "@services/package-services";
import { IServiceTypesResponse } from "@models/serviceTypes/repsonse.model";
import vendorService from "@services/vendors";
import { IBackendResponse } from "@models/backend/backendResponse.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";

async function getBranches() {
    // TODO: Replace with actual API call
    return []
}

async function getServices() {
    // TODO: Replace with actual API call
    return []
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

    const branches = await getBranches()
    const services = await getServices()
    const serviceTypes = await getServiceTypes()
    const vendor = await getVendorByUserId(session.user.id)
    return (
        <>
            <ServicesPage branches={branches} services={services} serviceTypes={serviceTypes?.data?.data ?? []} vendor={vendor?.data} />
        </>
    )
}

