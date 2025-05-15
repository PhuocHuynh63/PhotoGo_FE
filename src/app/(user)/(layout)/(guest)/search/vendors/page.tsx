import SearchVendorPage from "@pages/Public/Search/SearchVendor";
import { IVendorsResponse } from "@models/vendor/response.model";
import vendorService from "@services/vendors";
import categoryService from "@services/categories";
import { ICategoriesResponse } from "@models/category/response.model";


async function getVendors({ searchParams }: SERVERS.SearchVendorPageProps) {
    const resolvedParams = await searchParams;

    const queryParams = new URLSearchParams();

    if (resolvedParams.name) queryParams.append('name', resolvedParams.name as string);
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


async function getCategories() {
    const response = await categoryService.getCategories() as ICategoriesResponse;
    return response;
}
export default async function SearchVendorsPage({ searchParams }: SERVERS.SearchVendorPageProps) {
    const vendors = await getVendors({ searchParams });
    const categories = await getCategories();
    return (
        <>
            <SearchVendorPage vendors={vendors.data} categories={categories.data} />
        </>
    );
}