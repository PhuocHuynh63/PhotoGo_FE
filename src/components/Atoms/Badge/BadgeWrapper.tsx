import { Badge } from "@/components/Atoms/Badge/index"
import { cn } from "@helpers/CN"
import type { ReactNode } from "react"

type BadgeType = "rank" | "status" | "subscription" | "auth"

type BadgeValue =
  | "bronze"
  | "silver"
  | "gold"
  | "diamond"
  | "platinum" // rank
  | "active"
  | "inactive" // status
  | "free"
  | "premium"
  | "pro" // subscription
  | "local"
  | "google"
  | "facebook"
  | "apple" // auth

interface BadgeWrapperProps {
  type?: BadgeType
  value?: BadgeValue
  className?: string
  children?: ReactNode
  icon?: ReactNode
  count?: number
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const badgeStyles: Record<BadgeType, Record<string, string>> = {
  rank: {
    bronze: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
    silver: "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100",
    gold: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
    diamond: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    platinum: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
  },
  status: {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    inactive: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  subscription: {
    free: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
    premium: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
    pro: "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100",
  },
  auth: {
    local: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
    google: "bg-red-50 text-red-600 border-red-100 hover:bg-red-50",
    facebook: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50",
    apple: "bg-gray-900 text-white border-gray-800 hover:bg-gray-800",
  },
}

const badgeLabels: Record<BadgeType, Record<string, string>> = {
  rank: {
    bronze: "Đồng",
    silver: "Bạc",
    gold: "Vàng",
    diamond: "Kim cương",
    platinum: "Bạch kim",
  },
  status: {
    active: "Hoạt động",
    inactive: "Không hoạt động",
  },
  subscription: {
    free: "Miễn phí",
    premium: "Premium",
    pro: "Pro",
  },
  auth: {
    local: "Email",
    google: "Google",
    facebook: "Facebook",
    apple: "Apple",
  },
}

export function BadgeWrapper({
  type,
  value,
  className,
  children,
  icon,
  count,
  variant = "outline",
}: BadgeWrapperProps) {

  if (children) {
    return (
      <Badge variant={variant} className={cn("flex items-center gap-1.5", className)}>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {count !== undefined && (
          <span className="ml-1 rounded-full bg-white bg-opacity-20 px-1.5 py-0.5 text-xs font-semibold">{count}</span>
        )}
      </Badge>
    )
  }


  if (type && value && badgeStyles[type] && badgeStyles[type][value]) {
    return (
      <Badge variant={variant} className={cn(badgeStyles[type][value], className)}>
        {badgeLabels[type][value]}
      </Badge>
    )
  }

  // Fallback nếu không có đủ thông tin
  return (
    <Badge variant={variant} className={className}>
      {children || "Badge"}
    </Badge>
  )
}
