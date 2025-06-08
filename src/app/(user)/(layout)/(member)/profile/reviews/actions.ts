'use server'

import { IReviewPaginationResponse } from "@models/review/repsonse.model";
import reviewService from "@services/review";

export async function getReviewsAction(page: number = 1, pageSize: number = 2) {
    try {
        const userId = "5f0667d7-1d15-48df-bc32-0970bb26c840";
        
        const reviews = await reviewService.getReviewByUserId(
            userId, 
            page.toString(), 
            pageSize.toString(), 
            'created_at', 
            'desc'
        ) as IReviewPaginationResponse;
        
        return {
            success: true,
            data: reviews.data
        };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return {
            success: false,
            error: 'Failed to fetch reviews'
        };
    }
} 