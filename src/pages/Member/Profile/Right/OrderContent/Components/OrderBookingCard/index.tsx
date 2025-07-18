import { IBooking } from "@models/booking/common.model";
import { IInvoice } from "@models/invoice/common.model";
import { useConcept } from "@utils/hooks/useConcept/useConcept";
import { useState } from "react";
import BookingCardSkeleton from "../OrderSkeleton";
import { Badge } from "@components/Atoms/Badge";
import { Separator } from "@components/Atoms/Seperator/Seperator";
import { Button } from "@components/Atoms/ui/button";
import { Card, CardContent } from "@components/Atoms/Card";
import { MapPin, MoreHorizontal } from "lucide-react";
import { Calendar, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/Atoms/DropdownMenu";
import Image from "next/image";
import Link from "next/link";
import { Textarea } from "@components/Atoms/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/Atoms/ui/dialog";
import { useVendor } from "@utils/hooks/useVendor/useVendor";
import conceptService from "@services/concept";
import packageService from "@services/packageServices";
import { IInvoiceServiceModel } from "@models/serviceConcepts/common.model";
import { IVendor } from "@models/vendor/common.model";
import { IServiceConceptResponseModel } from "@models/serviceConcepts/response.model";
import { IServicePackageResponse } from "@models/servicePackages/response.model";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ROUTES } from "@routes";

export default function BookingCard({ booking, invoice, isNew }: { booking: IBooking, invoice: IInvoice, isNew?: boolean }) {
    const router = useRouter();
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [showReportDialog, setShowReportDialog] = useState(false)
    const vendorId = invoice?.booking?.serviceConcept?.servicePackage?.vendorId
    const { concept, loading: conceptLoading } = useConcept(booking?.serviceConceptId);
    const { vendor, loading: vendorLoading } = useVendor(vendorId);
    if (conceptLoading || vendorLoading) {
        return <BookingCardSkeleton />;
    }

    // Format price to VND
    const formatPrice = (price: number | string) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(price)).replace("₫", "đ")
    }
    // Get status badge color
    const getStatusBadge = (status: string) => {
        console.log('Status:', status);

        switch (status) {
            case "đã thanh toán":
                return <Badge variant="outline" className="text-blue-500 border-blue-200">Đã thanh toán</Badge>
            case "đã hoàn thành":
                return <Badge variant="outline" className="text-green-500 border-green-200">Hoàn thành</Badge>
            case "đã hủy":
                return <Badge variant="outline" className="text-red-500 border-red-200">Đã hủy</Badge>
            case "chờ xử lý":
                return <Badge variant="outline" className="text-yellow-500 border-yellow-200">Chờ xử lý</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    const getVendorSlug = async (serviceConceptId: string): Promise<{ slug: string, location: string } | null> => {
        try {
            // TODO: Implement API call để lấy vendor slug từ service concept ID
            // Ví dụ:
            const response = await conceptService.getAServiceConceptById(serviceConceptId) as IServiceConceptResponseModel;
            const concept = response.data as unknown as IInvoiceServiceModel;

            //get vendor slug from concept
            const servicePackage = await packageService.getPackageById(concept?.servicePackageId) as IServicePackageResponse;
            const vendor = (servicePackage?.data?.vendor ?? {}) as IVendor;
            const vendorData = {
                slug: vendor?.slug,
                location: vendor?.locations[0].district
            }
            return vendorData;
        } catch (error) {
            console.error('Error fetching vendor slug:', error);
            return null;
        }
    };

    const handleReBooking = async (item: IBooking) => {
        try {
            const vendorData = await getVendorSlug(item.serviceConceptId);

            if (!vendorData) {
                console.error('Could not get vendor slug for concept:', item.serviceConceptId);
                toast.error('Không tìm thấy nhà cung cấp');
                return;
            }

            // Navigate đến trang packages với concept ID
            router.push(`/${vendorData.slug}/packages?conceptId=${item.serviceConceptId}&location=${vendorData.location}`);
        } catch (error) {
            console.error('Error navigating to vendor detail:', error);
            toast.error('Lỗi khi xem chi tiết');
        }
    };


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


                            {invoice.booking.date && invoice.booking.time ? (
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span className="text-sm">{invoice.booking.date}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span className="text-sm">{invoice.booking.time}</span>

                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm mt-1">
                                    {invoice.booking.serviceConcept?.numberOfDays && invoice.booking.serviceConcept.numberOfDays > 1 && invoice.booking.date ? (
                                        (() => {
                                            const startDate = new Date(invoice.booking.date.split('/').reverse().join('-'));
                                            const endDate = new Date(startDate);
                                            endDate.setDate(startDate.getDate() + invoice.booking.serviceConcept.numberOfDays - 1);
                                            const formatDate = (date: Date) => {
                                                return date.toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                });
                                            };
                                            return `Thời gian thực hiện: ${formatDate(startDate)} - ${formatDate(endDate)} (${invoice.booking.serviceConcept.numberOfDays} ngày)`;
                                        })()
                                    ) : null}
                                </div>
                            )}

                            {concept && (
                                <div
                                    className="text-muted-foreground prose prose-sm max-w-none line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: concept?.description || '' }}
                                />

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
                            {invoice.booking.serviceConcept.conceptRangeType === 'một ngày' ? (
                                <div className="text-xs text-muted-foreground mt-1">
                                    {invoice.booking.serviceConcept.duration} phút
                                </div>
                            ) : (
                                <div className="text-xs text-muted-foreground mt-1">
                                    {invoice.booking.serviceConcept.numberOfDays} ngày
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex flex-wrap gap-2 justify-end">
                        <Link href={`${ROUTES.USER.PROFILE.ORDERS}/${booking.id}`}>
                            <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 hover:text-white text-white">Xem chi tiết</Button>
                        </Link>

                        {booking.status === "chờ xử lý" && invoice.payments?.[0]?.paymentOSId && (
                            <Link href={`https://pay.payos.vn/web/${invoice.payments[0].paymentOSId.trim()}`} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="bg-green-600 hover:bg-green-700 hover:text-white text-white">
                                    Thanh toán
                                </Button>
                            </Link>
                        )}

                        {booking.status === "chờ xử lý" && (
                            <>
                                <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
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
                                            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => setShowCancelDialog(false)}>
                                                Quay lại
                                            </Button>
                                            <Button variant="destructive">Xác nhận hủy</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="cursor-pointer">
                                <DropdownMenuItem className="cursor-pointer">Liên hệ studio</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Lưu vào bộ sưu tập</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => { handleReBooking(booking) }}>Đặt lại dịch vụ</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowReportDialog(true)}>Báo cáo vấn đề</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Dialog báo cáo vấn đề */}
                    <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
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
                                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => setShowReportDialog(false)}>
                                    Hủy
                                </Button>
                                <Button className="bg-orange-600 hover:bg-orange-700 text-white">Gửi báo cáo</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </div>
        </Card>
    )
}