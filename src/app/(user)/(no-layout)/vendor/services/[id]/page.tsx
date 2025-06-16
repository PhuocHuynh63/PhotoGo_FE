import packageService from "@services/packageServices";
import ServiceViewDetail from "@pages/Vendor/Components/Services/ServiceViewForm";
import type { ServiceConcept } from "@pages/Vendor/Components/Services/ServiceViewForm";

interface ApiResponse<T> {
    statusCode: number;
    data?: T;
    error?: string;
}

interface ServicePackage {
    id: string;
    name: string;
    description: string;
    status: string;
    image?: string;
    serviceConcepts: ServiceConcept[];
}

async function getService(id: string) {
    const response = await packageService.getPackageById(id) as ApiResponse<ServicePackage>;
    if (response.statusCode !== 200) {
        throw new Error("Không tìm thấy dịch vụ");
    }
    return response.data as ServicePackage;
}

export default async function ServiceViewPage({ params }: SERVERS.ServiceViewPageProps) {
    const { id } = await params;
    const service = await getService(id);
    return (
        <div>
            <ServiceViewDetail service={service} />
        </div>
    );
}