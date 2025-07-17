import { ICreateCampaignModel } from "@models/campaign/request.model";
import http from "@configs/fetch";

export const campaignService = {
    createCampaign: async (data: ICreateCampaignModel) => {
        return await http.post("/campaigns", data, {
            cache: "no-store",
        });
    },

    getCampaigns: async (searchParams: URLSearchParams) => {
        return await http.get(`/campaigns?${searchParams.toString()}`, {
            cache: "no-store",
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache"
            }
        });
    },

    getVoucherOfCampaign: async (campaignId: string) => {
        return await http.get(`/campaigns/${campaignId}/vouchers`, {
            next: { revalidate: 10 },
        });
    },

    

   
    

};
