import { authOptions } from "@lib/authOptions"
import BranchList from "@pages/Vendor/Branches"
import vendorService from "@services/vendors"
import { METADATA } from "../../../../../types/IMetadata"
import { getServerSession } from "next-auth"
import { ILocation } from "@models/location/common.model"
import { IVendorResponse } from "@models/vendor/response.model"

async function getBranches(vendorId: string) {
    const response = await vendorService.getVendorByUserId(vendorId)
    return response
}

async function getServices() {
    // TODO: Replace with actual API call
    return []
}

export default async function VendorBranches() {
    const session = await getServerSession(authOptions) as METADATA.ISession;

    const branches = await getBranches(session.user.id) as IVendorResponse
    const branchesData = branches.data?.locations as ILocation[] ?? []
    const vendorId = branches.data?.id
    const services = await getServices()

    return <BranchList branches={branchesData} services={services} vendorId={vendorId} />
}

