"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@atoms/Table"
import { Avatar } from "@components/Molecules/Avatar"
import { BadgeWrapper } from "@atoms/Badge/BadgeWrapper"
import { ActionDropdown } from "@molecules/Filter/action-dropdown"
import { Button } from "@atoms/Button/Button"
import { ChevronLeft, ChevronRight, Search, UserPlus, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { SearchInput } from "@molecules/Filter/Search-input"
import { FilterField } from "@molecules/Filter/filter-field"
import { PriceRangeSlider } from "@molecules/Filter/price-range-picker"
import { StatusSelect } from "@components/Organisms/StatusSelect"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@atoms/Select/Select"

// Dữ liệu mẫu
const users = [
    {
        id: "1",
        avatar: "/placeholder.svg?height=40&width=40",
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phoneNumber: "0901234567",
        status: "active",
        rank: "gold",
        auth: "google",
        createdAt: new Date("2023-01-15"),
        bookingCount: 25,
        subscription: "premium",
        totalSpent: 12500000,
        lastActive: new Date("2023-06-10T08:30:00"),
    },
]

interface UsersTableProps {
    onView?: (id: string) => void
    onEdit?: (id: string) => void
    onToggleStatus?: (id: string, newStatus: boolean) => void
    showFilters?: boolean
}

export function UsersTable({ onView, onEdit, onToggleStatus, showFilters = true }: UsersTableProps) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const totalPages = Math.ceil(users.length / itemsPerPage)

    // Filter state
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState<string>("")
    const [rank, setRank] = useState<string>("")
    const [auth, setAuth] = useState<string>("")
    const [subscription, setSubscription] = useState<string>("")
    const [bookingRange, setBookingRange] = useState<[number, number]>([0, 100])
    const [spendingRange, setSpendingRange] = useState<[number, number]>([0, 10000000])
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
    const [toDate, setToDate] = useState<Date | undefined>(undefined)
    const [isExpanded, setIsExpanded] = useState(false)

    // Reset filters
    const resetFilters = () => {
        setSearch("")
        setStatus("")
        setRank("")
        setAuth("")
        setSubscription("")
        setBookingRange([0, 100])
        setSpendingRange([0, 10000000])
        setFromDate(undefined)
        setToDate(undefined)
    }

    // Apply filters
    const applyFilters = () => {
        console.log({
            search,
            status,
            rank,
            auth,
            subscription,
            bookingRange,
            spendingRange,
            dateRange: [fromDate, toDate],
        })
        // Thực hiện lọc dữ liệu ở đây
    }

    // User status options
    const statusOptions = [
        {
            value: "All",
            label: "Tất cả",
            icon: <span className="text-xs">✓</span>,
            className: "bg-green-500 hover:bg-green-600",
        },
        {
            value: "active",
            label: "Hoạt động",
            icon: <span className="text-xs">✓</span>,
            className: "bg-green-500 hover:bg-green-600",
        },
        {
            value: "inactive",
            label: "Không hoạt động",
            icon: <span className="text-xs">⚫</span>,
            className: "bg-red-500 hover:bg-red-600",
        },
    ]

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatLastActive = (date: Date) => {
        return formatDistanceToNow(date, { addSuffix: true, locale: vi })
    }

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 shadow-md overflow-hidden bg-white">
                {showFilters && (
                    <div className="bg-card p-4 border-b border-gray-200">
                        <div className="flex items-center flex-wrap gap-4 mb-4">
                            <div className="flex-1 min-w-[200px]">
                                <SearchInput
                                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                                    onSearch={setSearch}
                                />
                            </div>
                            <div className="w-[180px]">
                                <FilterField label="" className="mb-0">
                                    <StatusSelect
                                        value={status}
                                        onValueChange={setStatus}
                                        options={statusOptions}
                                        placeholder="Chọn trạng thái"
                                    />
                                </FilterField>
                            </div>

                            <div className="flex gap-2 ml-auto">
                                <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
                                    Bộ lọc nâng cao
                                </Button>
                            </div>
                        </div>

                        {isExpanded && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                                    <FilterField label="Hạng người dùng">
                                        <Select value={rank} onValueChange={setRank}>
                                            <SelectTrigger id="rank">
                                                <SelectValue placeholder="Chọn hạng" />
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
                                    </FilterField>

                                    <FilterField label="Phương thức đăng nhập">
                                        <Select value={auth} onValueChange={setAuth}>
                                            <SelectTrigger id="auth">
                                                <SelectValue placeholder="Chọn phương thức" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                <SelectItem value="local">Email</SelectItem>
                                                <SelectItem value="google">Google</SelectItem>
                                                <SelectItem value="facebook">Facebook</SelectItem>
                                                <SelectItem value="apple">Apple</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FilterField>

                                    <FilterField label="Gói subscription">
                                        <Select value={subscription} onValueChange={setSubscription}>
                                            <SelectTrigger id="subscription">
                                                <SelectValue placeholder="Chọn gói" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                <SelectItem value="free">Miễn phí</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                                <SelectItem value="pro">Pro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FilterField>

                                    <FilterField label="Số lượt booking">
                                        <PriceRangeSlider
                                            value={bookingRange}
                                            onChange={setBookingRange}
                                            min={0}
                                            max={100}
                                            step={1}
                                            formatValue={(val) => `${val} lượt`}
                                        />
                                    </FilterField>

                                    <FilterField label="Tổng chi tiêu">
                                        <PriceRangeSlider
                                            value={spendingRange}
                                            onChange={setSpendingRange}
                                            min={0}
                                            max={10000000}
                                            step={100000}
                                            formatValue={(val) => new Intl.NumberFormat("vi-VN").format(val) + "đ"}
                                        />
                                    </FilterField>
                                </div>

                                <div className="flex justify-end mt-4 gap-2">
                                    <Button variant="outline" onClick={resetFilters}>
                                        <X className="h-4 w-4 mr-2" />
                                        Xóa bộ lọc
                                    </Button>
                                    <Button onClick={applyFilters}>
                                        <Search className="h-4 w-4 mr-2" />
                                        Áp dụng
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100">
                            <TableHead className="w-[50px] py-4">Avatar</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Họ tên</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Email</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Số điện thoại</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Trạng thái</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Hạng</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Đăng nhập</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Ngày tạo</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Booking</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Gói</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Chi tiêu</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800">Hoạt động gần nhất</TableHead>
                            <TableHead className="py-4 font-semibold text-gray-800 text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150"
                            >
                                <TableCell className="py-3">
                                    <Avatar src={user.avatar} fallback={user.fullName} />
                                </TableCell>
                                <TableCell className="py-3 font-medium text-gray-900">{user.fullName}</TableCell>
                                <TableCell className="py-3 text-blue-600">{user.email}</TableCell>
                                <TableCell className="py-3">{user.phoneNumber}</TableCell>
                                <TableCell className="py-3">
                                    <BadgeWrapper type="status" value={user.status as any} />
                                </TableCell>
                                <TableCell className="py-3">
                                    <BadgeWrapper type="rank" value={user.rank as any} />
                                </TableCell>
                                <TableCell className="py-3">
                                    <BadgeWrapper type="auth" value={user.auth as any} />
                                </TableCell>
                                <TableCell className="py-3">{user.createdAt.toLocaleDateString("vi-VN")}</TableCell>
                                <TableCell className="py-3 font-medium">{user.bookingCount} lượt</TableCell>
                                <TableCell className="py-3">
                                    {user.subscription ? <BadgeWrapper type="subscription" value={user.subscription as any} /> : "-"}
                                </TableCell>
                                <TableCell className="py-3 font-medium text-emerald-600">{formatCurrency(user.totalSpent)}</TableCell>
                                <TableCell className="py-3 text-gray-500 italic">{formatLastActive(user.lastActive)}</TableCell>
                                <TableCell className="py-3 text-right">
                                    <ActionDropdown
                                        buttonClassName="h-8 w-8 p-0 bg-gray-50 hover:bg-gray-100 rounded-full"
                                        actions={[
                                            {
                                                label: "Chỉnh sửa",
                                                onClick: () => onEdit?.(user.id),
                                                disabled: !onEdit,
                                                className: "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                                            },
                                            {
                                                label: user.status === "active" ? "Vô hiệu hóa" : "Kích hoạt",
                                                onClick: () => onToggleStatus?.(user.id, user.status !== "active"),
                                                className: user.status === "active"
                                                    ? "text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    : "text-green-500 hover:text-green-700 hover:bg-green-50",
                                                disabled: !onToggleStatus
                                            }
                                        ]}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between py-4 px-6 border-t border-gray-200 bg-gray-50">
                        <div className="text-sm text-gray-600">
                            Hiển thị <span className="font-medium text-gray-900">1</span> đến <span className="font-medium text-gray-900">{Math.min(itemsPerPage, users.length)}</span> trong số <span className="font-medium text-gray-900">{users.length}</span> người dùng
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="border-gray-300 bg-white hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Trước
                            </Button>
                            <div className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium">
                                Trang <span className="text-blue-600">{currentPage}</span> / {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="border-gray-300 bg-white hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                Sau
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
