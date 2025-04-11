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
    ABOUT: '/about',
}

const ADMIN = {
    DASHBOARD: '/admin',
};

export const ROUTES = {
    AUTH,
    PUBLIC,
    ADMIN,
};