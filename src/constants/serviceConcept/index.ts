enum DATE_RANGE_TYPE {
    ONE_DAY = 'một ngày',
    MANY_DAYS = 'nhiều ngày',
}

enum ONE_DAY {
    MIN_MINUTES = 30,
    MAX_MINUTES = 23 * 60, // 23 hours = 1380 minutes
    TOOLTIP_THRESHOLD = 24 * 60, // 24 hours = 1440 minutes
}

enum MULTI_DAY {
    MIN_DAYS = 2,
    MAX_DAYS = 10,
}


export const SERVICE_CONCEPT = {
    CONCEPT_RANGE_TYPE: DATE_RANGE_TYPE,
    DURATION_LIMIT_ONE_DAY: ONE_DAY,
    DURATION_LIMIT_MULTI_DAY: MULTI_DAY,
};