import http from "@configs/fetch"
import { IServiceTypeRequest } from "@models/serviceTypes/request.model"

export const serviceTypeService = {
    getServiceTypesWithFilter: async (searchParams: URLSearchParams) => {
        return await http.get(`/service-packages/service-type/filter?${searchParams.toString()}`, {
            cache: 'no-store'
        })
    },

    createServiceType: async (data: IServiceTypeRequest) => {
        return await http.post("/service-packages/service-type", data, {
            cache: 'no-store'
        })
    },

    updateServiceType: async (id: string, data: IServiceTypeRequest) => {
        return await http.patch(`/service-packages/service-type/${id}`, data, {
            cache: 'no-store'
        })
    },

    toggleServiceType: async (id: string) => {
        return await http.patch(`/service-packages/service-type/${id}/toggle-status`, {
            cache: 'no-store'
        })
    },
}
