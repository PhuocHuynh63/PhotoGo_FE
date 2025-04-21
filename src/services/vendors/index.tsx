import http from "@configs/fetch"

const vendorService = {
    getVendors: async (current: number = 1, pageSize: number = 10) => {
        return await http.get(`/vendors?current=${current}&pageSize=${pageSize}&status=ho%E1%BA%A1t%20%C4%91%E1%BB%99ng`, {
            next: { revalidate: 10 }
        })
    },

}

export default vendorService