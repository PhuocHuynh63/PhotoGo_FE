import Button from "@components/Atoms/Button";
import { Card, CardContent } from "@components/Atoms/Card";
// import { PAGES } from "../../../../../types/IPages";
import { Badge, Calendar, Clock, Filter, MapPin, MoreHorizontal, Star, X } from "lucide-react";
import Input from "@components/Atoms/Input";
import { Tabs, TabsList, TabsTrigger } from "@components/Molecules/Tabs";
import { useState } from "react";
import Image from "next/image";
import { Separator } from "@components/Atoms/Seperator/Seperator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/Molecules/Dialog";
import { Textarea } from "@components/Atoms/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/Atoms/ui/dropdown-menu";
import CustomDatePicker from "@components/Atoms/DatePicker";
import StarRating from "@components/Molecules/StarRating";

const bookings = [
    {
        id: "B001",
        studioName: "Elegant Studio",
        studioLocation: "123 Photography Lane, District 1, HCMC",
        packageName: "Wedding Photoshoot Premium",
        date: "2024-05-15",
        time: "10:00 - 14:00",
        price: 5500000,
        status: "upcoming",
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1745146736/chup-anh-cuoi-sai-gon-8_hx9x36.png",
        description: "Premium wedding photoshoot package including 100 edited photos, 2 outfit changes, and 1 album.",
        photographer: "Nguyen Van A",
        rating: null,
    },
    {
        id: "B002",
        studioName: "Vintage Lens",
        studioLocation: "45 Art Street, District 3, HCMC",
        packageName: "Family Portrait Session",
        date: "2024-04-28",
        time: "15:00 - 17:00",
        price: 2800000,
        status: "upcoming",
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1745146736/studio-family-and-first-year-portrait-session_0008_vlzhzl.jpg",
        description: "Family portrait session with 50 edited photos and 1 large framed print.",
        photographer: "Tran Thi B",
        rating: null,
    },
    {
        id: "B003",
        studioName: "Natural Light Photography",
        studioLocation: "78 Garden Road, District 2, HCMC",
        packageName: "Outdoor Couple Shoot",
        date: "2024-03-10",
        time: "16:00 - 18:00",
        price: 1800000,
        status: "completed",
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1745146734/94223047_1947606018706491_7290452465198039040_o_ww54yi.jpg",
        description: "Romantic outdoor photoshoot for couples with 30 edited photos.",
        photographer: "Le Van C",
        rating: 4.5,
    },
    {
        id: "B004",
        studioName: "Modern Captures",
        studioLocation: "22 Tech Boulevard, District 7, HCMC",
        packageName: "Professional Headshots",
        date: "2024-02-20",
        time: "09:00 - 10:00",
        price: 1200000,
        status: "completed",
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1745146926/anh-4-mobile-1704096689174-1704127440096_k81sbn.webp",
        description: "Professional headshots for business profiles and resumes.",
        photographer: "Pham Thi D",
        rating: 5,
    },
    {
        id: "B005",
        studioName: "Artistic Visions",
        studioLocation: "55 Creative Avenue, District 10, HCMC",
        packageName: "Fashion Portfolio",
        date: "2024-01-15",
        time: "13:00 - 17:00",
        price: 3500000,
        status: "cancelled",
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1745146423/Screenshot_2025-04-20_175148_xoemjp.png",
        description: "Fashion portfolio shoot with 5 outfit changes and 80 edited photos.",
        photographer: "Hoang Van E",
        rating: null,
    },
]

