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

export default async function VendorOverview({ params }: SERVERS.VendorOverviewPageProps) {
    const { slug } = await params;
    const vendor = await getVendorBySlug(slug) as any;
    console.log(vendor);


    if (!vendor) {
        return notFound();
    }

    return (
        <>
            <VendorOverviewPage />
        </>
    );
}