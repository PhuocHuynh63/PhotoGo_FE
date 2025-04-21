import SearchVendorLayout from "@components/Templates/SearchVendorLayout";
import { IVendor } from "@models/vendor/common.model";
import { IVendorsResponse } from "@models/vendor/response.model";
import vendorService from "@services/vendors";

async function fetchVendors() {
    return await vendorService.getVendors();

}

export default async function SearchVendor() {
    const response = await fetchVendors() as IVendorsResponse;
    console.log(response.data?.data)
    const vendorData = response.data?.data as IVendor[];
    return (
        <>
            <SearchVendorLayout vendorData={vendorData} />
        </>
    );
}
