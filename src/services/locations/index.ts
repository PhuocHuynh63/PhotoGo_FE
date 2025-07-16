import http from "@configs/fetch";

const locationService = {
    getAllLocations: async (current: number = 1, pageSize: number = 10, filterField: string = 'city', sortDirection = 'asc') => {
        return await http.get(`/locations/cities?current=${current}&pageSize=${pageSize}&sortDirection=${sortDirection}&filterField=${filterField}`);
    },

    getLocationOverview: async (locationId: string, from: string, to: string) => {
        return await http.get(`/locations/${locationId}/location-overview?from=${from}&to=${to}`)
    },

    getOwnedLocationByVendorId: async (vendorId: string, status: string = 'hoạt động') => {
        return await http.get(`/locations/vendor/${vendorId}?status=${status}`)
    }
}

export default locationService;