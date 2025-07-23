import React from "react";
import { Sheet, SheetContent, SheetTitle } from "@components/Atoms/ui/sheet";
import LucideIcon from "@components/Atoms/LucideIcon";
import { useNotificationTabs } from "@utils/hooks/useNotification";
import { Badge } from "@components/Atoms/ui/badge";
import { formatRelativeTime } from "@utils/helpers/Date";

interface MobileNotificationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "thông tin":
      return "Info";
    case "cảnh báo":
      return "AlertTriangle";
    case "lỗi":
      return "XCircle";
    case "thành công":
      return "CheckCircle";
    case "đăng nhập":
      return "LogIn";
    case "điểm danh":
      return "UserCheck";
    case "trừ điểm":
      return "MinusCircle";
    case "cộng điểm":
      return "PlusCircle";
    case "đổi voucher":
      return "Gift";
    case "hết hạn thanh toán":
      return "Clock";
    case "thanh toán thành công":
      return "CreditCard";
    case "nhắc nhở gia hạn":
      return "RefreshCw";
    case "nhắc nhở chụp hình":
      return "Camera";
    case "xác nhận booking":
      return "CalendarCheck";
    case "hủy booking":
      return "CalendarX";
    default:
      return "Bell";
  }
};

const getNotificationColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "thông tin":
      return "bg-blue-100 text-blue-700";
    case "cảnh báo":
      return "bg-yellow-100 text-yellow-700";
    case "lỗi":
      return "bg-red-100 text-red-700";
    case "thành công":
      return "bg-green-100 text-green-700";
    case "đăng nhập":
      return "bg-emerald-100 text-emerald-700";
    case "điểm danh":
      return "bg-indigo-100 text-indigo-700";
    case "trừ điểm":
      return "bg-red-100 text-red-600";
    case "cộng điểm":
      return "bg-green-100 text-green-600";
    case "đổi voucher":
      return "bg-purple-100 text-purple-700";
    case "hết hạn thanh toán":
      return "bg-orange-100 text-orange-700";
    case "thanh toán thành công":
      return "bg-emerald-100 text-emerald-700";
    case "nhắc nhở gia hạn":
      return "bg-cyan-100 text-cyan-700";
    case "nhắc nhở chụp hình":
      return "bg-pink-100 text-pink-700";
    case "xác nhận booking":
      return "bg-green-100 text-green-700";
    case "hủy booking":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function MobileNotificationSheet({ open, onOpenChange }: MobileNotificationSheetProps) {
  const {
    activeTab,
    setActiveTab,
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    currentTabUnreadCount,
    allNotifications,
    photoNotifications
  } = useNotificationTabs();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="md:hidden max-h-[90vh] p-0 flex flex-col">
        <SheetTitle className="sr-only">Thông báo</SheetTitle>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <LucideIcon name="Bell" iconSize={22} iconColor="#3b82f6" />
            <span className="text-lg font-semibold">Thông báo</span>
          </div>
          {currentTabUnreadCount > 0 && (
            <button
              className=" justify-center text-xs shadow-lg box-shadow-lg rounded-md p-2 text-blue-600 hover:text-blue-700 hover:underline flex items-center"
              onClick={markAllAsRead}
            >
              <LucideIcon name="CheckCheck" iconSize={16} className="mr-1" />
            </button>
          )}
        </div>
        {/* Tabs */}
        <div className="flex gap-1 px-4 py-2 border-b bg-white sticky top-0 z-10">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
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
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'photo-reminder' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
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
        {/* Notification List */}
        <div className="flex-1 overflow-y-auto bg-white">
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
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex gap-3 p-4 border-b last:border-b-0 transition-colors duration-200 cursor-pointer ${!notification.is_read ? 'bg-blue-50/50' : ''}`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                  <LucideIcon name={getNotificationIcon(notification.type)} iconSize={18} />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`text-sm font-medium truncate ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>{notification.title}</h4>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {!notification.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                      <span className="text-xs text-gray-400">{formatRelativeTime(notification.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{notification.message}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className={`text-xs ${getNotificationColor(notification.type)}`}>{notification.type}</Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <LucideIcon name="Bell" iconSize={24} iconColor="#9ca3af" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Không có thông báo</p>
                  <p className="text-xs text-gray-500">Bạn sẽ nhận được thông báo khi có hoạt động mới</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 