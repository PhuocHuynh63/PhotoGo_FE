'use client'

import { useState, useEffect } from 'react'
import AdminStaffHeader from '@components/Organisms/AdminStaffHeader'
import Sidebar, { SidebarItem } from '@components/Organisms/Sidebar'
import { ROUTES } from '@routes'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [, setIsMobile] = useState(false)

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
      title: 'TRANG CHỦ',
      path: ROUTES.ADMIN.DASHBOARD,
      icon: 'LayoutDashboard'
    },
    {
      title: 'QUẢN LÝ NGƯỜI DÙNG',
      icon: 'Users',
      children: [
        {
          title: 'DANH SÁCH',
          path: ROUTES.ADMIN.USER_MANAGEMENT.LIST,
          icon: 'List'
        }
      ]
    },
    {
      title: 'QUẢN LÝ NHÀ CUNG CẤP',
      icon: 'Store',
      children: [
        {
          title: 'Vendor List',
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
          title: 'Package List',
          path: ROUTES.ADMIN.SERVICE_PACKAGE_MANAGEMENT.LIST,
          icon: 'List'
        }
      ]
    },
    {
      title: 'QUẢN LÝ ĐƠN HÀNG',
      icon: 'Calendar',
      children: [
        {
          title: 'Booking List',
          path: ROUTES.ADMIN.BOOKING_MANAGEMENT.LIST,
          icon: 'List'
        },
        {
          title: 'Disputes',
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
          title: 'Overview',
          path: ROUTES.ADMIN.FINANCE.OVERVIEW,
          icon: 'PieChart'
        },
        {
          title: 'Transactions',
          path: ROUTES.ADMIN.FINANCE.TRANSACTION,
          icon: 'ArrowLeftRight'
        },
        {
          title: 'Invoices',
          path: ROUTES.ADMIN.FINANCE.INVOICE,
          icon: 'Receipt'
        },
        {
          title: 'Revenue',
          path: ROUTES.ADMIN.FINANCE.REVENUE,
          icon: 'TrendingUp'
        },
        {
          title: 'Payouts',
          path: ROUTES.ADMIN.FINANCE.PAYOUT,
          icon: 'CreditCard'
        },
        {
          title: 'Refunds',
          path: ROUTES.ADMIN.FINANCE.REFUND,
          icon: 'RefreshCcw'
        }
      ]
    },
    {
      title: 'GÓI ĐĂNG KÝ',
      icon: 'Repeat',
      children: [
        {
          title: 'Plans',
          path: ROUTES.ADMIN.SUBCRIPTIONS.PLANS,
          icon: 'Layers'
        },
        {
          title: 'Customer Plans',
          path: ROUTES.ADMIN.SUBCRIPTIONS.CUSTOMER_PLAN,
          icon: 'Users'
        },
        {
          title: 'Vendor Plans',
          path: ROUTES.ADMIN.SUBCRIPTIONS.VENDOR_PLAN,
          icon: 'Store'
        },
        {
          title: 'Billing Logs',
          path: ROUTES.ADMIN.SUBCRIPTIONS.BILLING_LOGS,
          icon: 'FileText'
        }
      ]
    },
    {
      title: 'TRUYỀN THÔNG',
      icon: 'Megaphone',
      children: [
        {
          title: 'Campaigns',
          path: ROUTES.ADMIN.MARKETING.CAMPAIGN,
          icon: 'Target'
        },
        {
          title: 'Promotions',
          path: ROUTES.ADMIN.MARKETING.PROMOTION,
          icon: 'Tag'
        },
        {
          title: 'Featured Vendors',
          path: ROUTES.ADMIN.MARKETING.FEATURED_VENDOR,
          icon: 'Award'
        },
        {
          title: 'Seasonal Promos',
          path: ROUTES.ADMIN.MARKETING.SEASONAL_PROMOS,
          icon: 'Calendar'
        }
      ]
    },
    {
      title: 'BÁO CÁO',
      icon: 'BarChart',
      children: [
        {
          title: 'Performance',
          path: ROUTES.ADMIN.REPORTS.PERFORMANCE,
          icon: 'Activity'
        }
      ]
    },
    {
      title: 'CSKH',
      icon: 'HeadphonesIcon',
      children: [
        {
          title: 'Tickets',
          path: ROUTES.ADMIN.CUSTOMER_SUPPORT.TICKETS,
          icon: 'Ticket'
        }
      ]
    },
    {
      title: 'NỘI DUNG',
      icon: 'FileText',
      children: [
        {
          title: 'Blog',
          path: ROUTES.ADMIN.CONTENT_MANAGEMENT.BLOG,
          icon: 'BookOpen'
        }
      ]
    }
  ]

  return (
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
  )
}
