import http from "@configs/fetch";

const vendorAlbumService = {
    getVendorAlbumByBookingId: async (bookingId: string) => {
        return await http.get(`/vendor-albums/album/booking/${bookingId}`,
            { cache: 'no-store' }
        );
    },
}

export default vendorAlbumService;