import packageService from "@services/packageServices";
import ServiceEditForm from "@pages/Vendor/Components/Services/ServiceEditFrom";
import { IServiceTypesResponse } from "@models/serviceTypes/response.model";

interface ServiceConceptImage {
    id: string;
    serviceConceptId: string;
    imageUrl: string;
    createdAt: string;
}

interface ServiceConcept {
    id: string;
    name: string;
    description: string;
    price: number;
    finalPrice: number;
    duration: number;
    serviceTypes?: { id: string }[];
    serviceConceptServiceTypes?: { serviceTypeId: string; serviceType?: { id: string; name: string; description: string } }[];
    images?: ServiceConceptImage[];
}

interface ServicePackage {
    id: string;
    name: string;
    description: string;
    status: string;
    image?: string;
    serviceConcepts: ServiceConcept[];
}

interface ApiResponse<T> {
    statusCode: number;
    data?: T;
    error?: string;
}

async function getService(id: string) {
    const response = await packageService.getPackageById(id) as ApiResponse<ServicePackage>;
    if (response.statusCode !== 200) {
        throw new Error("Không tìm thấy dịch vụ");
    }
    return response.data as ServicePackage;
}

async function getServiceTypes() {
    const response = await packageService.getServiceTypes() as IServiceTypesResponse;
    return response;
}

export default async function ServiceEditPage({
    params,
}: SERVERS.ServiceEditPageProps) {
    const { id } = await params;
    const service = await getService(id);
    const serviceTypes = await getServiceTypes();

    return (
        <div className="container mx-auto py-10">
            <ServiceEditForm initialService={service} serviceTypes={serviceTypes?.data?.data ?? []} />
        </div>
    );
}
