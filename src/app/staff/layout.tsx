'use client'

import { useState, useEffect } from 'react'
import AdminStaffHeader from '@components/Organisms/AdminStaffHeader'
import Sidebar, { SidebarItem } from '@components/Organisms/Sidebar'
import { ROUTES } from '@routes'
import { Toaster } from 'react-hot-toast'

export default function StaffLayout({
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

  const staffNavItems: SidebarItem[] = [
    {
      title: 'TRANG CHỦ',
      path: ROUTES.STAFF.DASHBOARD,
      icon: 'LayoutDashboard'
    },
    {
      title: 'HỖ TRỢ',
      icon: 'HeadphonesIcon',
      children: [
        {
          title: 'YÊU CẦU HỖ TRỢ',
          path: ROUTES.STAFF.SUPPORT.TICKETS,
          icon: 'Ticket'
        },
        {
          title: 'TRÒ CHUYỆN',
          path: ROUTES.STAFF.SUPPORT.CHATS,
          icon: 'MessageSquare'
        }
      ]
    },
    {
      title: 'ĐƠN HÀNG',
      icon: 'Calendar',
      children: [
        {
          title: 'DANH SÁCH',
          path: ROUTES.STAFF.BOOKINGS.LIST,
          icon: 'List'
        }
      ]
    },
    {
      title: 'TRANH CHẤP',
      icon: 'AlertTriangle',
      children: [
        {
          title: 'DANH SÁCH',
          path: ROUTES.STAFF.DISPUTES.LIST,
          icon: 'List'
        }
      ]
    },
    {
      title: 'NHÀ CUNG CẤP',
      icon: 'Store',
      children: [
        {
          title: 'HỖ TRỢ DỊCH VỤ',
          path: ROUTES.STAFF.VENDORS.SERVICE_ASSIST,
          icon: 'HelpCircle'
        }
      ]
    },
    {
      title: 'HỖ TRỢ TÀI CHÍNH',
      icon: 'DollarSign',
      children: [
        {
          title: 'VẤN ĐỀ THANH TOÁN',
          path: ROUTES.STAFF.FINANCE.PAYMENT_ISSUES,
          icon: 'AlertCircle'
        },
        {
          title: 'XÁC NHẬN ĐẶT CỌC',
          path: ROUTES.STAFF.FINANCE.DEPOSIT_CONFIRM,
          icon: 'CheckCircle'
        },
        {
          title: 'QUY TRÌNH HOÀN TIỀN',
          path: ROUTES.STAFF.FINANCE.REFUND_PROCESS,
          icon: 'RefreshCcw'
        }
      ]
    },
    {
      title: 'HỖ TRỢ CHIẾN DỊCH',
      icon: 'Tag',
      children: [
        {
          title: 'PHÂN BỔ VOUCHER',
          path: ROUTES.STAFF.PROMOTION.VOUCHER_ASSIGN,
          icon: 'Gift'
        },
        {
          title: 'THEO DÕI CHIẾN DỊCH',
          path: ROUTES.STAFF.PROMOTION.CAMPAIGN_TRACKING,
          icon: 'Target'
        }
      ]
    },
    {
      title: 'HỖ TRỢ NỘI DUNG',
      icon: 'FileText',
      children: [
        {
          title: 'BLOG',
          path: ROUTES.STAFF.CONTENT.BLOG,
          icon: 'BookOpen'
        }
      ]
    }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        items={staffNavItems}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminStaffHeader userRole="staff" userName="Staff User" />
        <main className="flex-1 overflow-y-auto p-4">
          <Toaster />
          {children}
        </main>
      </div>
    </div>
  )
}
