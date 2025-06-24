import { useState, useEffect } from 'react';
import vendorService from '@services/vendors';
import { IVendor } from '@models/vendor/common.model';
import { IVendorByIdResponse } from '@models/vendor/response.model';

export const useVendor = (vendorId: string | undefined) => {
    const [vendor, setVendor] = useState<IVendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        const fetchVendor = async () => {
            if (!vendorId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await vendorService.getVendorById(vendorId) as IVendorByIdResponse;
                setVendor(response.data || null);
                setError(null);
            } catch (err) {
                setError(err as Error);
                setVendor(null);
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [vendorId]);

    return { vendor, loading, error };
}; 