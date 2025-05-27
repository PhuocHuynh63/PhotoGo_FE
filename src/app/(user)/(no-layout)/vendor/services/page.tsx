import ServicesPage from "@pages/Vendor/Services"

async function getBranches() {
    // TODO: Replace with actual API call
    return []
}

async function getServices() {
    // TODO: Replace with actual API call
    return []
}

async function getCategories() {
    // TODO: Replace with actual API call
    return []
}

export default async function VendorProfile() {
    const branches = await getBranches()
    const services = await getServices()
    const categories = await getCategories()
    return (
        <>
            <ServicesPage branches={branches} services={services} categories={categories} />
        </>
    )
}

