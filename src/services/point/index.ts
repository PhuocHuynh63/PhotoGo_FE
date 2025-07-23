import http from "@configs/fetch";
import { IAdjustPointRequest } from "@models/point/request.model";

export const pointService = {
    getPoint: async () => {
        return await http.get("/points/me", {
            cache: 'no-store'
        });
    },
    getPointTransaction: async () => {
        return await http.get("/points/me/transactions", {
            cache: 'no-store'
        });
    },
    getPointAdmin: async (searchParams: URLSearchParams) => {
        return await http.get(`/points?${searchParams.toString()}`, {
            cache: 'no-store'
        })
    },
    getPointHistory: async (userId: string, searchParams: URLSearchParams) => {
        return await http.get(`/points/history/${userId}?${searchParams.toString()}`, {
            cache: 'no-store'
        })
    },

    adjustPoint: async (request: IAdjustPointRequest) => {
        return await http.post("/points/change", request, {
            cache: "no-store",
        })
    }
}



