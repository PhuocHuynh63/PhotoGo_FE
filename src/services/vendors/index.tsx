import http from "@configs/fetch"

const vendorService = {
    getVendorsWithFilter: async (searchParams: URLSearchParams) => {
        return await http.get(`/vendors/filter?${searchParams.toString()}`, {
            next: { revalidate: 10 }
        })
    },

    getVendors: async () => {
        return await http.get(`/vendors`, {
            next: { revalidate: 10 }
        })
    }
}

export default vendorService