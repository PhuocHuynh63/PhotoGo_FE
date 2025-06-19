"use client"

import Button from "@components/Atoms/Button";
import { Card, CardContent } from "@components/Atoms/Card";
import { Badge, Calendar, Clock, MapPin, MoreHorizontal } from "lucide-react";
import Input from "@components/Atoms/Input";
import { Tabs, TabsList, TabsTrigger } from "@components/Molecules/Tabs";
import { useState } from "react";
import Image from "next/image";
import { Separator } from "@components/Atoms/Seperator/Seperator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/Molecules/Dialog";
import { Textarea } from "@components/Atoms/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/Atoms/ui/dropdown-menu";
import Link from "next/link";
import { IPagination } from "@models/metadata";
import { useConcept } from "@utils/hooks/useConcept/useConcept";
import Pagination from "@components/Organisms/Pagination/Pagination";
import { useRouter } from "next/navigation";
import { useVendor } from "@utils/hooks/useVendor/useVendor";
import { IInvoice } from "@models/invoice/common.model";
import { useBooking } from "@utils/hooks/useBooking";
import { IBooking } from "@models/booking/common.model";


interface OrdersContentProps {
    invoices: IInvoice[];
    pagination: IPagination;
}

const OrdersContent = ({ invoices, pagination }: OrdersContentProps) => {
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter();
    const { bookings, loading } = useBooking(invoices);
    const handlePageChange = (page: number) => {
        router.push(`?page=${page}`);
    };

    // Filter bookings based on active tab and search query
    const filteredBookings = bookings.filter((booking) => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "upcoming" && booking.status === "chờ xử lý") ||
            (activeTab === "pending" && booking.status === "chờ thanh toán") ||
            (activeTab === "completed" && booking.status === "đã hoàn thành") ||
            (activeTab === "cancelled" && booking.status === "đã hủy")

        const matchesSearch =
            booking?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking?.email?.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesTab && matchesSearch
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Quản lý đơn hàng chụp ảnh</h1>
                <Input
                    icon="Search"
                    placeholder="Tìm kiếm đơn hàng theo tên, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[300px]"
                />
            </div>

            <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 gap-2 bg-orange-100 p-1 rounded-xl max-w-xl mx-auto mb-6">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="upcoming">Chờ xử lý</TabsTrigger>
                    <TabsTrigger value="pending">Chờ thanh toán</TabsTrigger>
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
                <>
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking as unknown as IBooking & { invoice: IInvoice } } />
                        ))}
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Pagination
                            total={pagination.totalPage}
                            current={pagination.current}
                            onChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

function BookingCard({ booking }: { booking: IBooking & { invoice: IInvoice } }) {
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [showReportDialog, setShowReportDialog] = useState(false)
    const { concept, loading: conceptLoading } = useConcept(booking.serviceConceptId);
    const { vendor, loading: vendorLoading } = useVendor(booking.vendorId);
    // Format price to VND
    const formatPrice = (price: number | string) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(price)).replace("₫", "đ")
    }
    // Get status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "chờ xử lý":
                return <Badge className="text-blue-500 border-blue-200">Chờ xử lý</Badge>
            case "đã hoàn thành":
                return <Badge className="text-green-500 border-green-200">Hoàn thành</Badge>
            case "đã hủy":
                return (
                    <Badge className="text-red-500 border-red-200">
                        Đã hủy
                    </Badge>
                )
            case "đã xác nhận":
                return <Badge className="text-yellow-500 border-yellow-200">Đã xác nhận</Badge>
            case "chờ thanh toán":
                return <Badge className="text-orange-500 border-orange-200">Chờ thanh toán</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/3 h-48 md:h-auto">
                    <Image
                        src={concept?.images?.[0]?.imageUrl || "/placeholder.svg"}
                        alt={`Booking ${concept?.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={true}
                        loading="eager"
                        className="object-cover"
                    />
                </div>
                <CardContent className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row justify-between p-3">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {conceptLoading ? (
                                    "Đang tải..."
                                ) : concept ? (
                                    concept.name
                                ) : (
                                    `Đơn hàng #${booking.id}`
                                )}
                                {getStatusBadge(booking.status)}
                            </h3>
                            <div className="flex items-center mt-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                <p className="text-sm">
                                    {vendorLoading ? (
                                        "Đang tải..."
                                    ) : vendor ? (
                                        vendor.name
                                    ) : (
                                        "Không tìm thấy thông tin studio"
                                    )}
                                </p>
                            </div>
                            {vendor && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {vendor.locations[0]?.address || "Chưa có địa chỉ"}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span className="text-sm">{booking.date}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span className="text-sm">{booking.time}</span>
                                </div>
                            </div>
                            {concept && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {concept.description || "Không có mô tả"}
                                </p>
                            )}
                        </div>

                        <div className="mt-4 md:mt-0 text-right">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="text-lg font-bold text-orange-600">{formatPrice(booking.invoice.remainingAmount)}</div>
                                    <div className="text-sm font-bold line-through text-gray-500">{formatPrice(booking.invoice.originalPrice)}</div>
                                </div>
                                {/* {booking.invoice.discountAmount > 0 && (
                                    <div>
                                        <div className="text-sm text-muted-foreground">Giảm giá:</div>
                                        <div className="text-green-600">-{formatPrice(booking.invoice.discountAmount)}</div>
                                    </div>
                                )}
                                <div>
                                    <div className="text-sm text-muted-foreground">Thuế (VAT):</div>
                                    <div>{formatPrice(booking.invoice.taxAmount)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Đã đặt cọc:</div>
                                    <div className="text-blue-600">{formatPrice(booking.invoice.depositAmount)}</div>
                                </div> */}
                            </div>
                            <div className="text-xs text-muted-foreground mt-4">Loại: {booking.sourceType}</div>
                            {concept && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    Thời gian: {concept.duration} phút
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex flex-wrap gap-2 justify-end">
                        <Link href={`/order/${booking.id}`}>
                            <Button>Xem chi tiết</Button>
                        </Link>

                        {booking.status === "chờ xử lý" && (
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
