"use client"

import { useState, useCallback, useMemo } from "react"
import { GenericManagement } from "@/components/Templates/Generic/generic"
import { GenericFilterSection, type FilterConfig } from "@/components/Organisms/Filter/generic-filter"
import { useToast } from "@/components/Atoms/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Atoms/ui/avatar"
import { Button } from "@/components/Atoms/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Atoms/ui/dropdown-menu"
import { Eye, Edit, Lock, MoreVertical, Mail, Facebook } from "lucide-react"
import { BadgeWrapper } from "@/components/Atoms/Badge/BadgeWrapper"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select"
import { RangeSlider as Slider } from "@/components/Atoms/Slider/range-slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Atoms/ui/popover"
import { MonthYearPicker } from "@/components/Atoms/ui/month-year-picker"
import { cn } from "@utils/helpers/CN"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"
import { DateMonthYear, formatRelativeTime } from "@utils/helpers/Date"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { Column } from "@components/Organisms/Table/data-table"
import { Trophy, ArrowUpRight } from "lucide-react"
import SummaryCardGroup from "@components/Organisms/SummaryCardGroup"
import AddUserDialog from "@pages/Admin/UserManagement/Dialog"
import { UserPlus } from "lucide-react"
const userRankStats = [
  {
    title: "Hạng Đồng",
    icon: <Trophy className="h-4 w-4 text-[#cd7f32]" />,
    value: "1,250",
    change: "+5.3%",
    changeColor: "text-emerald-500",
    changeIcon: <ArrowUpRight className="mr-1 h-4 w-4" />,
  },
  {
    title: "Hạng Bạc",
    icon: <Trophy className="h-4 w-4 text-[#C0C0C0]" />,
    value: "980",
    change: "+3.1%",
    changeColor: "text-emerald-500",
    changeIcon: <ArrowUpRight className="mr-1 h-4 w-4" />,
  },
  {
    title: "Hạng Vàng",
    icon: <Trophy className="h-4 w-4 text-[#FFD700]" />,
    value: "720",
    change: "+6.4%",
    changeColor: "text-emerald-500",
    changeIcon: <ArrowUpRight className="mr-1 h-4 w-4" />,
  },
  {
    title: "Hạng Bạch Kim",
    icon: <Trophy className="h-4 w-4 text-[bg-[#d0f0f5]]" />,
    value: "412",
    change: "+2.8%",
    changeColor: "text-emerald-500",
    changeIcon: <ArrowUpRight className="mr-1 h-4 w-4" />,
  },
]


// Định nghĩa kiểu dữ liệu cho user
export interface User {
  id: string
  avatar: string | null
  fullName: string
  email: string
  phoneNumber: string
  status: string
  rank: string
  auth: string
  createdAt: string
  bookingCount: number
  subscription: string | null
  totalSpent: number
  lastActive: string
  note?: string | null
}

// Định nghĩa kiểu dữ liệu cho filter
interface UserFilterValues {
  search?: string
  status?: string
  loginMethod?: string
  rank?: string
  subscription?: string
  bookingRange?: [number, number]
  spendingRange?: [number, number]
  createdAtFromMonth?: Date
  createdAtToMonth?: Date
  bookingCount?: string
}

