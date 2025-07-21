import http from "@configs/fetch";

const albumVendorService = {
    uploadAlbum: async (albumId: string, formData: FormData) => {
        return await http.put(`/vendor-albums/album/${albumId}/upload`, formData)
    },

    getAlbumByLocation: async (locationId: string, date: string, current: number, pageSize: number, sortBy: string, sortDirection: string, albumStatus?: string) => {
        const baseUrl = `/vendor-albums/album/location/${locationId}?date=${date}&current=${current}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
        const url = albumStatus ? `${baseUrl}&albumStatus=${albumStatus}` : baseUrl
        return await http.get(url, {
            next: { revalidate: 10 }
        })
    },

    getAlbumByBookingId: async (bookingId: string) => {
        return await http.get(`/vendor-albums/album/booking/${bookingId}`, {
            next: { revalidate: 10 }
        })
    }
}

export default albumVendorService;
