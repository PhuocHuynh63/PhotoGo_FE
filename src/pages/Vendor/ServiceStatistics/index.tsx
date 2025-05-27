"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Badge } from "@/components/Atoms/ui/badge"
import { Progress } from "@/components/Atoms/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Package, MapPin, DollarSign, Calendar } from "lucide-react"

interface Service {
    id: string
    name: string
    description: string
    category: string
    isActive: boolean
    basePrice: number
    duration: number
    packages: any[]
    availableBranches: string[]
}

interface Branch {
    id: string
    name: string
    address: string
    phone: string
    email: string
    manager: string
    isActive: boolean
    openingHours: {
        weekdays: string
        weekend: string
    }
    facilities: string[]
    services: string[]
    monthlyRevenue: number
    totalBookings: number
}

interface ServiceStatsProps {
    services: Service[]
    branches: Branch[]
}

const mockData =
{
    services: [
        {
            id: "srv1",
            name: "Chụp ảnh cưới",
            description: "Dịch vụ chụp ảnh cưới chuyên nghiệp với nhiều gói lựa chọn",
            category: "Cưới hỏi",
            isActive: true,
            basePrice: 5000000,
            duration: 180, // phút
            packages: [
                {
                    id: "pkg1",
                    name: "Gói Cơ Bản",
                    price: 4500000,
                    description: "Chụp trong studio, 2 bộ trang phục, album 20x30cm",
                    features: [
                        "Chụp trong studio 2-3 tiếng",
                        "2 bộ trang phục cô dâu",
                        "Trang điểm cơ bản",
                        "Album 20x30cm (30 trang)",
                        "File ảnh gốc (50 ảnh)",
                    ],
                    isActive: true,
                },
                {
                    id: "pkg2",
                    name: "Gói Tiêu Chuẩn",
                    price: 7500000,
                    description: "Studio + ngoại cảnh, 3 bộ trang phục, album cao cấp",
                    features: [
                        "Chụp studio + 1 địa điểm ngoại cảnh",
                        "3 bộ trang phục cô dâu",
                        "Trang điểm chuyên nghiệp",
                        "Album 25x35cm (50 trang)",
                        "File ảnh gốc (100 ảnh)",
                        "Video highlight 2-3 phút",
                    ],
                    isActive: true,
                },
                {
                    id: "pkg3",
                    name: "Gói Cao Cấp",
                    price: 12000000,
                    description: "Trọn gói luxury với nhiều địa điểm và dịch vụ cao cấp",
                    features: [
                        "Chụp studio + 2 địa điểm ngoại cảnh",
                        "5 bộ trang phục cô dâu",
                        "Trang điểm + làm tóc chuyên nghiệp",
                        "Album 30x40cm (80 trang)",
                        "File ảnh gốc (200 ảnh)",
                        "Video cinematic 5-7 phút",
                        "Xe hoa trang trí",
                    ],
                    isActive: true,
                },
            ],
            availableBranches: ["branch1", "branch2", "branch3"],
        },
        {
            id: "srv2",
            name: "Chụp ảnh gia đình",
            description: "Lưu giữ những khoảnh khắc đẹp của gia đình bạn",
            category: "Gia đình",
            isActive: true,
            basePrice: 2000000,
            duration: 120,
            packages: [
                {
                    id: "pkg4",
                    name: "Gói Studio",
                    price: 2500000,
                    description: "Chụp gia đình trong studio với nhiều concept",
                    features: [
                        "Chụp trong studio 2 tiếng",
                        "3-4 concept khác nhau",
                        "Trang điểm nhẹ cho người lớn",
                        "Album 20x25cm (30 trang)",
                        "File ảnh gốc (40 ảnh)",
                    ],
                    isActive: true,
                },
                {
                    id: "pkg5",
                    name: "Gói Ngoại Cảnh",
                    price: 3500000,
                    description: "Chụp gia đình tại công viên hoặc địa điểm yêu thích",
                    features: [
                        "Chụp tại 1 địa điểm ngoại cảnh",
                        "Thời gian chụp 2-3 tiếng",
                        "Trang điểm nhẹ",
                        "Album 25x30cm (40 trang)",
                        "File ảnh gốc (60 ảnh)",
                        "Video ngắn 1-2 phút",
                    ],
                    isActive: true,
                },
            ],
            availableBranches: ["branch1", "branch2"],
        },
        {
            id: "srv3",
            name: "Chụp ảnh sản phẩm",
            description: "Dịch vụ chụp ảnh sản phẩm chuyên nghiệp cho thương mại",
            category: "Thương mại",
            isActive: true,
            basePrice: 100000,
            duration: 30,
            packages: [
                {
                    id: "pkg6",
                    name: "Gói Cơ Bản",
                    price: 150000,
                    description: "Chụp sản phẩm với background trắng cơ bản",
                    features: ["Background trắng", "5 góc chụp/sản phẩm", "Chỉnh sửa cơ bản", "File JPG chất lượng cao"],
                    isActive: true,
                },
                {
                    id: "pkg7",
                    name: "Gói Cao Cấp",
                    price: 300000,
                    description: "Chụp sản phẩm với nhiều background và góc độ",
                    features: [
                        "3 loại background khác nhau",
                        "10 góc chụp/sản phẩm",
                        "Chỉnh sửa chuyên nghiệp",
                        "File JPG + PNG",
                        "Hiệu ứng đặc biệt",
                    ],
                    isActive: true,
                },
            ],
            availableBranches: ["branch1", "branch3"],
        },
        {
            id: "srv4",
            name: "Chụp ảnh sự kiện",
            description: "Ghi lại những khoảnh khắc đáng nhớ trong sự kiện của bạn",
            category: "Sự kiện",
            isActive: true,
            basePrice: 3000000,
            duration: 240,
            packages: [
                {
                    id: "pkg8",
                    name: "Gói Nửa Ngày",
                    price: 4000000,
                    description: "Chụp sự kiện trong 4 tiếng",
                    features: [
                        "1 photographer chính",
                        "Chụp 4 tiếng liên tục",
                        "File ảnh gốc (200 ảnh)",
                        "Chỉnh sửa cơ bản",
                        "Giao file trong 3 ngày",
                    ],
                    isActive: true,
                },
                {
                    id: "pkg9",
                    name: "Gói Cả Ngày",
                    price: 7000000,
                    description: "Chụp sự kiện cả ngày với team photographer",
                    features: [
                        "2 photographer",
                        "Chụp 8 tiếng",
                        "File ảnh gốc (500 ảnh)",
                        "Chỉnh sửa chuyên nghiệp",
                        "Video highlight 3-5 phút",
                        "Album kỷ niệm",
                        "Giao file trong 5 ngày",
                    ],
                    isActive: true,
                },
            ],
            availableBranches: ["branch1", "branch2", "branch3"],
        },
        {
            id: "srv5",
            name: "Chụp ảnh thời trang",
            description: "Dịch vụ chụp ảnh thời trang chuyên nghiệp cho model và brand",
            category: "Thời trang",
            isActive: false,
            basePrice: 5000000,
            duration: 300,
            packages: [
                {
                    id: "pkg10",
                    name: "Gói Lookbook",
                    price: 8000000,
                    description: "Chụp lookbook cho thương hiệu thời trang",
                    features: [
                        "1 model chuyên nghiệp",
                        "Makeup artist",
                        "5 bộ trang phục",
                        "Studio + 1 địa điểm ngoại cảnh",
                        "File ảnh chất lượng cao (100 ảnh)",
                        "Chỉnh sửa chuyên nghiệp",
                    ],
                    isActive: false,
                },
            ],
            availableBranches: ["branch1"],
        },
    ],
    branches: [
        {
            id: "branch1",
            name: "Chi nhánh Quận 1",
            address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
            phone: "028 3822 1234",
            email: "quan1@anhduongstudio.com",
            manager: "Nguyễn Văn A",
            isActive: true,
            openingHours: {
                weekdays: "08:00 - 18:00",
                weekend: "08:00 - 20:00",
            },
            facilities: [
                "Studio chụp ảnh cưới 200m²",
                "Phòng trang điểm riêng",
                "Kho trang phục 500+ bộ",
                "Thiết bị chụp ảnh hiện đại",
                "Phòng nghỉ cho khách hàng",
            ],
            services: ["srv1", "srv2", "srv3", "srv4", "srv5"],
            monthlyRevenue: 450000000,
            totalBookings: 85,
        },
        {
            id: "branch2",
            name: "Chi nhánh Quận 7",
            address: "456 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM",
            phone: "028 3777 5678",
            email: "quan7@anhduongstudio.com",
            manager: "Trần Thị B",
            isActive: true,
            openingHours: {
                weekdays: "08:00 - 18:00",
                weekend: "08:00 - 20:00",
            },
            facilities: [
                "Studio chụp ảnh gia đình 150m²",
                "Khu vực chụp ảnh trẻ em",
                "Phòng trang điểm",
                "Kho props đa dạng",
                "Bãi đỗ xe rộng rãi",
            ],
            services: ["srv1", "srv2", "srv4"],
            monthlyRevenue: 320000000,
            totalBookings: 62,
        },
        {
            id: "branch3",
            name: "Chi nhánh Thủ Đức",
            address: "789 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP.HCM",
            phone: "028 3896 9012",
            email: "thuduc@anhduongstudio.com",
            manager: "Lê Văn C",
            isActive: true,
            openingHours: {
                weekdays: "08:00 - 18:00",
                weekend: "08:00 - 20:00",
            },
            facilities: [
                "Studio sản phẩm chuyên nghiệp",
                "Phòng chụp ảnh 360°",
                "Kho background đa dạng",
                "Thiết bị ánh sáng cao cấp",
                "Phòng hậu kỳ riêng",
            ],
            services: ["srv1", "srv3", "srv4"],
            monthlyRevenue: 280000000,
            totalBookings: 48,
        },
    ],
}

