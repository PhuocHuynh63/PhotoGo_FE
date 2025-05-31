import http from "@configs/fetch"

const packageService = {
    getPackages: async () => {
        return await http.get("/service-packages/metadata", {
            next: { revalidate: 10 }
        })
    },

    getServiceTypes: async () => {
        return await http.get("/service-packages/service-type", {
            next: { revalidate: 10 }
        })
    },

    createPackage: async (data: FormData) => {
        return await http.post("/service-packages", data, {
            cache: 'no-store'
        })
    },

    createServiceConcept: async (data: FormData) => {
        return await http.post("/service-packages/service-concept", data, {
            cache: 'no-store'
        })
    },

    updatePackage: async (serviceId: string, data: FormData) => {
        return await http.patch(`/service-packages/${serviceId}`, data, {
            cache: 'no-store'
        })
    },

    updateServiceConcept: async (serviceId: string, data: FormData) => {
        return await http.patch(`/service-packages/service-concept/${serviceId}`, data, {
            cache: 'no-store'
        })
    },

    getPackageById: async (id: string) => {
        return await http.get(`/service-packages/${id}`)
    },

    deletePackage: async (id: string) => {
        return await http.delete(`/service-packages/${id}`, {
            cache: 'no-store'
        })
    }
}

export default packageService