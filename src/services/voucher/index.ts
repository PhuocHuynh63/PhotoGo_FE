import http from "@configs/fetch";

const voucherService = {
    getVoucherFromPoint: async (userId: string) => {
        return await http.get(`/vouchers/user/${userId}`)
    },
    getVoucherFromCampaign: async (userId: string) => {
        return await http.get(`/vouchers/user/${userId}/campaign`)
    }
}

export default voucherService;