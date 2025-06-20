import http from "@configs/fetch"
import { ILocationAvailabilityRequest, IUpdateAvailabilityRequest, IUpdateSlotTimeRequest } from "@models/locationAvailability/request.model"

const locationAvailabilityService = {
    getLocationAvailabilityByLocationId: async (locationId: string, isAvailable: boolean = true, current: number = 1, pageSize: number = 10, sortBy: string = 'createdAt', sortDirection = 'asc') => {
        return await http.get(`/location-availability/location/${locationId}?isAvailable=${isAvailable}&current=${current}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`)
    },
    getLocationAvailabilityByIdAndDate: async (locationId: string, date: string, isAvailable: boolean = true, current: number = 1, pageSize: number = 10, sortBy: string = 'createdAt', sortDirection = 'asc') => {
        return await http.get(`/location-availability/location/${locationId}/date?date=${date}&isAvailable=${isAvailable}&current=${current}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`)
    },
    createLocationAvailability: async (data: ILocationAvailabilityRequest, locationId: string) => {
        return await http.post(`/location-availability/${locationId}`, data)
    },
    deleteLocationAvailability: async (locationAvailabilityId: string) => {
        return await http.delete(`/location-availability/${locationAvailabilityId}`, {})
    },
    updateSlotTime: async (data: IUpdateSlotTimeRequest, workingDateId: string, slotTimeId: string) => {
        return await http.patch(`/location-availability/${workingDateId}/slot-time/${slotTimeId}`, data)
    },
    updateAvailability: async (data: IUpdateAvailabilityRequest, workingDateId: string) => {
        return await http.patch(`/location-availability/${workingDateId}/status`, data)
    }
}

export default locationAvailabilityService