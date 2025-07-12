import SearchVendorPage from "@pages/Public/Search/SearchVendor";

import vendorService from "@services/vendors";
import categoryService from "@services/categories";
import { ICategoriesResponse } from "@models/category/response.model";
import { IVendorsData } from "@models/vendor/response.model";
import { cookies } from "next/headers";
import locationService from "@services/locations";
import { IAllLocationResponse } from "@models/location/response.model";


async function getVendors({ searchParams }: SERVERS.SearchVendorPageProps) {
    const resolvedParams = await searchParams;

    const queryParams = new URLSearchParams();
    const sortBy = resolvedParams.sortBy ?? 'distance';
    const sortDirection = resolvedParams.sortDirection ?? 'asc';

    if (resolvedParams.name) queryParams.append('name', resolvedParams.name as string);
    if (resolvedParams.address) queryParams.append('location', resolvedParams.address as string);
    if (resolvedParams.minPrice) queryParams.append('minPrice', resolvedParams.minPrice as string);
    if (resolvedParams.maxPrice) queryParams.append('maxPrice', resolvedParams.maxPrice as string);
    if (resolvedParams.minRating) queryParams.append('minRating', resolvedParams.minRating as string);
    // if (resolvedParams.date) queryParams.append('date', resolvedParams.date as string);
    if (resolvedParams.current) queryParams.append('current', resolvedParams.current as string);
    if (resolvedParams.category) queryParams.append('category', resolvedParams.category as string);
    queryParams.append('sortBy', sortBy as string);
    queryParams.append('sortDirection', sortDirection as string);
    const userLocationCookie = (await cookies()).get("user_location")?.value;
    if (userLocationCookie) {
        try {
            const parsed = JSON.parse(userLocationCookie);
            if (parsed.lat) queryParams.append("userLatitude", parsed.lat.toString());
            if (parsed.lng) queryParams.append("userLongitude", parsed.lng.toString());
        } catch (err) {
            console.error("Invalid user_location cookie", err);
        }
    }

    const response = await vendorService.getVendorsWithFilter(queryParams) as any;
    return response;
}


async function getCategories() {
    const response = await categoryService.getCategories() as ICategoriesResponse;
    return response;
}

async function getLocations() {
    const response = await locationService.getAllLocations() as IAllLocationResponse;
    return response.data.data;
}

export default async function SearchVendorsPage({ searchParams }: SERVERS.SearchVendorPageProps) {
    const response = await getVendors({ searchParams })
    const vendorsData = response.data as IVendorsData;
    const categories = await getCategories();
    const locations = await getLocations();
    return (
        <>
            <SearchVendorPage vendors={vendorsData} categories={categories.data} locations={locations} />
        </>
    );
}