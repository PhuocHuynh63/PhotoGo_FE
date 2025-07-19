import http from "@configs/fetch"

const notificationService = {
    getNotifications: async (queryParams: string) => {
        return await http.get(`/notifications/user/me?${queryParams}`, {
            cache: 'no-store'
        })
    },
    markAsRead: async (notificationId: string) => {
        return await http.patch(`/notifications/mark-as-read/${notificationId}`, {
            cache: 'no-store'
        })
    },
    markAllAsRead: async () => {
        return await http.patch(`/notifications/mark-all-as-read`, {
            cache: 'no-store'
        })
    }
}

export default notificationService