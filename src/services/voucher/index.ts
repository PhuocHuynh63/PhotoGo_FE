import http from "@configs/fetch";

const voucherService = {
    getVoucherFromPoint: async (userId: string, status = "hoạt động", sortBy = "maxPrice", sortDirection = "asc", current = 1, pageSize = 6) => {
        return await http.get(`/vouchers/user/${userId}?status=${status}&sortBy=${sortBy}&sortDirection=${sortDirection}&current=${current}&pageSize=${pageSize}`, { next: { revalidate: 10 } })
    },
    getVoucherFromCampaign: async (userId: string, status = "hoạt động", sortBy = "maxPrice", sortDirection = "asc", current = 1, pageSize = 6) => {
        return await http.get(`/vouchers/user/${userId}/campaign?status=${status}&sortBy=${sortBy}&sortDirection=${sortDirection}&current=${current}&pageSize=${pageSize}`, { next: { revalidate: 10 } })
    }
}

export default voucherService;