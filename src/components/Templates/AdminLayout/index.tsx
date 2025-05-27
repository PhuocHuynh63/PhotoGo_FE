'use client'

import { useState, useEffect } from 'react'
import AdminStaffHeader from '@components/Organisms/AdminStaffHeader'
import Sidebar, { SidebarItem } from '@components/Organisms/Sidebar'
import { ROUTES } from '@routes'
import { Toaster } from 'react-hot-toast'
import { TooltipProvider } from '@components/Molecules/Tooltip'

export default function AdminLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth < 768) {
                setSidebarCollapsed(true)
            }
        }

        checkIfMobile()
        window.addEventListener('resize', checkIfMobile)

        return () => {
            window.removeEventListener('resize', checkIfMobile)
        }
    }, [])

    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed)
    }

    const adminNavItems: SidebarItem[] = [
        {
            title: 'TỔNG QUAN',
            path: ROUTES.ADMIN.DASHBOARD,
            icon: 'LayoutDashboard'
        },
        {
            title: 'QUẢN LÝ NGƯỜI DÙNG',
            icon: 'Users',
            children: [
                {
                    title: 'KHÁCH HÀNG',
                    path: ROUTES.ADMIN.USER_MANAGEMENT.CUSTOMER_LIST,
                    icon: 'User'
                },
                {
                    title: 'NHÂN VIÊN',
                    path: ROUTES.ADMIN.USER_MANAGEMENT.STAFF_LIST,
                    icon: 'UserCog'
                }
            ]
        },
        {
            title: 'QUẢN LÝ NHÀ CUNG CẤP',
            icon: 'Store',
            children: [
                {
                    title: 'DANH SÁCH',
                    path: ROUTES.ADMIN.VENDOR_MANAGEMENT.LIST,
                    icon: 'List'
                }
            ]
        },
        {
            title: 'QUẢN LÝ GÓI DỊCH VỤ',
            icon: 'Package',
            children: [
                {
                    title: 'DANH SÁCH GÓI DỊCH VỤ',
                    path: ROUTES.ADMIN.SERVICE_PACKAGE_MANAGEMENT.LIST,
                    icon: 'List'
                },
                {
                    title: 'PHÊ DUYỆT DỊCH VỤ MỚI',
                    path: ROUTES.ADMIN.SERVICE_PACKAGE_MANAGEMENT.APPROVAL,
                    icon: 'CheckCircle'
                },
                {
                    title: 'CONCEPT TRONG GÓI DỊCH VỤ',
                    path: ROUTES.ADMIN.SERVICE_PACKAGE_MANAGEMENT.CONCEPTS,
                    icon: 'Lightbulb'
                },
                {
                    title: 'THẺ PHONG CÁCH DỊCH VỤ',
                    path: ROUTES.ADMIN.SERVICE_PACKAGE_MANAGEMENT.STYLE_TAGS,
                    icon: 'Tag'
                },
                {
                    title: 'DANH MỤC NHÀ CUNG CẤP',
                    path: ROUTES.ADMIN.SERVICE_PACKAGE_MANAGEMENT.VENDOR_CATEGORIES,
                    icon: 'FolderTree'
                }
            ]
        },
        {
            title: 'QUẢN LÝ ĐẶT LỊCH',
            icon: 'Calendar',
            children: [
                {
                    title: 'TẤT CẢ ĐẶT LỊCH',
                    path: ROUTES.ADMIN.BOOKING_MANAGEMENT.LIST,
                    icon: 'List'
                },
                {
                    title: 'XỬ LÝ TRANH CHẤP',
                    path: ROUTES.ADMIN.BOOKING_MANAGEMENT.DISPUTES,
                    icon: 'AlertTriangle'
                }
            ]
        },
        {
            title: 'TÀI CHÍNH',
            icon: 'DollarSign',
            children: [
                {
                    title: 'TỔNG QUAN',
                    path: ROUTES.ADMIN.FINANCE.OVERVIEW,
                    icon: 'PieChart'
                },
                {
                    title: 'GIAO DỊCH',
                    path: ROUTES.ADMIN.FINANCE.TRANSACTIONS,
                    icon: 'ArrowLeftRight'
                },
                {
                    title: 'CHI TRẢ CHO VENDOR',
                    path: ROUTES.ADMIN.FINANCE.VENDOR_PAYMENTS,
                    icon: 'CreditCard'
                },
                {
                    title: 'HOÀN TIỀN',
                    path: ROUTES.ADMIN.FINANCE.REFUNDS,
                    icon: 'RefreshCcw'
                },
                {
                    title: 'VÍ',
                    path: ROUTES.ADMIN.FINANCE.WALLET,
                    icon: 'Wallet'
                },
                {
                    title: 'CÀI ĐẶT TÀI CHÍNH',
                    path: ROUTES.ADMIN.FINANCE.SETTINGS,
                    icon: 'Settings'
                }
            ]
        },
        {
            title: 'TIẾP THỊ',
            icon: 'Megaphone',
            children: [
                {
                    title: 'CHIẾN DỊCH',
                    path: ROUTES.ADMIN.MARKETING.CAMPAIGNS,
                    icon: 'Target'
                },
                {
                    title: 'VOUCHERS',
                    path: ROUTES.ADMIN.MARKETING.VOUCHERS,
                    icon: 'Ticket'
                },
                {
                    title: 'KHUYẾN MÃI THEO MÙA',
                    path: ROUTES.ADMIN.MARKETING.SEASONAL_PROMOS,
                    icon: 'Calendar'
                },
                {
                    title: 'VENDOR NỔI BẬT',
                    path: ROUTES.ADMIN.MARKETING.FEATURED_VENDORS,
                    icon: 'Award'
                },
                {
                    title: 'LOYALTY',
                    path: ROUTES.ADMIN.MARKETING.LOYALTY,
                    icon: 'Heart'
                }
            ]
        },
        {
            title: 'SUBSCRIPTION',
            icon: 'Repeat',
            children: [
                {
                    title: 'GÓI KHÁCH HÀNG',
                    path: ROUTES.ADMIN.SUBSCRIPTIONS.CUSTOMER_PLANS,
                    icon: 'Users'
                },
                {
                    title: 'GÓI VENDOR',
                    path: ROUTES.ADMIN.SUBSCRIPTIONS.VENDOR_PLANS,
                    icon: 'Store'
                },
                {
                    title: 'LỊCH SỬ THANH TOÁN',
                    path: ROUTES.ADMIN.SUBSCRIPTIONS.PAYMENT_HISTORY,
                    icon: 'FileText'
                }
            ]
        },
        {
            title: 'BÁO CÁO',
            icon: 'BarChart',
            children: [
                {
                    title: 'HIỆU SUẤT',
                    path: ROUTES.ADMIN.REPORTS.PERFORMANCE,
                    icon: 'Activity'
                }
            ]
        },
        {
            title: 'HỖ TRỢ KHÁCH HÀNG',
            icon: 'HeadphonesIcon',
            children: [
                {
                    title: 'DANH SÁCH YÊU CẦU',
                    path: ROUTES.ADMIN.CUSTOMER_SUPPORT.REQUESTS,
                    icon: 'Ticket'
                },
                {
                    title: 'LỊCH SỬ HỖ TRỢ',
                    path: ROUTES.ADMIN.CUSTOMER_SUPPORT.HISTORY,
                    icon: 'History'
                }
            ]
        },
        {
            title: 'QUẢN LÝ NỘI DUNG',
            icon: 'FileText',
            children: [
                {
                    title: 'BLOG',
                    path: ROUTES.ADMIN.CONTENT_MANAGEMENT.BLOG,
                    icon: 'BookOpen'
                },
                {
                    title: 'BANNER',
                    path: ROUTES.ADMIN.CONTENT_MANAGEMENT.BANNERS,
                    icon: 'Image'
                }
            ]
        }
    ]

    return (
        <TooltipProvider>
            <div className="flex h-screen bg-gray-50">
                <Sidebar
                    items={adminNavItems}
                    isCollapsed={isSidebarCollapsed}
                    toggleCollapse={toggleSidebar}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminStaffHeader userRole="admin" userName="Admin User" />
                    <main className="flex-1 overflow-y-auto p-4">
                        <Toaster />
                        {children}
                    </main>
                </div>
            </div>
        </TooltipProvider>
    )
}
