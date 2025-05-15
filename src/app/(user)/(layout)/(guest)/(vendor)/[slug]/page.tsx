import VendorOverviewPage from "@pages/Public/VendorDetail/Left/VendorOverview";
import vendorService from "@services/vendors";
import { notFound } from "next/navigation";

async function getVendorBySlug(slug: string) {
    try {
        return await vendorService.getVendorBySlug(slug);
    } catch (error) {
        console.log("Error fetching vendor by slug:", error);
    }
}

export default async function VendorOverview({ params }: { params: { slug: string } }) {
    const vendor = await getVendorBySlug(params?.slug) as any;
    if (!vendor) {
        return notFound();
    }

    return (
        <>
            <VendorOverviewPage />
        </>
    );
}