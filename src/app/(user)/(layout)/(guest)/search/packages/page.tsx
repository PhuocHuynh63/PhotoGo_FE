import { IServicePackagesListResponse } from "@models/servicePackages/response.model";
import SearchPackage from "@pages/Public/Search/SearchPackage";
import packageServices from "@services/packageServices";

async function getPackages({ searchParams }: SERVERS.SearchPackagePageProps) {
    const resolvedParams = await searchParams;

    const queryParams = new URLSearchParams();

    if (resolvedParams.name) queryParams.append('name', resolvedParams.name as string);
    if (resolvedParams.address) queryParams.append('location', resolvedParams.address as string);
    if (resolvedParams.minPrice) queryParams.append('minPrice', resolvedParams.minPrice as string);
    if (resolvedParams.maxPrice) queryParams.append('maxPrice', resolvedParams.maxPrice as string);
    if (resolvedParams.minRating) queryParams.append('minRating', resolvedParams.minRating as string);
    // if (resolvedParams.date) queryParams.append('date', resolvedParams.date as string);
    if (resolvedParams.current) queryParams.append('current', resolvedParams.current as string);
    if (resolvedParams.sortBy) queryParams.append('sortBy', resolvedParams.sortBy as string);
    if (resolvedParams.sortDirection) queryParams.append('sortDirection', resolvedParams.sortDirection as string);

    const response = await packageServices.getPackagesWithFilter(queryParams) as IServicePackagesListResponse;
    if (!response.data) {
        throw new Error('No data received')
    }
    return response.data;
}

export default async function SearchPackagePage({ searchParams }: SERVERS.SearchPackagePageProps) {
    const packagesData = await getPackages({ searchParams });
    console.log(packagesData)
    return (
        <>
            <SearchPackage packages={packagesData.data} pagination={packagesData.pagination} />
        </>
    );
}