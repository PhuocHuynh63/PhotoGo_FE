// Time validation and processing utilities

export interface TimeValidationResult {
    isValid: boolean;
    message?: string;
    shouldSuggestMultiDay?: boolean;
}

export interface TimeComponents {
    hours: number;
    minutes: number;
    totalMinutes: number;
}

/**
 * Làm tròn phút về bội số của 10 gần nhất
 */
export const roundMinutesToStep = (minutes: number): number => {
    const rounded = Math.round(minutes / 10) * 10;
    return Math.max(0, Math.min(50, rounded));
};

/**
 * Chuyển đổi tổng phút thành giờ và phút
 */
export const convertMinutesToTime = (totalMinutes: number): TimeComponents => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = roundMinutesToStep(totalMinutes % 60);
    return {
        hours,
        minutes,
        totalMinutes
    };
};

/**
 * Chuyển đổi giờ và phút thành tổng phút
 */
export const convertTimeToMinutes = (hours: number, minutes: number): number => {
    return hours * 60 + minutes;
};

/**
 * Xử lý thay đổi giờ - auto set phút = 0 khi giờ = 23
 */
export const handleHoursChange = (newHours: number, currentTotalMinutes: number): number => {
    let currentMinutes = currentTotalMinutes % 60;
    
    // Nếu giờ = 23, set phút = 0
    if (newHours === 23) {
        currentMinutes = 0;
    }
    
    return convertTimeToMinutes(newHours, currentMinutes);
};

/**
 * Xử lý thay đổi phút - làm tròn về bội số của 10
 */
export const handleMinutesChange = (newMinutes: number, currentTotalMinutes: number): number => {
    const roundedMinutes = roundMinutesToStep(newMinutes);
    const currentHours = Math.floor(currentTotalMinutes / 60);
    
    return convertTimeToMinutes(currentHours, roundedMinutes);
};

/**
 * Kiểm tra xem input phút có nên bị disable không
 */
export const shouldDisableMinutes = (totalMinutes: number): boolean => {
    const hours = Math.floor(totalMinutes / 60);
    return hours === 23;
};

/**
 * Format thời gian để hiển thị
 */
export const formatTimeDisplay = (totalMinutes: number): string => {
    const { hours, minutes } = convertMinutesToTime(totalMinutes);
    return `${hours} giờ ${minutes} phút`;
};

/**
 * Lấy giá trị phút đã được làm tròn để hiển thị trong input
 */
export const getDisplayMinutes = (totalMinutes: number): number => {
    return roundMinutesToStep(totalMinutes % 60);
};

/**
 * Lấy giá trị giờ để hiển thị trong input
 */
export const getDisplayHours = (totalMinutes: number): number => {
    return Math.floor(totalMinutes / 60);
}; 