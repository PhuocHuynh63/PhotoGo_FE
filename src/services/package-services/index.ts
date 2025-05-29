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
    }
}

export default packageService