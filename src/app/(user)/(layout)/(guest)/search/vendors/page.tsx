import SearchVendorPage from "@pages/Public/Search/SearchVendor";
import { IVendorsResponse } from "@models/vendor/response.model";
import vendorService from "@services/vendors";

async function getVendors(searchParams: { [key: string]: string | string[] | undefined }) {
    const params = await Promise.resolve(searchParams);

    const queryParams = new URLSearchParams();

    if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm as string);
    if (params.address) queryParams.append('location', params.address as string);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice as string);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice as string);
    if (params.minRating) queryParams.append('minRating', params.minRating as string);
    if (params.date) queryParams.append('date', params.date as string);

    const response = await vendorService.getVendorsWithFilter(queryParams) as IVendorsResponse;
    return response.data.data;
}

export default async function SearchVendor({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const vendors = await getVendors(searchParams);
    return (
        <>
            <SearchVendorPage vendors={vendors} />
        </>
    );
}