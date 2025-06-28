"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LucideIcon from "@components/Atoms/LucideIcon";
import { SimpleTooltip } from "@components/Molecules/Tooltip";
import { cn } from "@/utils/helpers/CN";
import { useIsMobile } from "@components/Atoms/ui/use-mobile";
import { ROUTES } from "@routes";

export interface SidebarItem {
    title: string;
    path?: string;
    icon?: keyof typeof import("lucide-react");
    children?: SidebarItem[];
    isExpanded?: boolean;
}

export interface SidebarProps {
    items: SidebarItem[];
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

const adminNavItems: SidebarItem[] = [
    {
        title: "Tổng quan",
        path: ROUTES.ADMIN.DASHBOARD,
        icon: "LayoutDashboard",
    },
    {
        title: "Người dùng",
        icon: "UserCircle",
        children: [
            {
                title: "Người dùng",
                path: ROUTES.ADMIN.USERS.LIST,
                icon: "User",
            },
        ],
    },
    {
        title: "Nhà cung cấp",
        icon: "Building2",
        children: [
            {
                title: "Nhà cung cấp",
                path: ROUTES.ADMIN.VENDORS.LIST,
                icon: "Store",
            },
        ],
    },
    {
        title: "Chiến dịch",
        icon: "Target",
        children: [
            {
                title: "Chiến dịch",
                path: ROUTES.ADMIN.CAMPAIGNS.LIST,
                icon: "Flag",
            },
        ],
    },
    {
        title: "Voucher",
        icon: "Gift",
        children: [
            {
                title: "Voucher",
                path: ROUTES.ADMIN.VOUCHERS.LIST,
                icon: "Ticket",
            },
        ],
    },
    {
        title: "Tài chính",
        icon: "Wallet2",
        children: [
            {
                title: "Tổng quan",
                path: ROUTES.ADMIN.FINANCE.ROOT,
                icon: "PieChart",
            },
            {
                title: "Thanh toán",
                path: ROUTES.ADMIN.FINANCE.PAYMENTS.LIST,
                icon: "CreditCard",
            },
            {
                title: "Giao dịch",
                path: ROUTES.ADMIN.FINANCE.TRANSACTIONS.LIST,
                icon: "ArrowLeftRight",
            },
        ],
    },
    {
        title: "Cài đặt",
        icon: "Settings2",
        children: [
            {
                title: "Danh mục",
                path: ROUTES.ADMIN.SETTINGS.CATEGORIES,
                icon: "FolderOpen",
            },
            {
                title: "Chính sách",
                path: ROUTES.ADMIN.SETTINGS.POLICIES,
                icon: "FileText",
            },
            {
                title: "Loyalty",
                path: ROUTES.ADMIN.SETTINGS.LOYALTY,
                icon: "Heart",
            },
            {
                title: "Gói đăng ký",
                path: ROUTES.ADMIN.SETTINGS.SUBSCRIPTIONS,
                icon: "Repeat",
            },
            {
                title: "Hoa hồng",
                path: ROUTES.ADMIN.SETTINGS.COMMISSION,
                icon: "Percent",
            },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        if (isMobile) setIsCollapsed(true);
    }, [isMobile]);

    useEffect(() => {
        // Tự động mở mục chứa route hiện tại
        const shouldExpandItems: Record<string, boolean> = {};
        const findActiveParent = (items: SidebarItem[]) => {
            for (const item of items) {
                if (item.children?.length) {
                    const hasActiveChild = item.children.some(
                        (child) => child.path === pathname || child.children?.some((grand) => grand.path === pathname)
                    );
                    if (hasActiveChild && item.title) {
                        shouldExpandItems[item.title] = true;
                    }
                    findActiveParent(item.children);
                }
            }
        };
        findActiveParent(adminNavItems);
        setExpandedItems(shouldExpandItems);
    }, [pathname]);

    const toggleExpand = (title: string) => {
        setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const toggleDropdown = (title: string) => {
        setActiveDropdown((prev) => (prev === title ? null : title));
    };

    const renderNavItems = (items: SidebarItem[], level = 0) => {
        return items.map((item, index) => {
            const isActive = item.path ? pathname === item.path : false;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems[item.title] || false;
            const isDropdownActive = activeDropdown === item.title;
            const isChildActive = hasChildren && item.children?.some(
                (child) => child.path === pathname || child.children?.some((grand) => grand.path === pathname)
            );
            // Nếu chỉ có 1 children thì render trực tiếp children đó
            if (hasChildren && item.children && item.children.length === 1) {
                const onlyChild = item.children[0];
                const onlyChildIsActive = onlyChild.path === pathname;
                return (
                    <div key={`${item.title}-onlychild`} className="w-full relative">
                        <Link href={onlyChild.path || "#"}>
                            <SimpleTooltip content={item.title} side="right" disabled={!isCollapsed}>
                                <div
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                                        onlyChildIsActive ? "bg-orange-100 text-orange-700" : "hover:bg-gray-100",
                                        isCollapsed && "justify-center"
                                    )}
                                >
                                    {item.icon && <LucideIcon name={item.icon} iconSize={20} iconColor={onlyChildIsActive ? "var(--color-orange-700)" : "currentColor"} />}
                                    {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                                </div>
                            </SimpleTooltip>
                        </Link>
                    </div>
                );
            }
            return (
                <div key={`${item.title}-${index}`} className="w-full relative">
                    {item.path && !hasChildren ? (
                        <Link href={item.path}>
                            <SimpleTooltip content={item.title} side="right" disabled={!isCollapsed}>
                                <div
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                                        isActive ? "bg-orange-100 text-orange-700" : "hover:bg-gray-100",
                                        isCollapsed && "justify-center",
                                        level > 0 && !isCollapsed && "ml-6"
                                    )}
                                >
                                    {item.icon && <LucideIcon name={item.icon} iconSize={20} iconColor={isActive ? "var(--color-orange-700)" : "currentColor"} />}
                                    {!isCollapsed && <span className="text-sm">{item.title}</span>}
                                </div>
                            </SimpleTooltip>
                        </Link>
                    ) : (
                        <>
                            <div
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors cursor-pointer",
                                    (isActive || isChildActive) && "bg-orange-100 text-orange-700",
                                    !isActive && !isChildActive && "hover:bg-gray-100",
                                    isCollapsed ? "justify-center" : "justify-between",
                                    level > 0 && !isCollapsed && "ml-6"
                                )}
                                onClick={() => {
                                    if (isCollapsed) {
                                        toggleDropdown(item.title);
                                    } else {
                                        toggleExpand(item.title);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    {item.icon && <LucideIcon name={item.icon} iconSize={20} iconColor={(isActive || isChildActive) ? "var(--color-orange-700)" : "currentColor"} />}
                                    {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                                </div>
                                {!isCollapsed && hasChildren && (
                                    <LucideIcon name={isExpanded ? "ChevronDown" : "ChevronRight"} iconSize={16} iconColor={(isActive || isChildActive) ? "var(--color-orange-700)" : "currentColor"} />
                                )}
                            </div>
                            {isCollapsed && hasChildren && isDropdownActive && (
                                <div
                                    className="fixed left-16 top-0 bg-white shadow-lg rounded-md py-2 z-[9999] w-56 border border-gray-200"
                                    style={{ marginTop: `${index * 40 + 60}px` }}
                                >
                                    <div className="px-3 py-2 font-medium border-b border-gray-100 mb-1">{item.title}</div>
                                    {item.children?.map((child, childIndex) => {
                                        const childIsActive = child.path === pathname;
                                        return (
                                            <Link key={`${item.title}-child-${childIndex}`} href={child.path || "#"} className="block">
                                                <div
                                                    className={cn(
                                                        "px-4 py-2 hover:bg-gray-100 flex items-center gap-2",
                                                        childIsActive && "bg-orange-100 text-orange-700"
                                                    )}
                                                >
                                                    {child.icon && <LucideIcon name={child.icon} iconSize={16} iconColor={childIsActive ? "var(--color-orange-700)" : "currentColor"} />}
                                                    <span className="text-sm">{child.title}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                            {!isCollapsed && hasChildren && isExpanded && item.children && (
                                <div className="mt-1 mb-1">{renderNavItems(item.children, level + 1)}</div>
                            )}
                        </>
                    )}
                </div>
            );
        });
    };

    const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    return (
        <div
            className={cn(
                "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {!isCollapsed && (
                    <span className="font-semibold">
                        <img src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg" alt="logo" style={{ width: "60px", height: "30px" }} />
                    </span>
                )}
                <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100">
                    <LucideIcon name={isCollapsed ? "PanelRightOpen" : "PanelLeftClose"} iconSize={20} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-2">{renderNavItems(adminNavItems)}</div>
        </div>
    );
}
