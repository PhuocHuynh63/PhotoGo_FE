'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LucideIcon from '@components/Atoms/LucideIcon'
import { cn } from '@helpers/CN'

export interface SidebarItem {
  title: string
  path?: string
  icon?: keyof typeof import('lucide-react')
  children?: SidebarItem[]
  isExpanded?: boolean
}

interface SidebarProps {
  items: SidebarItem[]
  isCollapsed: boolean
  toggleCollapse: () => void
}

const Sidebar = ({ items, isCollapsed, toggleCollapse }: SidebarProps) => {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const renderNavItems = (items: SidebarItem[], level = 0) => {
    return items.map((item, index) => {
      const isActive = item.path ? pathname === item.path : false
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedItems[item.title] || false

      return (
        <div key={`${item.title}-${index}`} className="w-full">
          {item.path && !hasChildren ? (
            <Link href={item.path}>
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                  isActive
                    ? 'bg-orange-100 text-orange-700'
                    : 'hover:bg-gray-100',
                  isCollapsed && 'justify-center',
                  level > 0 && 'ml-6'
                )}
              >
                {item.icon && (
                  <LucideIcon
                    name={item.icon}
                    iconSize={20}
                    iconColor={isActive ? 'var(--color-orange-700)' : 'currentColor'}
                  />
                )}
                {!isCollapsed && <span className="text-sm">{item.title}</span>}
              </div>
            </Link>
          ) : (
            <>
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md transition-colors cursor-pointer',
                  isCollapsed ? 'justify-center' : 'justify-between',
                  level > 0 && 'ml-6'
                )}
                onClick={() => !isCollapsed && hasChildren && toggleExpand(item.title)}
              >
                <div className="flex items-center gap-2">
                  {item.icon && (
                    <LucideIcon
                      name={item.icon}
                      iconSize={20}
                    />
                  )}
                  {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                </div>
                {!isCollapsed && hasChildren && (
                  <LucideIcon
                    name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                    iconSize={16}
                  />
                )}
              </div>
              {!isCollapsed && hasChildren && isExpanded && item.children && (
                <div className="mt-1 mb-1">
                  {renderNavItems(item.children, level + 1)}
                </div>
              )}
            </>
          )}
        </div>
      )
    })
  }

  return (
    <div
      className={cn(
        'h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && <span className="font-semibold"><img src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg" alt="logo"  style={{ width: '60px', height: '30px' }} /></span>}
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <LucideIcon
            name={isCollapsed ? 'PanelRightOpen' : 'PanelLeftClose'}
            iconSize={20}
          />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-2">
        {renderNavItems(items)}
      </div>
    </div>
  )
}

export default Sidebar
