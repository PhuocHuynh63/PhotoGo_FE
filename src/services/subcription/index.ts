import http from "@configs/fetch"
import { ISubscriptionCreatePaymentLinkRequestModel, ISubscriptionPlanRequestModel } from "@models/subcription/request.model"

export const subscriptionService = {
    createSubscriptionPlan: async (data: ISubscriptionPlanRequestModel) => {
        return await http.post("/subscription-plans", data, {
            cache: 'no-store'
        })
    },

    updateSubscriptionPlan: async (id: string, data: ISubscriptionPlanRequestModel) => {
        return await http.patch(`/subscription-plans/${id}`, data, {
            cache: 'no-store'
        })
    },

    getSubscriptionPlans: async (params?: {
        name?: string;
        isActive?: boolean;
        planType?: string;
    }) => {
        const queryParams = new URLSearchParams();
        if (params?.name) queryParams.append('name', params.name);
        if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
        if (params?.planType) queryParams.append('planType', params.planType);
        
        const queryString = queryParams.toString();
        const url = queryString ? `/subscription-plans?${queryString}` : '/subscription-plans';
        
        return await http.get(url, {
            cache: 'no-store'
        })
    },

    getSubscriptionPlanById: async (id: string) => {
        return await http.get(`/subscription-plans/${id}`, {
            cache: 'no-store'
        })
    },

    createPaymentLink: async (data: ISubscriptionCreatePaymentLinkRequestModel) => {
        return await http.post("/subscriptions/create-payment-link", data)
    }
}
