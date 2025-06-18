import http from "@configs/fetch"
import { IServicePackagesListResponse } from "@models/servicePackages/response.model"

const packageService = {
    getPackages: async () => {
        return await http.get("/service-packages/metadata", {
            next: { revalidate: 10 }
        })
    },

    getServiceTypes: async () => {
        return await http.get("/service-packages/service-type", {
            next: { revalidate: 10 }
        })
    },

    createPackage: async (data: FormData) => {
        return await http.post("/service-packages", data, {
            cache: 'no-store'
        })
    },

    createServiceConcept: async (data: FormData) => {
        return await http.post("/service-packages/service-concept", data, {
            cache: 'no-store'
        })
    },

    updatePackage: async (serviceId: string, data: FormData) => {
        return await http.patch(`/service-packages/${serviceId}`, data, {
            cache: 'no-store'
        })
    },

    updateServiceConcept: async (serviceId: string, data: FormData) => {
        return await http.patch(`/service-packages/service-concept/${serviceId}`, data, {
            cache: 'no-store'
        })
    },

    getPackageById: async (id: string) => {
        return await http.get(`/service-packages/${id}`,
            { next: { tags: [`service-package-${id}`] } }
        )
    },

    deletePackage: async (id: string) => {
        return await http.delete(`/service-packages/${id}`, {
            cache: 'no-store'
        })
    },

    getPackagesWithFilter: async (searchParams: URLSearchParams) => {
        return await http.get(`/service-packages/filter?${searchParams.toString()}&pageSize=6`, {
            next: { revalidate: 10 }
        })
    },

    deleteServiceConcept: async (id: string) => {
        return await http.delete(`/service-packages/service-concept/${id}`, {
            cache: 'no-store'
        })
    },

    getAllServicePackage: async (): Promise<IServicePackagesListResponse> => {
        return await http.get("/service-packages", {
            next: { revalidate: 10 }
        })
    }
}

export default packageService