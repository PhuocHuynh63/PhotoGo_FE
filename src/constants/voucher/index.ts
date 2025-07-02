enum VOUCHER_STATUS {
    AVAILABLE = 'có sẵn',
    USED = 'đã sử dụng',
    EXPIRED = 'hết hạn',
}

enum VOUCHER_TYPE {
    POINT = 'đổi điểm',
    CAMPAIGN = 'chiến dịch',
}

export const VOUCHER = {
    STATUS: VOUCHER_STATUS,
    TYPE: VOUCHER_TYPE,
};