const OrdersContent = (/*{ userOrders }: any*/) => {
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [showFilters, setShowFilters] = useState(false)

    // Filter bookings based on active tab and search query
    const filteredBookings = bookings.filter((booking) => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "upcoming" && booking.status === "upcoming") ||
            (activeTab === "completed" && booking.status === "completed") ||
            (activeTab === "cancelled" && booking.status === "cancelled")

        const matchesSearch =
            booking.studioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.packageName.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesTab && matchesSearch
    })

    return (
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Quản lý đơn hàng chụp ảnh</h1>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Input
                            icon="Search"
                            placeholder="Tìm kiếm đơn hàng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {showFilters && (
                <div className="bg-muted p-4 rounded-lg mb-6 border">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Bộ lọc</h3>
                        <Button variant="ghost" onClick={() => setShowFilters(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Khoảng giá</label>
                            <div className="flex items-center gap-2">
                                <Input placeholder="Từ" type="number" className="w-full" />
                                <span>-</span>
                                <Input placeholder="Đến" type="number" className="w-full" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Thời gian</label>
                            <CustomDatePicker value={new Date()} onChange={() => { }} />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Studio</label>
                            <Input placeholder="Tên studio" className="w-full" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button variant="outline" className="mr-2">
                            Đặt lại
                        </Button>
                        <Button>Áp dụng</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full md:w-auto">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
                    <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
                    <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
                </TabsList>
            </Tabs>

            {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Không tìm thấy đơn hàng nào</h3>
                    <p className="text-muted-foreground">
                        {searchQuery ? `Không có kết quả cho "${searchQuery}"` : "Bạn chưa có đơn hàng nào trong danh mục này"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </div>
            )}
        </div>
    )
}

// Define the type for a booking
type Booking = {
    id: string;
    studioName: string;
    studioLocation: string;
    packageName: string;
    date: string;
    time: string;
    price: number;
    status: string;
    image: string;
    description: string;
    photographer: string;
    rating: number | null;
};

function BookingCard({ booking }: { booking: Booking }) {
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [showReportDialog, setShowReportDialog] = useState(false)
    const [showReviewDialog, setShowReviewDialog] = useState(false)
    const [rating, setRating] = useState(5)
    const [dialogOpen, setDialogOpen] = useState(false)

    // Format price to VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price).replace("₫", "đ")
    }

    // Format date to display in Vietnamese format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    // Get status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "upcoming":
                return <Badge className="text-blue-500 border-blue-200">Sắp tới</Badge>
            case "completed":
                return <Badge className="text-green-500 border-green-200">Hoàn thành</Badge>
            case "cancelled":
                return (
                    <Badge className="text-red-500 border-red-200">
                        Đã hủy
                    </Badge>
                )
            default:
                return <Badge>{status}</Badge>
        }
    }

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/3 h-48 md:h-auto">
                    <Image src={booking.image || "/placeholder.svg"} alt={booking.packageName} fill className="object-cover" />
                </div>
                <CardContent className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row justify-between p-3">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">{booking.packageName}
                                {getStatusBadge(booking.status)}
                            </h3>
                            <div className="flex items-center mt-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                <p className="text-sm">{booking.studioName}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{booking.studioLocation}</p>

                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span className="text-sm">{formatDate(booking.date)}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span className="text-sm">{booking.time}</span>
                                </div>
                            </div>

                            {booking.status === "completed" && booking.rating && (
                                <div className="flex items-center mt-2">
                                    <div className="flex">
                                        <StarRating
                                            stars={booking.rating}
                                        />
                                    </div>
                                    <span className="text-sm ml-1">{booking.rating}/5</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 md:mt-0 text-right">
                            <div className="text-lg font-bold">{formatPrice(booking.price)}</div>
                            <div className="text-xs text-muted-foreground mt-1">Mã đơn: {booking.id}</div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex flex-wrap gap-2 justify-end">
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Xem chi tiết</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                                    <DialogDescription>Mã đơn: {booking.id}</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="relative  h-64 w-full">
                                        <Image
                                            src={booking.image || "/placeholder.svg"}
                                            alt={booking.packageName}
                                            fill
                                            className="object-scale-down rounded-md"
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">{booking.packageName}
                                        <p>{getStatusBadge(booking.status)}</p>
                                    </h3>
                                    <p className="text-sm">{booking.description}</p>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="font-medium">Studio</p>
                                            <p>{booking.studioName}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Nhiếp ảnh gia</p>
                                            <p>{booking.photographer}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Ngày chụp</p>
                                            <p>{formatDate(booking.date)}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Thời gian</p>
                                            <p>{booking.time}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Giá</p>
                                            <p className="font-bold">{formatPrice(booking.price)}</p>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {booking.status === "upcoming" && (
                            <>
                                <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                                            Hủy đơn
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Xác nhận hủy đơn</DialogTitle>
                                            <DialogDescription>
                                                Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <h4 className="font-medium mb-2">Lý do hủy đơn</h4>
                                            <Textarea placeholder="Vui lòng cho chúng tôi biết lý do bạn hủy đơn hàng này..." />
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Lưu ý: Việc hủy đơn có thể phát sinh phí tùy theo chính sách của studio.
                                            </p>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                                                Quay lại
                                            </Button>
                                            <Button variant="destructive" className="text-red-500 border-red-200 hover:bg-red-50">Xác nhận hủy</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}

                        {booking.status === "completed" && !booking.rating && (
                            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                                <DialogTrigger asChild>
                                    <Button>Đánh giá</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Đánh giá dịch vụ</DialogTitle>
                                        <DialogDescription>Hãy chia sẻ trải nghiệm của bạn về dịch vụ chụp ảnh này</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <div className="flex justify-center mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
                                                    <Star
                                                        className={`h-8 w-8 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <Textarea
                                            placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ chụp ảnh này..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                                            Hủy
                                        </Button>
                                        <Button>Gửi đánh giá</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                            <DialogTrigger asChild>
                                <Button variant="ghost">Báo cáo vấn đề</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Báo cáo vấn đề</DialogTitle>
                                    <DialogDescription>
                                        Vui lòng cho chúng tôi biết vấn đề bạn gặp phải với đơn hàng này
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <h4 className="font-medium mb-2">Loại vấn đề</h4>
                                    <select className="w-full p-2 border rounded-md mb-4">
                                        <option value="">Chọn loại vấn đề</option>
                                        <option value="quality">Chất lượng dịch vụ</option>
                                        <option value="photographer">Vấn đề với nhiếp ảnh gia</option>
                                        <option value="studio">Vấn đề với studio</option>
                                        <option value="photos">Vấn đề với ảnh</option>
                                        <option value="other">Khác</option>
                                    </select>
                                    <Textarea placeholder="Mô tả chi tiết vấn đề bạn gặp phải..." className="min-h-[100px]" />
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                                        Hủy
                                    </Button>
                                    <Button>Gửi báo cáo</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Liên hệ studio</DropdownMenuItem>
                                <DropdownMenuItem>Lưu vào bộ sưu tập</DropdownMenuItem>
                                <DropdownMenuItem>Đặt lại dịch vụ</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}
export default OrdersContent