import { authOptions } from "@lib/authOptions";
import { IServicePackagesListResponse } from "@models/servicePackages/response.model";
import { IServiceTypeModel } from "@models/serviceTypes/common.model";
import { IServiceTypesResponse } from "@models/serviceTypes/response.model";
import SearchPackage from "@pages/Public/Search/SearchPackage";
import packageServices from "@services/packageServices";
import { METADATA } from "../../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";

async function getPackages({ searchParams, serviceTypes }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>, serviceTypes: IServiceTypeModel[] }) {
    const resolvedParams = await searchParams;

    const queryParams = new URLSearchParams();

    if (resolvedParams.q) queryParams.append('name', resolvedParams.q as string);
    if (resolvedParams.serviceType) {
        const names = (resolvedParams.serviceType as string).split(',');
        const ids = serviceTypes
            .filter(st => names.includes(st.name))
            .map(st => st.id);
        if (ids.length > 0) {
            ids.forEach(id => queryParams.append('serviceTypeIds', id));
        }
    }
    if (resolvedParams.minPrice) queryParams.append('minPrice', resolvedParams.minPrice as string);
    if (resolvedParams.maxPrice) queryParams.append('maxPrice', resolvedParams.maxPrice as string);
    // if (resolvedParams.minRating) queryParams.append('minRating', resolvedParams.minRating as string);
    if (resolvedParams.current) queryParams.append('current', resolvedParams.current as string);
    if (resolvedParams.sortBy) queryParams.append('sortBy', resolvedParams.sortBy as string);
    if (resolvedParams.sortDirection) queryParams.append('sortDirection', resolvedParams.sortDirection as string);

    const response = await packageServices.getPackagesWithFilter(queryParams) as IServicePackagesListResponse;
    if (!response.data) {
        throw new Error('No data received')
    }
    return response.data;
}

async function getServiceTypes() {
    const response = await packageServices.getServiceTypes() as IServiceTypesResponse;
    return response.data;
}

export default async function SearchPackagePage({ searchParams }: SERVERS.SearchPackagePageProps) {
    const session = await getServerSession(authOptions) as METADATA.ISession
    const serviceTypes = await getServiceTypes();
    const packagesData = await getPackages({ searchParams, serviceTypes: serviceTypes?.data || [] });
    return (
        <>
            <SearchPackage packages={packagesData.data} pagination={packagesData.pagination} serviceTypes={serviceTypes?.data} session={session} />
        </>
    );
}