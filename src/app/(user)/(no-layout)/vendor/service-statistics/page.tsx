import ServiceStats from "@pages/Vendor/ServiceStatistics"

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

    return <ServiceStats services={services} branches={branches} />
}

