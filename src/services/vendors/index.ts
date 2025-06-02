import http from "@configs/fetch"

const vendorService = {
    getVendorsWithFilter: async (searchParams: URLSearchParams) => {
        return await http.get(`/vendors/filter?${searchParams.toString()}&pageSize=6`, {
            next: { revalidate: 10 }
        })
    },

    getVendors: async () => {
        return await http.get(`/vendors`, {
            next: { revalidate: 10 }
        })
    },
    getVendorBySlug: async (slug: string) => {
        return await http.get(`/vendors/slug/${slug}`, {
            next: { revalidate: 10 }
        })
    },
    getVendorByUserId: async (userId: string) => {
        return await http.get(`/vendors/user/${userId}`, {
            next: { revalidate: 10 }
        })
    },

    getVendorById: async (id: string) => {
        return await http.get(`/vendors/${id}`, {
            next: { revalidate: 10 }
        })
    },

    getConceptImgsByVendorId: async (vendorId: string, current: string, pageSize: string) => {
        return await http.get(`/vendors/concept_image?vendor_id=${vendorId}&current=${current}&pageSize=${pageSize}`, {
            next: { tags: [`vendor-concept-images-${vendorId}`] }
        })
    }
}

export default vendorService