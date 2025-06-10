import http from "@configs/fetch"

const locationAvailabilityService = {
    getLocationAvailabilityByLocationId: async (locationId: string) => {
        return await http.get(`/location-availability/location/${locationId}?isAvailable=true&current=1&pageSize=10&sortBy=createdAt&sortDirection=asc`)
    },
    createLocationAvailability: async (data: any, locationId: string) => {
        return await http.post(`/location-availability/${locationId}`, data)
    },
    getTimeSlotsByLocationAvailabilityId: async (locationAvailabilityId: string) => {
        return await http.get(`/location-availability/${locationAvailabilityId}/slot-time`)
    },
    createTimeSlots: async (data: any, locationAvailabilityId: string) => {
        return await http.post(`/location-availability/${locationAvailabilityId}/slot-time`, data)
    },
}

export default locationAvailabilityService