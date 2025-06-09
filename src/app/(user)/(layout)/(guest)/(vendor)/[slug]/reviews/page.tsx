import { IReviewPaginationResponse } from "@models/review/repsonse.model";
import { IVendorResponse } from "@models/vendor/response.model";
import VendorReviewsPage from "@pages/Public/VendorDetail/Left/VendorReviews";
import reviewService from "@services/review";
import vendorService from "@services/vendors";

async function getVendorBySlug(slug: string) {
    return await vendorService.getVendorBySlug(slug);
}

async function getReviewByVendorId(vendorId: string) {
    return await reviewService.getReviewByVendorId(vendorId)
}

export default async function VendorDetailReviews({
    params
}: SERVERS.VendorDetailPageProps) {

    const { slug } = await params;
    const vendor = await getVendorBySlug(slug) as IVendorResponse;
    const review = await getReviewByVendorId(vendor.data?.id || '') as IReviewPaginationResponse

    return (
        <>
            <VendorReviewsPage review={review} vendor={vendor} />
        </>
    );
}