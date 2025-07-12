import VendorDetailLayoutPage from "@components/Templates/VendorDetailLayout";
import { authOptions } from "@lib/authOptions";
import { IReviewPaginationResponse } from "@models/review/repsonse.model";
import { IServiceConceptImageResponseModel } from "@models/serviceConcepts/response.model";
import { IVendorResponse } from "@models/vendor/response.model";
import locationAvailabilityService from "@services/locationAvailability";
import reviewService from "@services/review";
import vendorService from "@services/vendors";
import { METADATA } from "../../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function getVendorBySlug(slug: string) {
    return await vendorService.getVendorBySlug(slug);
}

async function getConceptImgsByVendorId(vendorId: string, current: string = '1', pageSize: string = '10') {
    return await vendorService.getConceptImgsByVendorId(vendorId, current, pageSize);
}

async function getReviewByVendorId(vendorId: string) {
    return await reviewService.getReviewByVendorId(vendorId)
}

async function getLocationAvailabilityByLocationId(locationId: string) {
    return await locationAvailabilityService.getLocationAvailabilityByLocationId(locationId);
}

export default async function VendorDetailLayout({
    children,
    params
}: SERVERS.VendorDetailLayoutProps
) {
    const { slug } = await params;

    /**
     * Fetch vendor by slug
     */
    const vendor = await getVendorBySlug(slug) as IVendorResponse;

    if (vendor.statusCode !== 200 || !vendor.data) {
        return notFound();
    }
    //-----------------------End-----------------------------//


    const session = await getServerSession(authOptions) as METADATA.ISession;
    const concept = await getConceptImgsByVendorId(vendor.data.id, '1', '10') as IServiceConceptImageResponseModel;
    const review = await getReviewByVendorId(vendor.data?.id || '') as IReviewPaginationResponse;

    return (
        <>
            <VendorDetailLayoutPage
                vendor={vendor.data}
                session={session}
                concept={concept}
                review={review}
            >
                {children}
            </VendorDetailLayoutPage>
        </>
    );
}
