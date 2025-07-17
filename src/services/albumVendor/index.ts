import http from "@configs/fetch";

const albumVendorService = {
    uploadAlbum: async (formData: FormData) => {
        return await http.post("/vendor-albums/album/upload", formData)
    }
}

export default albumVendorService;
