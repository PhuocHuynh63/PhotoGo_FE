'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LucideIcon from '@components/Atoms/LucideIcon'
import { cn } from '@helpers/CN'
import { SimpleTooltip } from '@components/Molecules/Tooltip'

export interface SidebarItem {
  title: string
  path?: string
  icon?: keyof typeof import('lucide-react')
  children?: SidebarItem[]
  isExpanded?: boolean
}

export interface SidebarProps {
  items: SidebarItem[]
  isCollapsed: boolean
  toggleCollapse: () => void
}

const Sidebar = ({ items, isCollapsed, toggleCollapse }: SidebarProps) => {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Initialize expanded items based on current path
  useEffect(() => {
    // Find which items should be expanded based on the current path
    const shouldExpandItems: Record<string, boolean> = {};

    const findActiveParent = (items: SidebarItem[]) => {
      for (const item of items) {
        if (item.children?.length) {
          // Check if any child is active
          const hasActiveChild = item.children.some(child =>
            child.path === pathname ||
            child.children?.some(grandchild => grandchild.path === pathname)
          );

          if (hasActiveChild && item.title) {
            shouldExpandItems[item.title] = true;
          }

          // Recursively check children
          findActiveParent(item.children);
        }
      }
    };

    findActiveParent(items);
    setExpandedItems(shouldExpandItems);
  }, [pathname, items]);

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const toggleDropdown = (title: string) => {
    setActiveDropdown(prev => prev === title ? null : title);
  }

  const renderNavItems = (items: SidebarItem[], level = 0) => {
    return items.map((item, index) => {
      const isActive = item.path ? pathname === item.path : false
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedItems[item.title] || false
      const isDropdownActive = activeDropdown === item.title

      // Check if any child is active
      const isChildActive = hasChildren && item.children?.some(child =>
        child.path === pathname ||
        (child.children?.some(grandchild => grandchild.path === pathname))
      )

      // Determine the path to navigate to when clicking on a parent item in collapsed mode
      const defaultChildPath = hasChildren && item.children && item.children[0].path ? item.children[0].path : item.path;

      return (
        <div key={`${item.title}-${index}`} className="w-full relative">
          {/* Simple item with no children */}
          {item.path && !hasChildren ? (
            <Link href={item.path}>
              <SimpleTooltip content={item.title} side="right" disabled={!isCollapsed}>
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                    isActive
                      ? 'bg-orange-100 text-orange-700'
                      : 'hover:bg-gray-100',
                    isCollapsed && 'justify-center',
                    level > 0 && !isCollapsed && 'ml-6'
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
              </SimpleTooltip>
            </Link>
          ) : (
            <>
              {/* Parent item with children */}
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md transition-colors cursor-pointer',
                  (isActive || isChildActive) && 'bg-orange-100 text-orange-700',
                  !isActive && !isChildActive && 'hover:bg-gray-100',
                  isCollapsed ? 'justify-center' : 'justify-between',
                  level > 0 && !isCollapsed && 'ml-6'
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
                  {item.icon && (
                    <LucideIcon
                      name={item.icon}
                      iconSize={20}
                      iconColor={(isActive || isChildActive) ? 'var(--color-orange-700)' : 'currentColor'}
                    />
                  )}
                  {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                </div>
                {!isCollapsed && hasChildren && (
                  <LucideIcon
                    name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                    iconSize={16}
                    iconColor={(isActive || isChildActive) ? 'var(--color-orange-700)' : 'currentColor'}
                  />
                )}
              </div>

              {/* Dropdown for collapsed sidebar */}
              {isCollapsed && hasChildren && isDropdownActive && (
                <div
                  className="fixed left-16 top-0 bg-white shadow-lg rounded-md py-2 z-[9999] w-56 border border-gray-200"
                  style={{ marginTop: `${index * 40 + 60}px` }}
                >
                  <div className="px-3 py-2 font-medium border-b border-gray-100 mb-1">{item.title}</div>
                  {item.children?.map((child, childIndex) => {
                    const childIsActive = child.path === pathname;
                    return (
                      <Link
                        key={`${item.title}-child-${childIndex}`}
                        href={child.path || '#'}
                        className="block"
                      >
                        <div
                          className={cn(
                            "px-4 py-2 hover:bg-gray-100 flex items-center gap-2",
                            childIsActive && "bg-orange-100 text-orange-700"
                          )}
                        >
                          {child.icon && (
                            <LucideIcon
                              name={child.icon}
                              iconSize={16}
                              iconColor={childIsActive ? 'var(--color-orange-700)' : 'currentColor'}
                            />
                          )}
                          <span className="text-sm">{child.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Expanded children for non-collapsed sidebar */}
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
        {!isCollapsed && <span className="font-semibold"><img src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg" alt="logo" style={{ width: '60px', height: '30px' }} /></span>}
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
