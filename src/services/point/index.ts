import http from "@configs/fetch";
import { IAdjustPointRequest } from "@models/point/request.model";

export const pointService = {
    getPoint: async () => {
        const response = await http.get("/points/me");
        return response;
    },
    getPointTransaction: async () => {
        const response = await http.get("/points/me/transactions");
        return response;
    },
    getPointAdmin: async (searchParams: URLSearchParams) => {
        return await http.get(`/points?${searchParams.toString()}`, {
            next: { revalidate: 10 }
        })
    },
    getPointHistory: async (userId: string, searchParams: URLSearchParams) => {
        return await http.get(`/points/history/${userId}?${searchParams.toString()}`, {
            next: { revalidate: 10 }
        })
    },

    adjustPoint: async (request: IAdjustPointRequest) => {
        return await http.post("/points/change", request, {
            cache: "no-store",
        })
    }


}



