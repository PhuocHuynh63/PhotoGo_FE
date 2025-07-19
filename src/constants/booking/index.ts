enum BOOKING_STATUS {
    NOT_PAID = 'chưa thanh toán',
    PAID = 'đã thanh toán',
    PENDING = 'chờ xác nhận',
    CONFIRMED = 'đã xác nhận',
    IN_PROGRESS = 'đang thực hiện',
    COMPLETED = 'đã hoàn thành',
    CANCELLED = 'đã hủy',
    CANCELLED_TIMEOUT = 'đã hủy - quá hạn thanh toán',
    CANCELLED_USER = 'đã hủy - người dùng tự hủy',
    CANCELLED_VENDOR = 'đã hủy - vendor từ chối',
}

export const BOOKING = {
    BOOKING_STATUS
}