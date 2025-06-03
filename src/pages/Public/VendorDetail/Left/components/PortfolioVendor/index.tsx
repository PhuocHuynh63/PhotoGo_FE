'use client'

import { useServiceConceptImages, useAddMoreConceptImages, useVendor } from '@stores/vendor/selectors';
import { useState } from 'react';
import { IServiceConceptImageModel } from '@models/serviceConcepts/common.model';
import { Skeleton } from '@components/Atoms/ui/skeleton';
import vendorService from '@services/vendors';
import { IVendor } from '@models/vendor/common.model';
import { IServiceConceptImageResponseModel } from '@models/serviceConcepts/response.model';
import ClearButton from '@components/Atoms/ClearButton';

type PortfolioVendorProps = {
    isOverview?: boolean;
};

const PortfolioVendor = (
    {
        isOverview
    }: PortfolioVendorProps
) => {

    /**
     * Zustand store for service concept images and vendor
     */
    const images = useServiceConceptImages() as IServiceConceptImageModel[];
    const vendor = useVendor() as IVendor;
    const addMoreImages = useAddMoreConceptImages();
    //------------------------------End-----------------------------//

    /**
     * Handle loading more images
     */
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(2);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const loadMore = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const res = await vendorService.getConceptImgsByVendorId(vendor.id, currentPage.toString(), '10') as IServiceConceptImageResponseModel;
            const newImgs = res.data?.data || [] as IServiceConceptImageModel[];

            //#region Check if new images are empty
            const pagination = res.data?.pagination;
            if (pagination && currentPage >= pagination.totalPage) setHasMore(false);
            //#endregion

            addMoreImages(newImgs);
            setCurrentPage((prev) => prev + 1);
        } catch (e) {
            console.error('Failed to load more:', e);
        } finally {
            setIsLoading(false);
        }
    };
    //------------------------------End-----------------------------//

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
                    <ClearButton
                        onClick={loadMore}
                        disabled={isLoading}
                        className='w-3xs border-primary border-1 hover:bg-orange-100 hover:text-white text-primary font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isLoading ? 'Đang tải...' : 'Xem thêm'}
                    </ClearButton>
                </div>
            )}
        </>
    );
};

export default PortfolioVendor;
