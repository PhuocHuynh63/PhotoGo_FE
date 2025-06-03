'use client'

import { useServiceConceptImages, useAddMoreConceptImages } from '@stores/vendor/selectors';
import { useState } from 'react';
import { IServiceConceptImageModel } from '@models/serviceConcepts/common.model';
import { Skeleton } from '@components/Atoms/ui/skeleton';
import vendorService from '@services/vendors';

const PortfolioVendor = ({ vendorId }: { vendorId: string }) => {
    const images = useServiceConceptImages();
    console.log('PortfolioVendor images:', images);

    const addMoreImages = useAddMoreConceptImages();

    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(10); // Bắt đầu từ sau 10 ảnh preload
    const [hasMore, setHasMore] = useState(true);

    const loadMore = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const res = await vendorService.getConceptImgsByVendorId(vendorId, offset.toString(), '10');
            const newImgs = res.data?.data || [];

            if (newImgs.length < 10) setHasMore(false);

            addMoreImages(newImgs);
            setOffset((prev) => prev + 10);
        } catch (e) {
            console.error('Failed to load more:', e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((item: IServiceConceptImageModel) => (
                    <div key={item.id} className="group overflow-hidden rounded-lg">
                        {item.image_url ? (
                            <img
                                src={item.image_url}
                                alt="Portfolio"
                                className="w-full h-64 object-contain transition-transform group-hover:scale-105"
                            />
                        ) : (
                            <Skeleton className="h-64 w-full" />
                        )}
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="text-center mt-6">
                    <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {isLoading ? 'Đang tải...' : 'Xem thêm'}
                    </button>
                </div>
            )}
        </>
    );
};

export default PortfolioVendor;
