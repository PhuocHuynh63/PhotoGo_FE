'use client'

import { useState, useEffect, useRef } from 'react'
import AdminStaffHeader from '@components/Organisms/AdminStaffHeader'
import Sidebar, { SidebarItem } from '@components/Organisms/Sidebar'
import { ROUTES } from '@routes'
import { Toaster } from 'react-hot-toast'
import BackToTop from '@components/Atoms/BackToTop'
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [, setIsMobile] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

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

  // Force a scroll event to initialize the BackToTop component
  useEffect(() => {
    if (mainRef.current) {
      // Trigger a scroll event after a short delay to ensure the component is mounted
      setTimeout(() => {
        const scrollEvent = new Event('scroll')
        mainRef.current?.dispatchEvent(scrollEvent)
      }, 500)
    }
  }, [mainRef])

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
          title: 'DANH SÁCH',
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
          title: 'DANH SÁCH',
          path: ROUTES.ADMIN.BOOKING_MANAGEMENT.LIST,
          icon: 'List'
        },
        {
          title: 'TRANH CHẤP',
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
          path: ROUTES.ADMIN.FINANCE.TRANSACTION,
          icon: 'ArrowLeftRight'
        },
        {
          title: 'HÓA ĐƠN',
          path: ROUTES.ADMIN.FINANCE.INVOICE,
          icon: 'Receipt'
        },
        {
          title: 'DOANH THU',
          path: ROUTES.ADMIN.FINANCE.REVENUE,
          icon: 'TrendingUp'
        },
        {
          title: 'THANH TOÁN',
          path: ROUTES.ADMIN.FINANCE.PAYOUT,
          icon: 'CreditCard'
        },
        {
          title: 'HOÀN TIỀN',
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
          title: 'GÓI DỊCH VỤ',
          path: ROUTES.ADMIN.SUBCRIPTIONS.PLANS,
          icon: 'Layers'
        },
        {
          title: 'GÓI KHÁCH HÀNG',
          path: ROUTES.ADMIN.SUBCRIPTIONS.CUSTOMER_PLAN,
          icon: 'Users'
        },
        {
          title: 'GÓI NHÀ CUNG CẤP',
          path: ROUTES.ADMIN.SUBCRIPTIONS.VENDOR_PLAN,
          icon: 'Store'
        },
        {
          title: 'LỊCH SỬ THANH TOÁN',
          path: ROUTES.ADMIN.SUBCRIPTIONS.BILLING_LOGS,
          icon: 'FileText'
        }
      ]
    },
    {
      title: 'TIẾP THỊ',
      icon: 'Megaphone',
      children: [
        {
          title: 'CHIẾN DỊCH',
          path: ROUTES.ADMIN.MARKETING.CAMPAIGN,
          icon: 'Target'
        },
        {
          title: 'KHUYẾN MÃI',
          path: ROUTES.ADMIN.MARKETING.PROMOTION,
          icon: 'Tag'
        },
        {
          title: 'NHÀ CUNG CẤP NỔI BẬT',
          path: ROUTES.ADMIN.MARKETING.FEATURED_VENDOR,
          icon: 'Award'
        },
        {
          title: 'KHUYẾN MÃI THEO MÙA',
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
          title: 'HIỆU SUẤT',
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
          title: 'YÊU CẦU HỖ TRỢ',
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
          title: 'BLOG',
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
        <main className="flex-1 overflow-y-auto p-4 relative" ref={mainRef}>
          <Toaster />
          {children}
        </main>
        {/* Place BackToTop outside the scrollable container but still within the layout */}
        <BackToTop containerRef={mainRef} />
      </div>
    </div>
  )
}