export default function ServiceStats({ services, branches }: ServiceStatsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Thống kê tổng quan
    const totalServices = mockData.services?.length
    const activeServices = mockData.services?.filter((s) => s.isActive).length
    const totalBranches = mockData.branches?.length
    const activeBranches = mockData.branches?.filter((b) => b.isActive).length
    const totalRevenue = mockData.branches?.reduce((sum, branch) => sum + branch.monthlyRevenue, 0)
    const totalBookings = mockData.branches?.reduce((sum, branch) => sum + branch.totalBookings, 0)

    // Thống kê theo danh mục
    const categoryStats = mockData.services?.reduce(
        (acc, service) => {
            const category = service.category
            if (!acc[category]) {
                acc[category] = { count: 0, active: 0 }
            }
            acc[category].count++
            if (service.isActive) acc[category].active++
            return acc
        },
        {} as Record<string, { count: number; active: number }>,
    )

    const categoryData = Object.entries(categoryStats)?.map(([category, stats]) => ({
        category,
        total: stats.count,
        active: stats.active,
        percentage: Math.round((stats.active / stats.count) * 100),
    }))

    // Thống kê doanh thu theo chi nhánh
    const branchRevenueData = mockData.branches?.map((branch) => ({
        name: branch.name.replace("Chi nhánh ", ""),
        revenue: branch.monthlyRevenue,
        bookings: branch.totalBookings,
    }))

    // Thống kê giá dịch vụ
    const priceRanges = [
        { range: "< 2M", count: 0, color: "#8884d8" },
        { range: "2M - 5M", count: 0, color: "#82ca9d" },
        { range: "5M - 10M", count: 0, color: "#ffc658" },
        { range: "> 10M", count: 0, color: "#ff7300" },
    ]

    mockData.services?.forEach((service) => {
        if (service.basePrice < 2000000) priceRanges[0].count++
        else if (service.basePrice < 5000000) priceRanges[1].count++
        else if (service.basePrice < 10000000) priceRanges[2].count++
        else priceRanges[3].count++
    })

    return (
        <div className="space-y-4">
            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Tổng dịch vụ</p>
                                <p className="text-2xl font-bold">{totalServices}</p>
                                <p className="text-xs text-green-600">{activeServices} đang hoạt động</p>
                            </div>
                            <Package className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Tổng chi nhánh</p>
                                <p className="text-2xl font-bold">{totalBranches}</p>
                                <p className="text-xs text-green-600">{activeBranches} đang hoạt động</p>
                            </div>
                            <MapPin className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Doanh thu tháng</p>
                                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                                <p className="text-xs text-blue-600">Tất cả chi nhánh</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Tổng lịch hẹn</p>
                                <p className="text-2xl font-bold">{totalBookings}</p>
                                <p className="text-xs text-orange-600">Trong tháng này</p>
                            </div>
                            <Calendar className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Thống kê theo danh mục */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dịch vụ theo danh mục</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {categoryData.map((item) => (
                                <div key={item.category} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{item.category}</span>
                                        <Badge variant="outline">
                                            {item.active}/{item.total}
                                        </Badge>
                                    </div>
                                    <Progress value={item.percentage} className="h-2" />
                                    <p className="text-xs text-gray-500">{item.percentage}% đang hoạt động</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Phân bố giá dịch vụ */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bố giá dịch vụ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={priceRanges}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ range, count }) => `${range}: ${count}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {priceRanges.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Doanh thu theo chi nhánh */}
            <Card>
                <CardHeader>
                    <CardTitle>Doanh thu theo chi nhánh</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={branchRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === "revenue" ? formatCurrency(value as number) : value,
                                        name === "revenue" ? "Doanh thu" : "Lịch hẹn",
                                    ]}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" name="revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Chi tiết chi nhánh */}
            <Card>
                <CardHeader>
                    <CardTitle>Chi tiết hoạt động chi nhánh</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Chi nhánh</th>
                                    <th className="text-left py-2">Quản lý</th>
                                    <th className="text-left py-2">Dịch vụ</th>
                                    <th className="text-right py-2">Doanh thu</th>
                                    <th className="text-right py-2">Lịch hẹn</th>
                                    <th className="text-center py-2">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockData.branches?.map((branch) => (
                                    <tr key={branch.id} className="border-b">
                                        <td className="py-3">
                                            <div>
                                                <p className="font-medium">{branch.name}</p>
                                                <p className="text-xs text-gray-500">{branch.address.split(",")[0]}</p>
                                            </div>
                                        </td>
                                        <td className="py-3">{branch.manager}</td>
                                        <td className="py-3">{branch.services.length} dịch vụ</td>
                                        <td className="py-3 text-right font-medium">{formatCurrency(branch.monthlyRevenue)}</td>
                                        <td className="py-3 text-right">{branch.totalBookings}</td>
                                        <td className="py-3 text-center">
                                            <Badge className={branch.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                {branch.isActive ? "Hoạt động" : "Tạm dừng"}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
