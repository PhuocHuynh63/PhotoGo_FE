import SearchVendorPage from "@pages/Public/Search/SearchVendor";
import { IVendorsResponse } from "@models/vendor/response.model";
import vendorService from "@services/vendors";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getVendors({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;

    const queryParams = new URLSearchParams();

    if (resolvedParams.searchTerm) queryParams.append('searchTerm', resolvedParams.searchTerm as string);
    if (resolvedParams.address) queryParams.append('location', resolvedParams.address as string);
    if (resolvedParams.minPrice) queryParams.append('minPrice', resolvedParams.minPrice as string);
    if (resolvedParams.maxPrice) queryParams.append('maxPrice', resolvedParams.maxPrice as string);
    if (resolvedParams.minRating) queryParams.append('minRating', resolvedParams.minRating as string);
    if (resolvedParams.date) queryParams.append('date', resolvedParams.date as string);
    if (resolvedParams.current) queryParams.append('current', resolvedParams.current as string);
    if (resolvedParams.sortBy) queryParams.append('sortBy', resolvedParams.sortBy as string);
    if (resolvedParams.sortDirection) queryParams.append('sortDirection', resolvedParams.sortDirection as string);

    const response = await vendorService.getVendorsWithFilter(queryParams) as IVendorsResponse;
    return response;
}

export default async function SearchVendorsPage({ searchParams }: PageProps) {
    const vendors = await getVendors({ searchParams });
    return (
        <>
            <SearchVendorPage vendors={vendors.data} />
        </>
    );
}