import { useState, useEffect, useCallback, useMemo } from 'react';
import notificationService from '@services/notification';

interface UseNotificationsProps {
    type?: string;
    current?: number;
    pageSize?: number;
    autoFetch?: boolean;
}

interface UseNotificationsReturn {
    notifications: ICOMPONENTS.Notification[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (notificationId: string | number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
}

interface UseNotificationTabsReturn {
    activeTab: 'all' | 'photo-reminder';
    setActiveTab: (tab: 'all' | 'photo-reminder') => void;
    notifications: ICOMPONENTS.Notification[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    markAsRead: (notificationId: string | number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
    unreadCount: number;
    currentTabUnreadCount: number;
    allNotifications: ICOMPONENTS.Notification[];
    photoNotifications: ICOMPONENTS.Notification[];
}

export const useNotifications = ({
    type,
    current = 1,
    pageSize = 10,
    autoFetch = true
}: UseNotificationsProps = {}): UseNotificationsReturn => {
    const [notifications, setNotifications] = useState<ICOMPONENTS.Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(current);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Tạo queryParams trong hook
            const queryParams = new URLSearchParams({
                current: currentPage.toString(),
                pageSize: pageSize.toString()
            });
            
            if (type) {
                queryParams.append('type', type);
            }

            const response = await notificationService.getNotifications(queryParams.toString());
            if (response && typeof response === 'object' && 'data' in response) {
                const responseData = response as { data: { data: ICOMPONENTS.Notification[] } };
                const newNotifications = responseData.data?.data || [];
                console.log(newNotifications)
                if (currentPage === 1) {
                    // Nếu là trang đầu tiên, thay thế toàn bộ danh sách
                    setNotifications(newNotifications);
                } else {
                    // Nếu không phải trang đầu, thêm vào cuối danh sách
                    setNotifications(prev => [...prev, ...newNotifications]);
                }

                // Kiểm tra xem còn dữ liệu không
                setHasMore(newNotifications.length === pageSize);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông báo');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, type]);

    const markAsRead = useCallback(async (notificationId: string | number) => {
        try {
            // Call API to mark as read
            await notificationService.markAsRead(notificationId.toString());
            
            // Update local state
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
            // Optionally show error message to user
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            // Call API to mark all as read
            await notificationService.markAllAsRead();
            
            // Update local state
            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({
                    ...notification,
                    is_read: true
                }))
            );
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
            // Optionally show error message to user
        }
    }, []);

    const refreshNotifications = useCallback(async () => {
        setCurrentPage(1);
        await fetchNotifications();
    }, [fetchNotifications]);

    // Auto fetch khi component mount
    useEffect(() => {
        if (autoFetch) {
            fetchNotifications();
        }
    }, [autoFetch, fetchNotifications]);

    // Reset page khi thay đổi pageSize
    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize]);

    return {
        notifications,
        loading,
        error,
        hasMore,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        refreshNotifications
    };
};

export const useNotificationTabs = (): UseNotificationTabsReturn => {
    const [activeTab, setActiveTab] = useState<'all' | 'photo-reminder'>('all');

    // Hook cho tab "Toàn bộ" (không có type)
    const {
        notifications: allNotifications,
        loading: allLoading,
        error: allError,
        markAsRead: markAsReadAll,
        markAllAsRead: markAllAsReadAll
    } = useNotifications({ type: undefined });

    // Hook cho tab "Nhắc nhở chụp hình"
    const {
        notifications: photoNotifications,
        loading: photoLoading,
        error: photoError,
        markAsRead: markAsReadPhoto,
        markAllAsRead: markAllAsReadPhoto
    } = useNotifications({ type: 'nhắc nhở chụp hình' });

    // Sử dụng data theo tab hiện tại
    const notifications = activeTab === 'all' ? allNotifications : photoNotifications;
    const loading = activeTab === 'all' ? allLoading : photoLoading;
    const error = activeTab === 'all' ? allError : photoError;
    const markAsRead = activeTab === 'all' ? markAsReadAll : markAsReadPhoto;
    const markAllAsRead = activeTab === 'all' ? markAllAsReadAll : markAllAsReadPhoto;

    // Tính số lượng thông báo chưa đọc cho badge (luôn dùng data từ tab "Toàn bộ")
    const unreadCount = useMemo(() => {
        return allNotifications.filter((notification: ICOMPONENTS.Notification) => !notification.is_read).length;
    }, [allNotifications]);

    // Tính số lượng thông báo chưa đọc cho tab hiện tại
    const currentTabUnreadCount = useMemo(() => {
        return notifications.filter((notification: ICOMPONENTS.Notification) => !notification.is_read).length;
    }, [notifications]);

    return {
        activeTab,
        setActiveTab,
        notifications,
        loading,
        error,
        hasMore: true, // Có thể thêm logic hasMore nếu cần
        markAsRead,
        markAllAsRead,
        refreshNotifications: async () => {
            // Refresh cả 2 tabs - sử dụng trực tiếp service
            const allQueryParams = new URLSearchParams({
                current: '1',
                pageSize: '10'
            });
            
            const photoQueryParams = new URLSearchParams({
                current: '1',
                pageSize: '10',
                type: 'nhắc nhở chụp hình'
            });
            
            await Promise.all([
                notificationService.getNotifications(allQueryParams.toString()),
                notificationService.getNotifications(photoQueryParams.toString())
            ]);
        },
        unreadCount,
        currentTabUnreadCount,
        allNotifications,
        photoNotifications
    };
}; 