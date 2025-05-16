import { IVendorResponse } from "@models/vendor/response.model";
import VendorOverviewPage from "@pages/Public/VendorDetail/Left/VendorOverview";
import vendorService from "@services/vendors";
import { notFound } from "next/navigation";


export default async function VendorOverview() {

    return (
        <>
            <VendorOverviewPage />
        </>
    );
}