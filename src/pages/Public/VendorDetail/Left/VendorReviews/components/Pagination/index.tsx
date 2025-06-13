'use client'

import { Button } from '@components/Atoms/ui/button';
import { Card, CardContent } from '@components/Atoms/ui/card';
import { IPagination } from '@models/metadata';
import React from 'react'

type PaginationProps = {
    activeTab: string;
    pagination: {
        totalItems: IPagination,
        firstItemOnPage: number,
    };
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({ activeTab, pagination, currentPage, setCurrentPage }: PaginationProps) => {
    if (!pagination || !pagination.totalItems) return null;
    
    const { totalItems, firstItemOnPage } = pagination;

    const totalPages = totalItems?.totalPage;
    const totalItem = totalItems?.totalItem;
    const lastItemOnPage = Math.min(firstItemOnPage + totalItems?.pageSize - 1, totalItem);


    return (
        <>
            {totalPages > 1 && (
                <Card className={`shadow-lg ${activeTab !== "reviews" ? "hidden md:block" : ""}`}>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 xs:gap-2">
                            <div className="text-xs sm:text-sm text-gray-600 text-center xs:text-left">
                                Đang hiển thị {firstItemOnPage} đến {lastItemOnPage}  của {totalItem} đánh giá
                            </div>
                            <div className="flex items-center justify-center xs:justify-end space-x-1 sm:space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="cursor-pointer h-8 px-2 sm:px-3 text-xs sm:text-sm"
                                >
                                    Trước
                                </Button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    if (
                                        totalPages <= 5 ||
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                                className={`cursor-pointer h-8 w-8 p-0 text-xs sm:text-sm ${currentPage === page ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                                            >
                                                {page}
                                            </Button>
                                        );
                                    } else if (
                                        (page === currentPage - 2 && currentPage > 3) ||
                                        (page === currentPage + 2 && currentPage < totalPages - 2)
                                    ) {
                                        return (
                                            <span key={page} className="text-gray-500 px-1">
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="cursor-pointer h-8 px-2 sm:px-3 text-xs sm:text-sm"
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
};


export default Pagination