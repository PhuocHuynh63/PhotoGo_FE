import { ICreateCampaignModel } from "@models/campaign/request.model";
import http from "@configs/fetch";
import { IInviteVendorToCampaignModel } from "@models/campaign/request.model";

export const campaignService = {
    createCampaign: async (data: ICreateCampaignModel) => {
        return await http.post("/campaigns", data, {
            cache: "no-store",
        });
    },

    getCampaigns: async (searchParams: URLSearchParams) => {
        return await http.get(`/campaigns?${searchParams.toString()}`, {
            cache: "no-store",
        });
    },

    getCampaignById: async (campaignId: string) => {
        return await http.get(`/campaigns/${campaignId}`, {
            next: { revalidate: 10 },
        });
    },

    getVoucherOfCampaign: async (campaignId: string, searchParams: URLSearchParams) => {
        return await http.get(`/campaigns/${campaignId}/vouchers?${searchParams.toString()}&showAll=true`, {
            next: { revalidate: 10 },
        });
    },

    getVoucherAvailable: async () => {
        return await http.get(`/campaigns/available-vouchers`, {
            next: { revalidate: 10 },
        });
    },

    addVoucherToCampaign: async (campaignId: string, voucherId: string) => {
        return await http.post(`/campaigns/${campaignId}/vouchers/${voucherId}`, {}, {
            cache: "no-store",
        });
    },

    removeVoucherFromCampaign: async (campaignId: string, voucherId: string) => {
        return await http.delete(`/campaigns/${campaignId}/vouchers/${voucherId}`, {
            cache: "no-store",
        });
    },


    getVendorOfCampaign: async (campaignId: string, searchParams: URLSearchParams) => {
        return await http.get(`/campaigns/vendor/${campaignId}/invited?${searchParams.toString()}`, {
            next: { revalidate: 10 },
        });
    },

    inviteVendorToCampaign: async (data: IInviteVendorToCampaignModel) => {
        return await http.post(`/campaigns/invite-vendor`, data, {
            next: { revalidate: 10 },
        });
    },

    acceptCampaignInvite: async (token: string) => {
        return await http.get(`/campaigns/confirm-invite?token=${token}`, {
            next: { revalidate: 10 },
        });
    },

    getAllCampaignAndVoucher: async () => {
        return await http.get(`/campaigns/all`, {
            next: { revalidate: 10 },
        });
    },

    addUserToCampaign: async (campaignId: string, userId: string) => {
        return await http.post(`/campaigns/${campaignId}/users/${userId}`, {}, {
            next: { revalidate: 10 },
        });
    },

    getUserJoinedCampaigns: async (userId: string) => {
        return await http.get(`/campaigns/by-user/${userId}`, {
            next: { revalidate: 10 },
        });
    },
};
