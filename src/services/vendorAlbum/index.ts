import http from "@configs/fetch";

const vendorAlbumService = {
    getVendorAlbumByBookingId: async (bookingId: string) => {
        return await http.get(`/vendor-albums/album/booking/${bookingId}`,
            { next: { revalidate: 60 } }
        );
    },
}

export default vendorAlbumService;