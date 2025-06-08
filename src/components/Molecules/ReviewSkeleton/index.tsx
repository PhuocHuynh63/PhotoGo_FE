import { Card, CardContent } from '@components/Atoms/ui/card';
import { Skeleton } from '@components/Atoms/ui/skeleton';
import React, { useEffect, useState } from 'react'

type ReviewSkeletonProps = {
    isLoading?: boolean;
    delay?: number;
    setShowSkeleton: (show: boolean) => void;
}

const ReviewSkeleton = ({
    isLoading = false,
    delay = 0,
    setShowSkeleton
}: ReviewSkeletonProps) => {
    useEffect(() => {
        if (isLoading) {
            setShowSkeleton(true);
        } else {
            const timer = setTimeout(() => {
                setShowSkeleton(false);
            }, 650);

            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    if (!visible) return null;

    return (
        <Card className="shadow-lg">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                    {/* Avatar skeleton */}
                    <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-3 sm:mb-0 flex-shrink-0 bg-gray-200" />

                    <div className="flex-1 space-y-2 sm:space-y-3">
                        {/* Header skeleton */}
                        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between">
                            <div className="space-y-2 mb-2 xs:mb-0">
                                {/* Tên người dùng */}
                                <Skeleton className="h-[18px] w-[120px] bg-gray-200" />

                                {/* Rating và thời gian */}
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-[100px] bg-gray-200" />
                                    <Skeleton className="h-4 w-[80px] bg-gray-200" />
                                </div>
                            </div>
                        </div>

                        {/* Nội dung comment */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full bg-gray-200" />
                            <Skeleton className="h-4 w-[85%] bg-gray-200" />
                            <Skeleton className="h-4 w-[70%] bg-gray-200" />
                        </div>

                        {/* Hình ảnh skeleton */}
                        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            <Skeleton className="aspect-square rounded-md bg-gray-200" />
                            <Skeleton className="aspect-square rounded-md bg-gray-200" />
                            <Skeleton className="aspect-square rounded-md bg-gray-200" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReviewSkeleton