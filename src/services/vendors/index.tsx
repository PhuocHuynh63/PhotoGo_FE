import http from "@configs/fetch"

const vendorService = {
    getVendors: async () => {
        return await http.get("/vendors?current=1&pageSize=10&status=ho%E1%BA%A1t%20%C4%91%E1%BB%99ng", {
            next: { revalidate: 10 }
        })
    },

}

export default vendorService