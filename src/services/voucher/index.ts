import http from "@configs/fetch";
import { VOUCHER } from "@constants/voucher";
import { ICreateVoucher } from "@models/voucher/request.model";


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
    },
    createVoucher: async (data: ICreateVoucher) => {
        return await http.post('/vouchers', data);
    },

    editVoucher: async (id: string, data: ICreateVoucher) => {
        return await http.put(`/vouchers/${id}`, data);
    },

    getAdminVouchers: async (searchParams: URLSearchParams) => {
        return await http.get(`/vouchers?${searchParams.toString()}`, {
            cache: 'no-store'
        });
    },

    getAllVouchers: async (current: number = 1, pageSize: number = 10, type: string = "điểm", status: string = "hoạt động", sortBy: string = "maxPrice", sortDirection: string = "desc") => {
        return await http.get(`/vouchers?current=${current}&pageSize=${pageSize}&type=${type}&status=${status}&sortBy=${sortBy}&sortDirection=${sortDirection}`, { next: { revalidate: 10 } });
    },

    attachVoucher: async (voucherId: string, userId: string) => {
        return await http.post(`/vouchers/user/${userId}/exchange/${voucherId}`, {
            cache: 'no-store'
        });
    }
}

export default voucherService;