"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/Atoms/ui/dropdown-menu";
import LucideIcon from "@components/Atoms/LucideIcon";
import { motion, AnimatePresence } from "framer-motion";
import { formatRelativeTime } from "@utils/helpers/Date";
import { useNotificationTabs } from "@utils/hooks/useNotification";
import { Badge } from "@components/Atoms/ui/badge";

interface NotificationDropdownProps {
    isNotificationOpen: boolean;
    setIsNotificationOpen: (isOpen: boolean) => void;
    iconColor?: string;
}

export default function NotificationDropdown({
    isNotificationOpen,
    setIsNotificationOpen,
    iconColor
}: NotificationDropdownProps) {
    const {
        activeTab,
        setActiveTab,
        notifications,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        unreadCount,
        currentTabUnreadCount,
        allNotifications,
        photoNotifications
    } = useNotificationTabs();

    const handleOpenNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error('Error marking all as read:', error);
            // Optionally show error message to user
        }
    };

    const handleMarkAsRead = async (notificationId: string | number) => {
        try {
            await markAsRead(notificationId);
        } catch (error) {
            console.error('Error marking as read:', error);
            // Optionally show error message to user
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'thông tin':
                return 'Info';
            case 'cảnh báo':
                return 'AlertTriangle';
            case 'lỗi':
                return 'XCircle';
            case 'thành công':
                return 'CheckCircle';
            case 'đăng nhập':
                return 'LogIn';
            case 'điểm danh':
                return 'UserCheck';
            case 'trừ điểm':
                return 'MinusCircle';
            case 'cộng điểm':
                return 'PlusCircle';
            case 'đổi voucher':
                return 'Gift';
            case 'hết hạn thanh toán':
                return 'Clock';
            case 'thanh toán thành công':
                return 'CreditCard';
            case 'nhắc nhở gia hạn':
                return 'RefreshCw';
            case 'nhắc nhở chụp hình':
                return 'Camera';
            case 'xác nhận booking':
                return 'CalendarCheck';
            case 'hủy booking':
                return 'CalendarX';
            default:
                return 'Bell';
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'thông tin':
                return 'bg-blue-100 text-blue-700';
            case 'cảnh báo':
                return 'bg-yellow-100 text-yellow-700';
            case 'lỗi':
                return 'bg-red-100 text-red-700';
            case 'thành công':
                return 'bg-green-100 text-green-700';
            case 'đăng nhập':
                return 'bg-emerald-100 text-emerald-700';
            case 'điểm danh':
                return 'bg-indigo-100 text-indigo-700';
            case 'trừ điểm':
                return 'bg-red-100 text-red-600';
            case 'cộng điểm':
                return 'bg-green-100 text-green-600';
            case 'đổi voucher':
                return 'bg-purple-100 text-purple-700';
            case 'hết hạn thanh toán':
                return 'bg-orange-100 text-orange-700';
            case 'thanh toán thành công':
                return 'bg-emerald-100 text-emerald-700';
            case 'nhắc nhở gia hạn':
                return 'bg-cyan-100 text-cyan-700';
            case 'nhắc nhở chụp hình':
                return 'bg-pink-100 text-pink-700';
            case 'xác nhận booking':
                return 'bg-green-100 text-green-700';
            case 'hủy booking':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div
                        onClick={handleOpenNotification}
                        className="hover:bg-[#c9c9ce21] cursor-pointer relative mt-2 p-2 rounded-lg transition-all duration-200 group"
                    >
                        <div className="relative">
                            <LucideIcon
                                name="Bell"
                                iconSize={26}
                                iconColor={iconColor || "black"}
                                className="transition-transform duration-200 group-hover:scale-110"
                            />
                            <AnimatePresence>
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="absolute -top-3 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                                >
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 max-h-[600px] overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <LucideIcon name="Bell" iconSize={20} iconColor="#3b82f6" />
                            <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
                            {unreadCount > 0 && (
                                <Badge variant="outline" className="ml-2 text-xs ">
                                    {unreadCount} mới
                                </Badge>
                            )}
                        </div>
                        {currentTabUnreadCount > 0 && (
                            <a
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center"
                                onClick={handleMarkAllAsRead}
                            >
                                <LucideIcon name="Check" iconSize={16} className="mr-1" />
                                Đánh dấu đã đọc
                            </a>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-4">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`cursor-pointer flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'all'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <LucideIcon name="List" iconSize={16} />
                                <span>Toàn bộ</span>
                                {allNotifications.filter(n => !n.is_read).length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {allNotifications.filter(n => !n.is_read).length}
                                    </Badge>
                                )}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('photo-reminder')}
                            className={`cursor-pointer flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'photo-reminder'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <LucideIcon name="Camera" iconSize={16} />
                                <span>Nhắc nhở chụp hình</span>
                                {photoNotifications.filter(n => !n.is_read).length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {photoNotifications.filter(n => !n.is_read).length}
                                    </Badge>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto">
                    {loading ? (
                        <div className="p-6 text-center">
                            <div className="inline-flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                <p className="text-sm text-gray-500">Đang tải thông báo...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center">
                            <div className="inline-flex items-center gap-2 text-red-500">
                                <LucideIcon name="AlertCircle" iconSize={20} />
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    ) : notifications.length > 0 ? (
                        <AnimatePresence>
                            {notifications.map((notification, index) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleMarkAsRead(notification.id);
                                        }}
                                        className={`p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 ${!notification.is_read ? 'bg-blue-50/50' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3 w-full">
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                                                <LucideIcon
                                                    name={getNotificationIcon(notification.type) as keyof typeof import('lucide-react')}
                                                    iconSize={18}
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h4 className={`text-sm font-medium truncate ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                        {notification.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                        {!notification.is_read && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-2 h-2 bg-blue-500 rounded-full"
                                                            />
                                                        )}
                                                        <span className="text-xs text-gray-400">
                                                            {formatRelativeTime(notification.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <div className="mt-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${getNotificationColor(notification.type)}`}
                                                    >
                                                        {notification.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="inline-flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <LucideIcon name="Bell" iconSize={24} iconColor="#9ca3af" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                        Không có thông báo
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Bạn sẽ nhận được thông báo khi có hoạt động mới
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Tổng cộng {notifications.length} thông báo</span>
                            <span>{currentTabUnreadCount} chưa đọc</span>
                        </div>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 