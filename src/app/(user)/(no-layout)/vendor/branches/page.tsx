import BranchList from "@pages/Vendor/Branches"

async function getBranches() {
    // TODO: Replace with actual API call
    return []
}

async function getServices() {
    // TODO: Replace with actual API call
    return []
}

export default async function VendorBranches() {
    const branches = await getBranches()
    const services = await getServices()

    return <BranchList branches={branches} services={services} />
}

