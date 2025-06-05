'use client'

import { SelectTrigger } from '@components/Atoms/Select/Select';
import { Button } from '@components/Atoms/ui/button';
import { Card, CardContent } from '@components/Atoms/ui/card';
import { Select, SelectContent, SelectItem, SelectValue } from '@components/Atoms/ui/select';
import React, { useState } from 'react'

type FiltersProps = {
    activeTab: string;
    selectSortBy: string | undefined;
    ratingFilter: string | undefined;
    setSelectSortBy: (value: string) => void;
    setRatingFilter: (value: string | undefined) => void;
}

const Filters = ({
    activeTab,
    selectSortBy,
    ratingFilter,
    setSelectSortBy,
    setRatingFilter,
}: FiltersProps) => {
    const [showFilters, setShowFilters] = useState<boolean>(false);

    return (
        <Card className={`shadow-lg ${activeTab !== "reviews" ? "hidden md:block" : ""}`}>
            <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Đánh giá</label>
                        <Select value={ratingFilter} onValueChange={setRatingFilter}>
                            <SelectTrigger className="cursor-pointer text-sm">
                                <SelectValue placeholder="Tất cả đánh giá" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả đánh giá</SelectItem>
                                <SelectItem value="5">5 sao</SelectItem>
                                <SelectItem value="4">4 sao</SelectItem>
                                <SelectItem value="3">3 sao</SelectItem>
                                <SelectItem value="2">2 sao</SelectItem>
                                <SelectItem value="1">1 sao</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Sắp xếp theo</label>
                        <Select value={selectSortBy} onValueChange={setSelectSortBy}>
                            <SelectTrigger className="cursor-pointer text-sm">
                                <SelectValue placeholder="Sắp xếp theo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest-first">Mới nhất</SelectItem>
                                <SelectItem value="oldest-first">Cũ nhất</SelectItem>
                                <SelectItem value="highest-rated">Đánh giá cao nhất</SelectItem>
                                <SelectItem value="lowest-rated">Đánh giá thấp nhất</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end xs:col-span-2 sm:col-span-1">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRatingFilter(undefined);
                                setSelectSortBy("newest-first");
                                // setCurrentPage(1);
                            }}
                            className="cursor-pointer w-full text-sm"
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Filters