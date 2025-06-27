import http from "@configs/fetch";

const locationService = {
    getAllLocations: async (current: number = 1, pageSize: number = 10, filterField: string = 'city', sortDirection = 'asc') => {
        return await http.get(`/locations/cities?current=${current}&pageSize=${pageSize}&sortDirection=${sortDirection}&filterField=${filterField}`);
    }
}

export default locationService;