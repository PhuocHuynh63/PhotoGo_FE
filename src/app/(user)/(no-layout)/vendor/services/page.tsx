import ServicesPage from "@pages/Vendor/Services"
import packageService from "@services/package-services";
import { IServiceTypesResponse } from "@models/serviceTypes/repsonse.model";

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

export default async function VendorProfile() {
    const branches = await getBranches()
    const services = await getServices()
    const serviceTypes = await getServiceTypes()
    return (
        <>
            <ServicesPage branches={branches} services={services} serviceTypes={serviceTypes?.data?.data ?? []} />
        </>
    )
}

