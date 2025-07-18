import { IVendorAlbumsByBookingIdResponse } from "@models/vendorAlbums/response.model";
import vendorAlbumService from "@services/vendorAlbum";
import { useCallback, useState } from "react";


export const useVendorAlbumsByBookingId = ({ bookingId }: { bookingId: string }) => {
    const [vendorAlbums, setVendorAlbums] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchVendorAlbumsByBookingId = useCallback(
        async () => {
            if (!bookingId) return;

            setLoading(true);
            setError(null);

            try {
                const response = await vendorAlbumService.getVendorAlbumByBookingId(
                    bookingId,
                ) as IVendorAlbumsByBookingIdResponse;

                setVendorAlbums(response.data || []);

            } catch (err) {
                console.error('Error fetching vendor albums:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }, [bookingId]
    );

    return {
        vendorAlbums,
        loading,
        error,
        fetchVendorAlbumsByBookingId,
    };
}