import http from "@configs/fetch";

const vendorAlbumService = {
    getVendorAlbumByBookingId: async (bookingId: string) => {
        const res = await http.get(`/vendor-albums/album/booking/${bookingId}`,
            { next: { revalidate: 60 } }
        );

        console.log('res', res);
        return res;
    },
}

export default vendorAlbumService;