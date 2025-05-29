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
        return await http.post("/service-packages", data)
    }
}

export default packageService