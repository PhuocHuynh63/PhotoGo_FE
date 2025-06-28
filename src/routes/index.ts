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
    SUPPORT: '/support',
    PAYMENT_ERROR: '/payment/error',
    PAYMENT_SUCCESS: '/payment/successful',
};

const USER = {
    DASHBOARD: '/user',
    PROFILE: {
        INFO: '/profile',
        PROMOTIONS: '/profile/promotions',
        CHANGE_PASSWORD: '/profile/change-password',
        REWARDS: '/profile/rewards',
        FAVORITES: '/profile/favorites',
        ORDERS: '/profile/orders',
        REVIEWS: '/profile/reviews',
    },
    CHECKOUT: '/checkout/:id',
    CHAT: '/chat/:id',
};

const VENDOR = {
    DASHBOARD: '/vendor/dashboard',
    PROFILE: '/vendor/profile',
    STATISTICS: '/vendor/statistics',
    CALENDAR: '/vendor/calendar',
    FINANCE: '/vendor/finance',
    SERVICES: '/vendor/services',
    BRANCHES: '/vendor/branches',
    SERVICE_STATISTICS: '/vendor/service-statistics',
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
    USERS: {
        LIST: '/admin/users',
        DETAIL: '/admin/users/:slug',
    },
    VENDORS: {
        LIST: '/admin/vendors',
        DETAIL: '/admin/vendors/:slug',
    },
    CAMPAIGNS: {
        LIST: '/admin/campaigns',
        DETAIL: '/admin/campaigns/:slug',
    },
    VOUCHERS: {
        LIST: '/admin/vouchers',
        DETAIL: '/admin/vouchers/:slug',
    },
    FINANCE: {
        ROOT: '/admin/finance',
        PAYMENTS: {
            LIST: '/admin/finance/payments',
            DETAIL: '/admin/finance/payments/:slug',
        },
        TRANSACTIONS: {
            LIST: '/admin/finance/transactions',
            DETAIL: '/admin/finance/transactions/:slug',
        },
    },
    SETTINGS: {
        ROOT: '/admin/settings',
        CATEGORIES: '/admin/settings/categories',
        POLICIES: '/admin/settings/policies',
        LOYALTY: '/admin/settings/loyalty',
        SUBSCRIPTIONS: '/admin/settings/subscriptions',
        COMMISSION: '/admin/settings/commission',
    },
};

const STAFF = {
    DASHBOARD: '/staff/dashboard',
};

export const ROUTES = {
    AUTH,
    PUBLIC,
    ADMIN,
    STAFF,
    VENDOR,
    USER
};