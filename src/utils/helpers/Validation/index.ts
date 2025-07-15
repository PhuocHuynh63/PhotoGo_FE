import { SERVICE_CONCEPT } from "@constants/serviceConcept";

interface DateValidationResult {
    isValid: boolean;
    message: string;
}

interface TimeValidationResult {
    isValid: boolean;
    message: string;
}

/**
 * Validates if a date is provided
 */
export const validateDateRequired = (date: Date | undefined, fieldName: string): DateValidationResult => {
    if (!date) {
        return {
            isValid: false,
            message: `Vui lòng chọn ${fieldName}`
        };
    }
    return { isValid: true, message: "" };
};

/**
 * Validates that end date is after start date
 */
export const validateDateRange = (startDate: Date, endDate: Date): DateValidationResult => {
    if (endDate <= startDate) {
        return {
            isValid: false,
            message: "Ngày kết thúc phải sau ngày bắt đầu"
        };
    }
    return { isValid: true, message: "" };
};

/**
 * Validates that a date is not in the past
 */
export const validateDateNotPast = (date: Date, fieldName: string): DateValidationResult => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
        return {
            isValid: false,
            message: `${fieldName} không thể là ngày trong quá khứ`
        };
    }
    return { isValid: true, message: "" };
};

/**
 * Validates that end time is after start time
 */
export const validateTimeRange = (startTime: string, endTime: string): TimeValidationResult => {
    if (startTime >= endTime) {
        return {
            isValid: false,
            message: "Giờ kết thúc phải sau giờ bắt đầu"
        };
    }
    return { isValid: true, message: "" };
};

/**
 * Validates working date form data
 */
export const validateWorkingDateForm = (data: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    startTime: string;
    endTime: string;
    selectedLocation: string;
}): DateValidationResult => {
    const { startDate, endDate, startTime, endTime, selectedLocation } = data;

    // Validate start date
    const startDateValidation = validateDateRequired(startDate, "ngày bắt đầu");
    if (!startDateValidation.isValid) {
        return startDateValidation;
    }

    // Validate end date
    const endDateValidation = validateDateRequired(endDate, "ngày kết thúc");
    if (!endDateValidation.isValid) {
        return endDateValidation;
    }

    // From here we know both dates exist
    const validStartDate = startDate!;
    const validEndDate = endDate!;

    // Validate date range
    const dateRangeValidation = validateDateRange(validStartDate, validEndDate);
    if (!dateRangeValidation.isValid) {
        return dateRangeValidation;
    }

    // Validate start date not in past
    const startDatePastValidation = validateDateNotPast(validStartDate, "Ngày bắt đầu");
    if (!startDatePastValidation.isValid) {
        return startDatePastValidation;
    }

    // Validate end date not in past
    const endDatePastValidation = validateDateNotPast(validEndDate, "Ngày kết thúc");
    if (!endDatePastValidation.isValid) {
        return endDatePastValidation;
    }

    // Validate location
    if (!selectedLocation) {
        return {
            isValid: false,
            message: "Vui lòng chọn địa điểm"
        };
    }

    // Validate time range
    const timeValidation = validateTimeRange(startTime, endTime);
    if (!timeValidation.isValid) {
        return {
            isValid: false,
            message: timeValidation.message
        };
    }

    return { isValid: true, message: "" };
};

export const validateDuration = (duration: number, conceptRangeType: string): { isValid: boolean; message?: string; shouldSuggestMultiDay?: boolean } => {
    if (conceptRangeType === "một ngày") {
        if (duration < SERVICE_CONCEPT.DURATION_LIMIT_ONE_DAY.MIN_MINUTES) {
            return {
                isValid: false,
                message: `Thời gian tối thiểu phải là ${SERVICE_CONCEPT.DURATION_LIMIT_ONE_DAY.MIN_MINUTES} phút`
            };
        }
        if (duration > SERVICE_CONCEPT.DURATION_LIMIT_ONE_DAY.MAX_MINUTES) {
            return {
                isValid: false,
                message: `Thời gian tối đa cho một ngày là ${SERVICE_CONCEPT.DURATION_LIMIT_ONE_DAY.MAX_MINUTES} phút (${SERVICE_CONCEPT.DURATION_LIMIT_ONE_DAY.MAX_MINUTES / 60} giờ)`
            };
        }
        if (duration >= SERVICE_CONCEPT.DURATION_LIMIT_ONE_DAY.TOOLTIP_THRESHOLD) {
            return {
                isValid: false,
                message: `Thời gian vượt quá 24 giờ`,
                shouldSuggestMultiDay: true
            };
        }
    }
    return { isValid: true };
};

export const validateNumberOfDays = (numberOfDays: number): { isValid: boolean; message?: string } => {
    if (numberOfDays < SERVICE_CONCEPT.DURATION_LIMIT_MULTI_DAY.MIN_DAYS) {
        return {
            isValid: false,
            message: `Số ngày tối thiểu phải là ${SERVICE_CONCEPT.DURATION_LIMIT_MULTI_DAY.MIN_DAYS} ngày`
        };
    }
    if (numberOfDays > SERVICE_CONCEPT.DURATION_LIMIT_MULTI_DAY.MAX_DAYS) {
        return {
            isValid: false,
            message: `Số ngày tối đa là ${SERVICE_CONCEPT.DURATION_LIMIT_MULTI_DAY.MAX_DAYS} ngày`
        };
    }
    return { isValid: true };
};