import { Card, CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import packageService from "@services/packageServices";
import ServiceViewDetail from "@pages/Vendor/Components/Services/ServiceViewForm";

interface ServicePackage {
    id: string;
    name: string;
    description: string;
    status: string;
    image?: string;
    serviceConcepts: any[];
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

export default async function ServiceViewPage({ params }: SERVERS.ServiceViewPageProps) {
    const { id } = await params;
    const service = await getService(id);
    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Chi tiết dịch vụ: {service.name}</CardTitle>
                </CardHeader>
                <ServiceViewDetail service={service} />
            </Card>
        </div>
    );
}