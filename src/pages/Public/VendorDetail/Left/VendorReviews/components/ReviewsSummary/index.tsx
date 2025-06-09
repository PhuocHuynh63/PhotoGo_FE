'use client'

import { renderStars } from '@components/Atoms/Star'
import { Card, CardContent } from '@components/Atoms/ui/card'
import { Star } from 'lucide-react';
import React from 'react'

type ReviewsSummaryProps = {
    activeTab: string;
    vendorData: {
        averageRating?: number;
    };
    summaryReviewSource: any;
    ratingCounts: number[];
}

const ReviewsSummary = ({
    activeTab,
    vendorData,
    summaryReviewSource,
    ratingCounts,
}: ReviewsSummaryProps) => {

    return (
        <Card
            className={`bg-primary-opacity border-0 shadow-lg ${activeTab !== "summary" && activeTab !== "reviews" ? "hidden md:block" : ""}`}
        >
            <CardContent className="p-4 pt-8 sm:p-6 md:py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="flex justify-center items-center text-center space-y-3 sm:space-y-4">
                        <div className="space-y-1 sm:space-y-2">
                            <div className="text-4xl sm:text-5xl font-bold text-gray-900">{vendorData?.averageRating?.toFixed(1) ?? 'N/A'}</div>
                            <div className="flex justify-center">
                                {renderStars(vendorData?.averageRating ?? 0, false, "w-5 h-5 sm:w-6 sm:h-6")}
                            </div>
                            <p className="text-sm sm:text-base text-gray-600">Dựa vào {summaryReviewSource?.length} đánh giá</p>
                        </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        {[5, 4, 3, 2, 1].map((stars, index) => {
                            const totalReviews = summaryReviewSource?.length || 0;
                            const count = ratingCounts?.[index] ?? 0;
                            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                            return (
                                <div key={stars} className="flex items-center space-x-2 sm:space-x-3">
                                    <span className="text-xs sm:text-sm font-medium w-6 sm:w-8">{stars}</span>
                                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-xs sm:text-sm text-gray-600 w-6 sm:w-8">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ReviewsSummary