'use client'

import { useServiceConceptImages, useAddMoreConceptImages, useVendor } from '@stores/vendor/selectors';
import { useState } from 'react';
import { IServiceConceptImageModel } from '@models/serviceConcepts/common.model';
import { Skeleton } from '@components/Atoms/ui/skeleton';
import vendorService from '@services/vendors';
import { IVendor } from '@models/vendor/common.model';
import { IServiceConceptImageResponseModel } from '@models/serviceConcepts/response.model';
import ClearButton from '@components/Atoms/ClearButton';
import Lightbox from 'yet-another-react-lightbox';
import "yet-another-react-lightbox/styles.css"

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

    // Only show 3 images in overview mode
    const displayedImages = isOverview ? images.slice(0, 3) : images;

    /**
     * Lightbox state and images
     * This will be used to show the lightbox when an image is clicked
     */
    const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const lightBoxImages = displayedImages.map((item: IServiceConceptImageModel) => ({
        src: item.image_url || '',
        alt: item.id || 'Portfolio Image',
    }));

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index)
        setLightboxOpen(true)
    }
    //----------------------------End-----------------------------//

    return (
        <>
            {displayedImages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    Đối tác này hiện chưa có hình ảnh nào trong danh mục của họ.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {displayedImages?.map((item: IServiceConceptImageModel, index: number) => (
                            <div key={item.id} className="relative group overflow-hidden rounded-lg">
                                {item.image_url ? (
                                    <img
                                        key={item.id}
                                        src={item.image_url}
                                        alt="Portfolio"
                                        className="w-full h-64 object-contain transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <Skeleton className="h-64 w-full" />
                                )}
                                <div className="cursor-pointer absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleImageClick(index)}
                                >
                                    {/* <h3 className="text-white font-semibold">{item?.title}</h3>
                            <p className="text-white/80 text-sm">{item?.category}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Only show "Xem thêm" button if not in overview mode */}
                    {!isOverview && hasMore && (
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
            )}

            {
                lightBoxImages.length > 0 && (
                    <Lightbox
                        open={lightboxOpen}
                        close={() => setLightboxOpen(false)}
                        slides={lightBoxImages}
                        index={currentImageIndex}
                    />
                )
            }
        </>
    );
};

export default PortfolioVendor;