export default function UserManagementListPage() {
  const { toast } = useToast()
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      avatar: "/placeholder.svg?height=40&width=40",
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phoneNumber: "0912345678",
      status: "active",
      rank: "gold",
      auth: "google",
      createdAt: "2023-05-15T08:30:00Z",
      bookingCount: 12,
      subscription: "premium",
      totalSpent: 4500000,
      lastActive: "2023-10-20T14:45:00Z",
    },
    {
      id: "2",
      avatar: "/placeholder.svg?height=40&width=40",
      fullName: "Trần Thị B",
      email: "tranthib@example.com",
      phoneNumber: "0923456789",
      status: "active",
      rank: "silver",
      auth: "facebook",
      createdAt: "2023-06-20T10:15:00Z",
      bookingCount: 8,
      subscription: "pro",
      totalSpent: 3200000,
      lastActive: "2023-10-18T09:30:00Z",
    },
    {
      id: "3",
      avatar: "/placeholder.svg?height=40&width=40",
      fullName: "Lê Văn C",
      email: "levanc@example.com",
      phoneNumber: "0934567890",
      status: "inactive",
      rank: "bronze",
      auth: "local",
      createdAt: "2023-04-10T14:20:00Z",
      bookingCount: 3,
      subscription: "free",
      totalSpent: 850000,
      lastActive: "2023-09-05T16:45:00Z",
    },
    {
      id: "4",
      avatar: "/placeholder.svg?height=40&width=40",
      fullName: "Phạm Thị D",
      email: "phamthid@example.com",
      phoneNumber: "0945678901",
      status: "active",
      rank: "platinum",
      auth: "google",
      createdAt: "2023-02-25T11:40:00Z",
      bookingCount: 20,
      subscription: "premium",
      totalSpent: 7800000,
      lastActive: "2023-10-22T13:15:00Z",
    },
    {
      id: "5",
      avatar: "/placeholder.svg?height=40&width=40",
      fullName: "Hoàng Văn E",
      email: "hoangvane@example.com",
      phoneNumber: "0956789012",
      status: "active",
      rank: "diamond",
      auth: "facebook",
      createdAt: "2023-03-15T09:10:00Z",
      bookingCount: 15,
      subscription: "pro",
      totalSpent: 5600000,
      lastActive: "2023-10-21T10:20:00Z",
    },
  ])

  const [filterValues, setFilterValues] = useState<UserFilterValues>({
    status: "all",
    loginMethod: "all",
    rank: "all",
    subscription: "all",
    bookingRange: [0, 100],
    spendingRange: [0, 8000000],
  })

  // Xử lý khi filter thay đổi
  const handleFilterChange = useCallback(
    (values: UserFilterValues) => {
      setFilterValues(values)
      console.log("Filter values:", values)

      // Giả lập gọi API
      toast({
        title: "Đã áp dụng bộ lọc",
        description: "Dữ liệu đã được cập nhật theo bộ lọc mới",
      })
    },
    [toast],
  )

  // Xử lý các hành động trên người dùng
  const handleViewDetails = useCallback(
    (user: User) => {
      toast({
        title: "Xem chi tiết người dùng",
        description: `Đang xem chi tiết người dùng: ${user.fullName}`,
      })
    },
    [toast],
  )

  const handleEdit = useCallback(
    (user: User) => {
      toast({
        title: "Chỉnh sửa người dùng",
        description: `Đang chỉnh sửa người dùng: ${user.fullName}`,
      })
    },
    [toast],
  )

  const handleLock = useCallback(
    (user: User) => {
      toast({
        title: "Khóa tài khoản",
        description: `Đã khóa tài khoản của người dùng: ${user.fullName}`,
      })
    },
    [toast],
  )

  // Xử lý thêm người dùng mới
  const handleAddUser = useCallback((userData: Partial<User>) => {
    // Thêm người dùng mới vào danh sách
    const newUser: User = {
      id: `${users.length + 1}`,
      avatar: userData.avatar || null,
      fullName: userData.fullName || '',
      email: userData.email || '',
      phoneNumber: userData.phoneNumber || '',
      status: userData.status || 'inactive',
      rank: userData.rank || 'bronze',
      auth: userData.auth || 'local',
      createdAt: new Date().toISOString(),
      bookingCount: 0,
      subscription: userData.subscription || null,
      totalSpent: 0,
      lastActive: new Date().toISOString(),
      note: userData.note || null
    }

    setUsers(prevUsers => [newUser, ...prevUsers])
    toast({
      title: 'Thành công',
      description: `Đã thêm người dùng ${newUser.fullName}`,
      variant: 'default',
    })

    // Đóng dialog
    setAddUserDialogOpen(false)
  }, [users, toast, setAddUserDialogOpen])
  // Định nghĩa các cột cho bảng
  const columns = useMemo<Column<User>[]>(
    () => [
      {
        id: "index",
        header: "STT",
        cell: (_, index) => <span className="font-medium">{index + 1}</span>,
        className: "w-[50px]",
      },
      {
        id: "avatar",
        header: "Ảnh",
        cell: (user) => (
          <Avatar>
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
        ),
        className: "w-[60px]",
      },
      {
        id: "fullName",
        header: "Họ tên",
        cell: (user) => user.fullName,
      },
      {
        id: "email",
        header: "Email",
        cell: (user) => user.email,
      },
      {
        id: "phoneNumber",
        header: "Số điện thoại",
        cell: (user) => user.phoneNumber,
      },
      {
        id: "status",
        header: "Trạng thái",
        cell: (user) => <BadgeWrapper type="status" value={user.status as any} />,
      },
      {
        id: "rank",
        header: "Hạng",
        cell: (user) => <BadgeWrapper type="rank" value={user.rank as any} />,
      },
      {
        id: "auth",
        header: "Đăng nhập",
        cell: (user) => {
          const getAuthIcon = (auth: string) => {
            switch (auth) {
              case "google":
                return <Mail className="h-3 w-3" />
              case "facebook":
                return <Facebook className="h-3 w-3" />
              default:
                return <Mail className="h-3 w-3" />
            }
          }
          return <BadgeWrapper type="auth" value={user.auth as any} icon={getAuthIcon(user.auth)} />
        },
      },
      {
        id: "createdAt",
        header: "Ngày tạo",
        cell: (user) => DateMonthYear(user.createdAt),
      },
      {
        id: "bookingCount",
        header: "Số booking",
        cell: (user) => user.bookingCount,
        className: "text-right",
      },
      {
        id: "subscription",
        header: "Gói dịch vụ",
        cell: (user) => <BadgeWrapper type="subscription" value={user.subscription as any} />,
      },
      {
        id: "totalSpent",
        header: "Tổng chi tiêu",
        cell: (user) => formatPrice(user.totalSpent),
        className: "text-right",
      },
      {
        id: "lastActive",
        header: "Hoạt động gần nhất",
        cell: (user) => formatRelativeTime(user.lastActive),
      },
      {
        id: "actions",
        header: "Hành động",
        cell: (user) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Xem chi tiết</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(user)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Chỉnh sửa</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLock(user)}>
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Khóa tài khoản</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        className: "text-right",
      },
    ],
    [handleViewDetails, handleEdit, handleLock],
  )

  // Định nghĩa các filter configs
  const filterConfigs: FilterConfig[] = [
    {
      id: "status",
      type: "select",
      label: "Trạng thái",
      component: (
        <Select
          value={filterValues.status || "all"}
          onValueChange={(value) => setFilterValues((prev) => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "loginMethod",
      type: "select",
      label: "Phương thức đăng nhập",
      component: (
        <Select
          value={filterValues.loginMethod || "all"}
          onValueChange={(value) => setFilterValues((prev) => ({ ...prev, loginMethod: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn phương thức đăng nhập" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "rank",
      type: "select",
      label: "Hạng người dùng",
      component: (
        <Select
          value={filterValues.rank || "all"}
          onValueChange={(value) => setFilterValues((prev) => ({ ...prev, rank: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn hạng người dùng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="bronze">Đồng</SelectItem>
            <SelectItem value="silver">Bạc</SelectItem>
            <SelectItem value="gold">Vàng</SelectItem>
            <SelectItem value="diamond">Kim cương</SelectItem>
            <SelectItem value="platinum">Bạch kim</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "subscription",
      type: "select",
      label: "Gói subscription",
      component: (
        <Select
          value={filterValues.subscription || "all"}
          onValueChange={(value) => setFilterValues((prev) => ({ ...prev, subscription: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn gói subscription" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "bookingRange",
      type: "slider",
      label: "Số lượt booking",
      component: (
        <div className="space-y-4">
          <Slider
            value={filterValues.bookingRange || [0, 100]}
            min={0}
            max={100}
            step={1}
            minStepsBetweenThumbs={0}
            onValueChange={(value) => setFilterValues((prev) => ({ ...prev, bookingRange: value as [number, number] }))}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{filterValues.bookingRange?.[0] || 0}</span>
            <span>{filterValues.bookingRange?.[1] || 100}</span>
          </div>
        </div>
      ),
    },
    {
      id: "spendingRange",
      type: "slider",
      label: "Khoảng tổng chi tiêu (VND)",
      component: (
        <div className="space-y-4">
          <Slider
            value={filterValues.spendingRange || [0, 8000000]}
            min={0}
            max={8000000}
            step={100000}
            minStepsBetweenThumbs={0}
            onValueChange={(value) =>
              setFilterValues((prev) => ({ ...prev, spendingRange: value as [number, number] }))
            }
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{new Intl.NumberFormat("vi-VN").format(filterValues.spendingRange?.[0] || 0)} đ</span>
            <span>{new Intl.NumberFormat("vi-VN").format(filterValues.spendingRange?.[1] || 8000000)} đ</span>
          </div>
        </div>
      ),
    },
    {
      id: "createdAt",
      type: "date-range",
      label: "Thời gian tạo",
      component: (
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filterValues.createdAtFromMonth && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filterValues.createdAtFromMonth
                  ? format(filterValues.createdAtFromMonth, "MM/yyyy", { locale: vi })
                  : "Từ tháng"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <MonthYearPicker
                selected={filterValues.createdAtFromMonth}
                onSelect={(date) => setFilterValues((prev) => ({ ...prev, createdAtFromMonth: date }))}
                initialFocus
                locale={vi}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filterValues.createdAtToMonth && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filterValues.createdAtToMonth
                  ? format(filterValues.createdAtToMonth, "MM/yyyy", { locale: vi })
                  : "Đến tháng"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <MonthYearPicker
                selected={filterValues.createdAtToMonth}
                onSelect={(date) => setFilterValues((prev) => ({ ...prev, createdAtToMonth: date }))}
                initialFocus
                locale={vi}
              />
            </PopoverContent>
          </Popover>
        </div>
      ),
    },
  ]

  // Tạo filter component
  const filterComponent = (
    <GenericFilterSection
      searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
      filterConfigs={filterConfigs}
      onFilterChange={handleFilterChange}
      defaultValues={filterValues}
    />
  )


  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Button
          variant="default"
          onClick={() => setAddUserDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <UserPlus className="h-5 w-5" />
          Thêm người dùng mới
        </Button>
      </div>

      <SummaryCardGroup data={userRankStats} />
      <GenericManagement
        title=""
        data={users}
        columns={columns}
        filterComponent={filterComponent}
        onFilterChange={handleFilterChange}
        keyExtractor={(user) => user.id}
        emptyStateMessage="Không có người dùng nào"
      />
      <AddUserDialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen} onAddUser={handleAddUser} />
    </div>

  )
}
