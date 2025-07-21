"use client";

import LucideIcon from "@components/Atoms/LucideIcon";
import { useMemo } from "react";
import { useNotifications } from "@utils/hooks/useNotification";

interface MobileNotificationButtonProps {
    isNotificationOpen: boolean;
    handleOpenNotification: () => void;
}

export default function MobileNotificationButton({
    isNotificationOpen,
    handleOpenNotification
}: MobileNotificationButtonProps) {
    const { notifications } = useNotifications();

    const unreadNotifications = useMemo(() => {
        return notifications.filter((notification: ICOMPONENTS.Notification) => !notification.is_read);
    }, [notifications]);

    return (
        <div
            onClick={handleOpenNotification}
            className={`flex flex-col items-center gap-1 cursor-pointer ${isNotificationOpen ? "text-primary" : ""}`}
        >
            <div className={`w-12 h-12 rounded-full ${isNotificationOpen ? "bg-primary/10" : "bg-gray-100"} flex items-center justify-center relative`}>
                <LucideIcon name="Bell" iconSize={24} />
                {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications.length}
                    </span>
                )}
            </div>
            <span className="text-xs">Thông báo</span>
        </div>
    );
} 