enum VOUCHER_STATUS {
    ACTIVE = 'hoạt động',
    INACTIVE = 'không hoạt động',
    AVAILABLE = 'có sẵn',
    USED = 'đã sử dụng',
    EXPIRED = 'hết hạn',
}

enum VOUCHER_TYPE {
    POINT = 'điểm',
    EXCHANGE_POINTS = 'đổi điểm',
    CAMPAIGN = 'chiến dịch',
    WHEEL = 'vòng quay may mắn',
}

enum VOUCHER_DISCOUNT_TYPE {
    PERCENT = 'phần trăm',
    AMOUNT = 'cố định',
}

const VOUCHER_STATUS_MAP = {
    [VOUCHER_STATUS.AVAILABLE]: { name: 'Hoạt động', icon: 'CheckCircle' },
    [VOUCHER_STATUS.INACTIVE]: { name: 'Không hoạt động', icon: 'PauseCircle' },
    [VOUCHER_STATUS.EXPIRED]: { name: 'Hết hạn', icon: 'XCircle' },
};

const VOUCHER_TYPE_MAP = {
    [VOUCHER_TYPE.POINT]: { name: 'Điểm', icon: 'Star' },
    [VOUCHER_TYPE.CAMPAIGN]: { name: 'Chiến dịch', icon: 'Target' },
    [VOUCHER_TYPE.WHEEL]: { name: 'Vòng quay may mắn', icon: 'Wheel' },
};

const VOUCHER_DISCOUNT_TYPE_MAP = {
    [VOUCHER_DISCOUNT_TYPE.PERCENT]: { name: 'Phần trăm', icon: 'Percent' },
    [VOUCHER_DISCOUNT_TYPE.AMOUNT]: { name: 'Cố định', icon: 'DollarSign' },
};

export const VOUCHER = {
    STATUS: VOUCHER_STATUS,
    TYPE: VOUCHER_TYPE,
    DISCOUNT_TYPE: VOUCHER_DISCOUNT_TYPE,
    STATUS_MAP: VOUCHER_STATUS_MAP,
    TYPE_MAP: VOUCHER_TYPE_MAP,
    DISCOUNT_TYPE_MAP: VOUCHER_DISCOUNT_TYPE_MAP,
};