'use client';

import { renderStars } from '@components/Atoms/Star';
import { Card, CardContent } from '@components/Atoms/ui/card'
import { Separator } from '@components/Atoms/ui/separator';
import { Avatar } from '@components/Molecules/Avatar';
import ReviewSkeleton from '@components/Molecules/ReviewSkeleton';
import { IReviewVendorDetailModel } from '@models/review/common.model';
import { formatDateAgo } from '@utils/helpers/Date';
import { Clock, MessageCircle } from 'lucide-react';
import React, { useState } from 'react'

type ReviewsListProps = {
    activeTab: string;
    reviewsToRender: any;
    isLoading?: boolean;
}

const ReviewsList = ({ activeTab, reviewsToRender, isLoading }: ReviewsListProps) => {
    const [showSkeleton, setShowSkeleton] = useState(true);
    const reviewsFromMember = reviewsToRender?.data as IReviewVendorDetailModel[];

    if (isLoading || showSkeleton) {
        return (
            <div className={`space-y-4 sm:space-y-6 ${activeTab !== "reviews" ? "hidden md:block" : ""}`}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <ReviewSkeleton key={index} delay={index * 150} setShowSkeleton={setShowSkeleton} />
                ))}
            </div>
        );
    }

    return (
        <div className={`space-y-4 sm:space-y-6 ${activeTab !== "reviews" ? "hidden md:block" : ""}`}>
            {reviewsFromMember?.length === 0 ? (
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
                reviewsFromMember?.map((r) => (
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
                                                <div key={index} className="aspect-square overflow-hidden rounded">
                                                    <img src={img} alt={`Review image ${index}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )
}

export default ReviewsList