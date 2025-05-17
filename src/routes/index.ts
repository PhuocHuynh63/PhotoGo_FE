const AUTH = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    UNAUTHORIZED: '/auth/unauthorized',
    LOGOUT: '/logout',
};

const PUBLIC = {
    HOME: '/',
    CONTACT: '/contact',
    SEARCH_VENDORS: '/search/vendors',
    SEARCH_PACKAGES: '/search/packages',
    VENDOR_DETAIL: '/:slug/:page',
    ABOUT: '/about',
};

const USER = {
    DASHBOARD: '/user',
    PROFILE:
        '/profile'
    ,
    BOOKINGS: {

    },
    CART: {

    },
    WISHLIST: {

    },
    WALLET: {

    },
    LOYALTY: {

    },
    PROMOTION: {

    },
    REVIEWS: {

    },
    SUPPORT: {

    },
};

const VENDOR = {
    DASHBOARD: '/vendor/dashboard',
    PROFILE: {
        INFO: '/vendor/profile/information',
        LOCATIONS: '/vendor/profile/locations',
        TEAM: '/vendor/profile/team',
        PORTFOLIO: '/vendor/profile/portfolio',
    },
    SERVICE_PACKAGES: {
        LIST: '/vendor/service-packages/list',
    },
    AVAILABILITY: {
        SCHEDULE: '/vendor/availability/schedule',
        BLACKOUTS: '/vendor/availability/blackouts',
    },
    BOOKINGS: {
        CALENDAR: '/vendor/bookings/calendar',
        REQUESTS: '/vendor/bookings/requests',
    },
    FINANCE: {
        WALLET: '/vendor/finance/wallet',
        TRANSACTIONS: '/vendor/finance/transactions',
        PAYOUTS: '/vendor/finance/payouts',
    },
    SUBSCRIPTION: {
        CURRENT_PLAN: '/vendor/subscription/current',
        UPGRADE: '/vendor/subscription/upgrade',
        BILLING_HISTORY: '/vendor/subscription/history',
    },
    REVIEWS: {
        LIST: '/vendor/reviews',
    },
    PROMOTION: {
        FEATURED_LISTINGS: '/vendor/promotion/featured',
        APPLY_SEASONAL: '/vendor/promotion/seasonal',
        VOUCHERS: '/vendor/promotion/vouchers',
    },
    SUPPORT: {
        MY_TICKETS: '/vendor/support/history',
        FAQ: '/vendor/support/faq',
    },
};

const ADMIN = {
    DASHBOARD: '/admin/dashboard',
    USER_MANAGEMENT: {
        CUSTOMER_LIST: '/admin/user-management/customer-list',
        STAFF_LIST: '/admin/user-management/staff-list'
    },
    VENDOR_MANAGEMENT: {
        LIST: '/admin/vendor-management/list',
    },
    SERVICE_PACKAGE_MANAGEMENT: {
        LIST: '/admin/service-package-management/list',
        APPROVAL: '/admin/service-package-management/approval',
        CONCEPTS: '/admin/service-package-management/concepts',
        STYLE_TAGS: '/admin/service-package-management/style-tags',
        VENDOR_CATEGORIES: '/admin/service-package-management/vendor-categories'
    },
    BOOKING_MANAGEMENT: {
        LIST: '/admin/booking-management/list',
        DISPUTES: '/admin/booking-management/disputes',
    },
    FINANCE: {
        OVERVIEW: '/admin/finance/overview',
        TRANSACTIONS: '/admin/finance/transactions',
        VENDOR_PAYMENTS: '/admin/finance/vendor-payments',
        REFUNDS: '/admin/finance/refunds',
        WALLET: '/admin/finance/wallet',
        SETTINGS: '/admin/finance/settings'
    },
    MARKETING: {
        CAMPAIGNS: '/admin/marketing/campaigns',
        VOUCHERS: '/admin/marketing/vouchers',
        SEASONAL_PROMOS: '/admin/marketing/seasonal-promos',
        FEATURED_VENDORS: '/admin/marketing/featured-vendors',
        LOYALTY: '/admin/marketing/loyalty'
    },
    SUBSCRIPTIONS: {
        CUSTOMER_PLANS: '/admin/subscriptions/customer-plans',
        VENDOR_PLANS: '/admin/subscriptions/vendor-plans',
        PAYMENT_HISTORY: '/admin/subscriptions/payment-history'
    },
    REPORTS: {
        PERFORMANCE: '/admin/reports/performance',
    },
    CUSTOMER_SUPPORT: {
        REQUESTS: '/admin/customer-support/requests',
        HISTORY: '/admin/customer-support/history'
    },
    CONTENT_MANAGEMENT: {
        BLOG: '/admin/content-management/blog',
        BANNERS: '/admin/content-management/banners'
    }
};

const STAFF = {
    DASHBOARD: '/staff/dashboard',
    SUPPORT: {
        TICKETS: '/staff/support/tickets',
        CHATS: '/staff/support/chats',
    },
    BOOKINGS: {
        LIST: '/staff/bookings/list',
    },
    DISPUTES: {
        LIST: '/staff/disputes/list',
    },
    VENDORS: {
        SERVICE_ASSIST: '/staff/vendors/service-assist',
    },
    FINANCE: {
        PAYMENT_ISSUES: '/staff/finance/payment-issues',
        DEPOSIT_CONFIRM: '/staff/finance/deposit-confirmation',
        REFUND_PROCESS: '/staff/finance/refund-process',
    },
    PROMOTION: {
        VOUCHER_ASSIGN: '/staff/promotion/voucher-assign',
        CAMPAIGN_TRACKING: '/staff/promotion/campaign-tracking',
    },
    CONTENT: {
        BLOG: '/staff/content/blog',
    }

};

export const ROUTES = {
    AUTH,
    PUBLIC,
    ADMIN,
    STAFF,
    VENDOR,
    USER
};