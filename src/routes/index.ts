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
    STUDIO: '/studio',
    FREELANCER: '/freelancer',
    VENDOR_DETAIL: '/:slug/:page',
    ABOUT: '/about',
};

const USER ={
    DASHBOARD: '/user',
    PROFILE: {

    },
    BOOKINGS:{

    },
    CART:{

    },
    WISHLIST:{

    },
    WALLET:{

    },
    LOYALTY:{

    }, 
    PROMOTION:{

    },
    REVIEWS:{

    },
    SUPPORT:{

    },
};

const VENDOR = {
    DASHBOARD: '/vendor/dashboard',
    PROFILE: {
        INFO :'/vendor/profile/information',
        LOCATIONS :'/vendor/profile/locations',
        TEAM :'/vendor/profile/team',
        PORTFOLIO :'/vendor/profile/portfolio',
    },
    SERVICE_PACKAGES:{
        LIST :'/vendor/service-packages/list',
    },
    AVAILABILITY: {
        SCHEDULE: '/vendor/availability/schedule',
        BLACKOUTS: '/vendor/availability/blackouts',
    },
    BOOKINGS: {
        CALENDAR :'/vendor/bookings/calendar',
        REQUESTS :'/vendor/bookings/requests',
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
    USER_MANAGEMENT : {
        LIST :'/admin/user-management/list',
    },
    VENDOR_MANAGEMENT : {
        LIST :'/admin/vendor-management/list',
    },
    SERVICE_PACKAGE_MANAGEMENT : {
        LIST :'/admin/service-package-management/list',
    },  
    BOOKING_MANAGEMENT : {
        LIST :'/admin/booking-management/list',
        DISPUTES :'/admin/booking-management/disputes',
    },
    FINANCE: {
        OVERVIEW :'/admin/finance/overview',
        TRANSACTION :'/admin/finance/transaction',
        INVOICE :'/admin/finance/invoice',
        REVENUE:'/admin/finance/revenue',
        PAYOUT:'/admin/finance/payout',
        REFUND:'/admin/finance/refund',
    },
    SUBCRIPTIONS:{
        PLANS:'/admin/subscriptions/plans',
        CUSTOMER_PLAN:'/admin/subscriptions/customer-plan',
        VENDOR_PLAN:'/admin/subscriptions/vendor-plan',
        BILLING_LOGS:'/admin/subscriptions/billing-logs',
    },
    MARKETING:{
        CAMPAIGN:'/admin/marketing/campaign',
        PROMOTION:'/admin/marketing/promotion',
        FEATURED_VENDOR :'/admin/marketing/featured-vendor',
        SEASONAL_PROMOS:'/admin/marketing/seasonal-promos',
    },
    REPORTS:{
        PERFORMANCE:'/admin/reports/performance',
    },
    CUSTOMER_SUPPORT:{
        TICKETS:'/admin/customer-support/tickets',
        //CHATS:'/admin/customer-support/chats',
    },
    CONTENT_MANAGEMENT:{
        BLOG:'/admin/content-management/blog',
        //BANNERS:'/admin/content-management/banners',
    }

};

const STAFF =  {
    DASHBOARD: '/staff/dashboard',
    SUPPORT :{
        TICKETS:'/staff/support/tickets',
        CHATS:'/staff/support/chats',
    },
    BOOKINGS : {
        LIST:'/staff/bookings/list',
    },  
    DISPUTES:{
        LIST:'/staff/disputes/list',
    },
    VENDORS:{
        SERVICE_ASSIST: '/staff/vendors/service-assist',
    },
    FINANCE:{
        PAYMENT_ISSUES: '/staff/finance/payment-issues',
        DEPOSIT_CONFIRM: '/staff/finance/deposit-confirmation',
        REFUND_PROCESS: '/staff/finance/refund-process',
    },
    PROMOTION:{
        VOUCHER_ASSIGN: '/staff/promotion/voucher-assign',
        CAMPAIGN_TRACKING: '/staff/promotion/campaign-tracking',
    },
    CONTENT:{
        BLOG:'/staff/content/blog',
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