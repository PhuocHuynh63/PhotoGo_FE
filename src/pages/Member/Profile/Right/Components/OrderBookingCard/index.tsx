import { IBooking } from "@models/booking/common.model";
import { IInvoice } from "@models/invoice/common.model";
import { useConcept } from "@utils/hooks/useConcept/useConcept";
import { useState } from "react";
import BookingCardSkeleton from "../OrderSkeleton";
import { Badge } from "@components/Atoms/Badge";
import { Separator } from "@components/Atoms/Seperator/Seperator";
import Button from "@components/Atoms/Button";
import { Card, CardContent } from "@components/Atoms/Card";
import { MapPin, MoreHorizontal } from "lucide-react";
import { Calendar, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/Atoms/DropdownMenu";
import Image from "next/image";
import Link from "next/link";
import { Textarea } from "@components/Atoms/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/Atoms/ui/dialog";
import { useVendor } from "@utils/hooks/useVendor/useVendor";

export default function BookingCard({ booking, invoice, isNew }: { booking: IBooking, invoice: IInvoice, isNew?: boolean }) {
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [showReportDialog, setShowReportDialog] = useState(false)
    const { concept, loading: conceptLoading } = useConcept(booking?.serviceConceptId);
    const { vendor, loading: vendorLoading } = useVendor(invoice?.vendorId);
    if (conceptLoading || vendorLoading) {
        return <BookingCardSkeleton />;
    }

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
        <Card className={`overflow-hidden ${isNew ? 'ring-2 ring-orange-400 scale-[1.01] transition-all duration-300 animate-new-pulse shadow-orange border-orange-400 border-2 animate-spin' : ''}`}>
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
                                    <div className="text-lg font-bold text-orange-600">{formatPrice(invoice.remainingAmount)}</div>
                                    <div className="text-sm font-bold line-through text-gray-500">{formatPrice(invoice.payablePrice)}</div>
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
                        <Link href={`/profile/orders/${booking.id}`}>
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