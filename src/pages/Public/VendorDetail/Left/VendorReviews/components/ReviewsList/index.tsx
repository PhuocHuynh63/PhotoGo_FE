'use client';

import React, { useState } from 'react'
import { renderStars } from '@components/Atoms/Star';
import { Card, CardContent } from '@components/Atoms/ui/card'
import { Separator } from '@components/Atoms/ui/separator';
import { Avatar } from '@components/Molecules/Avatar';
import ReviewSkeleton from '@components/Molecules/ReviewSkeleton';
import { IReviewVendorDetailModel } from '@models/review/common.model';
import { formatDateAgo } from '@utils/helpers/Date';
import { Clock, MessageCircle } from 'lucide-react';
import "yet-another-react-lightbox/styles.css"
import Lightbox from 'yet-another-react-lightbox';


type ReviewsListProps = {
    activeTab?: string;
    reviewsToRender: any;
    isLoading?: boolean;
    isOverview?: boolean;
}

const ReviewsList = ({ activeTab, reviewsToRender, isLoading, isOverview }: ReviewsListProps) => {

    /**
     * If the active tab is not "reviews", we hide the reviews list on larger screens
     */
    const reviewsFromMember = reviewsToRender?.data as IReviewVendorDetailModel[];
    const reviewsToDisplay = isOverview
        ? reviewsFromMember?.slice(0, 1)
        : reviewsFromMember;
    //-----------------------------End---------------------------------//

    /**
     * Lightbox for images in reviews
     * We use a lightbox to display images when clicked
     */

    const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
    const [lightboxImages, setLightboxImages] = useState<{ src: string }[]>([])
    const handleImageClick = (images: string[], index: number) => {
        setLightboxImages(images?.map(img => ({ src: img })))
        setCurrentImageIndex(index)
        setLightboxOpen(true)
    }
    //-----------------------------End---------------------------------//

    /**
     * Rendor skeleton
     */
    const [showSkeleton, setShowSkeleton] = useState(true);
    if (isLoading || showSkeleton) {
        const skeletonCount = isOverview ? 1 : 3;
        return (
            <div className={`space-y-4 sm:space-y-6 ${activeTab !== "reviews" ? "hidden md:block" : ""}`}>
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <ReviewSkeleton key={index} delay={index * 150} setShowSkeleton={setShowSkeleton} />
                ))}
            </div>
        );
    }
    //----------------------End---------------------//

    return (
        <div className={`space-y-4 sm:space-y-6 ${activeTab !== "reviews" ? "hidden md:block" : ""}`}>
            {reviewsToDisplay?.length === 0 ? (
                <Card className="shadow-lg">
                    <CardContent className="p-6 sm:p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Không tìm thấy đánh giá nào</h3>
                        <p className="text-sm sm:text-base text-gray-600">Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc của bạn.</p>
                    </CardContent>
                </Card>
            ) : (
                reviewsToDisplay?.map((r) => (
                    <Card key={r.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                                <Avatar src={r.user.avatarUrl} alt={r.user.fullName} className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-100 mb-3 sm:mb-0" />

                                <div className="flex-1 space-y-2 sm:space-y-3">
                                    <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between">
                                        <div className="space-y-1 mb-2 xs:mb-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h5 className="font-semibold text-gray-900">{r.user?.fullName || "Ẩn danh"}</h5>
                                            </div>
                                            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                                                <div className="flex">{renderStars(r.rating)}</div>
                                                <Separator orientation="vertical" className="h-3 sm:h-4 hidden xs:inline-block" />
                                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {formatDateAgo(r.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{r.comment}</p>
                                    {r?.images && r.images?.length > 0 && (
                                        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                            {r?.images?.map((img: string, index: number) => (
                                                <div key={index} className="cursor-pointer aspect-square overflow-hidden rounded"
                                                    onClick={() => handleImageClick(r.images ?? [], index)}
                                                >
                                                    <img src={img} alt={`Review image ${index}`} className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
                ))}
            {/* Lightbox */}
            {lightboxImages.length > 0 && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={lightboxImages}
                    index={currentImageIndex}
                />
            )}
        </div>
    )
}

export default ReviewsList