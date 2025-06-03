import VendorDetailLayoutPage from "@components/Templates/VendorDetailLayout";
import { authOptions } from "@lib/authOptions";
import { IServiceConceptImageResponseModel } from "@models/serviceConcepts/response.model";
import { IVendorResponse } from "@models/vendor/response.model";
import vendorService from "@services/vendors";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function getVendorBySlug(slug: string) {
    return await vendorService.getVendorBySlug(slug);
}

async function getConceptImgsByVendorId(vendorId: string, current: string = '1', pageSize: string = '10') {
    return await vendorService.getConceptImgsByVendorId(vendorId, current, pageSize);
}

export default async function VendorDetailLayout({
    children,
    params
}: SERVERS.VendorDetailPageProps
) {
    const { slug } = await params;

    /**
     * Fetch vendor by slug
     */
    const vendor = await getVendorBySlug(slug) as IVendorResponse;
    console.log("vendor", vendor);

    if (vendor.statusCode !== 200 || !vendor.data) {
        return notFound();
    }
    //-----------------------End-----------------------------//


    const session = await getServerSession(authOptions) as METADATA.ISession;

    const concept = await getConceptImgsByVendorId(vendor.data.id, '1', '10') as IServiceConceptImageResponseModel

    return (
        <>
            <VendorDetailLayoutPage
                vendor={vendor.data}
                session={session}
                concept={concept}
            >
                {children}
            </VendorDetailLayoutPage>
        </>
    );
}
