enum VOUCHER_STATUS {
    AVAILABLE = 'có sẵn',
    USED = 'đã sử dụng',
    EXPIRED = 'hết hạn',
}

enum VOUCHER_TYPE {
    POINT = 'đổi điểm',
    CAMPAIGN = 'chiến dịch',
}

enum VOUCHER_DISCOUNT_TYPE {
    PERCENT = 'phần trăm',
    AMOUNT = 'số tiền',
}

export const VOUCHER = {
    STATUS: VOUCHER_STATUS,
    TYPE: VOUCHER_TYPE,
    DISCOUNT_TYPE: VOUCHER_DISCOUNT_TYPE,
};