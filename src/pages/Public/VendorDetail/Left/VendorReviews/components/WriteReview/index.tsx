'use client'

import { renderStars } from '@components/Atoms/Star'
import { Button } from '@components/Atoms/ui/button'
import { Card, CardContent, CardHeader } from '@components/Atoms/ui/card'
import TipTapEditor from '@components/Organisms/TipTapEditor'
import { MessageCircle } from 'lucide-react'
import React, { useState } from 'react'

const WriteReview = () => {
    const [newReview, setNewReview] = useState<string>("");

    /**
     * Handler for rendering stars
     * @param {number} currentRating - The current rating value
     * @param {boolean} isEditable - Whether the stars are editable
     */
    const [currentRating, setCurrentRating] = useState<number>(0);
    const handleStarClick = (starIndex: number) => {
        setCurrentRating(starIndex);
    };
    //----------------------End----------------------//

    return (
        <Card className={`shadow-lg`}>
            <CardHeader className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Viết đánh giá
                </h3>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 sm:mb-3">Đánh giá sao</label>
                    <div className="flex space-x-1">
                        {renderStars(currentRating, true, "w-6 h-6 sm:w-8 sm:h-8", handleStarClick)}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 sm:mb-3">Nội dung đánh giá</label>
                    <TipTapEditor
                        value={newReview}
                        onChange={setNewReview}
                    />
                </div>
                <Button className="cursor-pointer w-full sm:w-auto text-white px-6 sm:px-8 py-2">
                    Gửi đánh giá
                </Button>
            </CardContent>
        </Card>
    )
}

export default WriteReview