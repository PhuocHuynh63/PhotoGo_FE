import http from "@configs/fetch";
import { VOUCHER } from "@constants/voucher";

const voucherService = {
    getVoucher: async (
        userId: string,
        current: number = 1,
        pageSize: number = 6,
        term: string = "",
        from: string = "",
        status: string = VOUCHER.STATUS.AVAILABLE,
        sortBy: string = "maxPrice",
        sortDirection: string = "asc") => {
        return await http.get(`/vouchers/user/${userId}?status=${status}&term=${term}&from=${from}&sortBy=${sortBy}&sortDirection=${sortDirection}&current=${current}&pageSize=${pageSize}`, { next: { revalidate: 10 } })
    },
    getVoucherFromCampaign: async (userId: string, status = "hoạt động", sortBy = "maxPrice", sortDirection = "asc", current = 1, pageSize = 6) => {
        return await http.get(`/vouchers/user/${userId}/campaign?status=${status}&sortBy=${sortBy}&sortDirection=${sortDirection}&current=${current}&pageSize=${pageSize}`, { next: { revalidate: 10 } })
    }
}

export default voucherService;