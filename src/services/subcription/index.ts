import http from "@configs/fetch"
import { ISubscriptionCreatePaymentLinkRequestModel, ISubscriptionPlanRequestModel, ISubscriptionSuccessRequestModel } from "@models/subcription_plan/request.model"
import { ROUTES } from "@routes"

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
        current?: number;
        pageSize?: number;
        sortBy?: string;
        sortDirection?: string;
    }) => {
        const queryParams = new URLSearchParams();
        if (params?.name) queryParams.append('name', params.name);
        if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
        if (params?.planType) queryParams.append('planType', params.planType);
        if (params?.current) queryParams.append('current', params.current.toString());
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);
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

    getSubscriptionHistoryByUserId: async (userId: string, params?: {
        current?: number;
        pageSize?: number;
        sortBy?: string;
        sortDirection?: string;
        action?: string;
    }) => {
        const queryParams = new URLSearchParams();
        if (params?.current) queryParams.append('current', params.current.toString());
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);
        if (params?.action) queryParams.append('action', params.action);
        const queryString = queryParams.toString();
        const url = queryString ? `/subscriptions/history/${userId}?${queryString}` : `/subscriptions/history/${userId}`;
        return await http.get(url, {
            cache: 'no-store'
        })
    },

    createPaymentLink: async (data: ISubscriptionCreatePaymentLinkRequestModel) => {
        return await http.post("/subscriptions/create-payment-link", data)
    },

    subscriptionSuccess: async (data: ISubscriptionSuccessRequestModel) => {
        return await http.post("/subscriptions/payos-callback", data)
    },
}
