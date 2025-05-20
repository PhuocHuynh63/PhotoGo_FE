import http from "@configs/fetch"

const packageService = {
    getPackages: async () => {
        return await http.get("/service-packages/metadata", {
            next: { revalidate: 10 }
        })
    },

}

export default packageService