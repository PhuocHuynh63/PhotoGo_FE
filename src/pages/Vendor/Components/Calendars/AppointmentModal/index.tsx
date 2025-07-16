"use client"

// import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/Atoms/ui/dialog"
import { Button } from "@/components/Atoms/ui/button"
import { Badge } from "@/components/Atoms/ui/badge"
import { Separator } from "@/components/Atoms/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Atoms/ui/avatar"
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    DollarSign,
    FileText,
    Edit,
    Trash2,
    MessageSquare,
    Calendar,
    User,
    Package,
} from "lucide-react"

interface Appointment {
    id: string
    title: string
    customerName: string
    customerPhone: string
    customerEmail: string
    service: string
    package: string
    date: string
    from: string | null
    to: string | null
    status: "đã thanh toán" | "chờ xử lý" | "đã hủy"
    color: string
    notes: string
    price: number
    deposit: number
    location: string
}

interface AppointmentModalProps {
    appointment: Appointment | null
    isOpen: boolean
    onClose: () => void
}

export default function AppointmentModal({ appointment, isOpen, onClose }: AppointmentModalProps) {
    // const [isEditing, setIsEditing] = useState(false)

    if (!appointment) return null

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "đã thanh toán":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                        Đã xác nhận
                    </Badge>
                )
            case "chờ xử lý":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
                        Chờ xác nhận
                    </Badge>
                )
            case "đã hủy":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                        Đã hủy
                    </Badge>
                )
            default:
                return null
        }
    }

    const remainingAmount = appointment.price - appointment.deposit

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseIcon={false} className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-xl font-semibold">{appointment.service}</DialogTitle>
                            <DialogDescription className="text-base mt-1">
                                Mã lịch hẹn: <span className="font-medium">{appointment.id.toUpperCase()}</span>
                            </DialogDescription>
                        </div>
                        {getStatusBadge(appointment.status)}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Thông tin khách hàng */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Thông tin khách hàng
                        </h3>
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src="/placeholder.svg" alt={appointment.customerName} />
                                <AvatarFallback className="text-lg">{appointment.customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h4 className="font-medium text-lg">{appointment.customerName}</h4>
                                <div className="space-y-2 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        <span>{appointment.customerPhone}</span>
                                        <Button variant="ghost" size="sm" className="h-6 px-2 ml-2 cursor-pointer">
                                            Gọi
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span>{appointment.customerEmail}</span>
                                        <Button variant="ghost" size="sm" className="h-6 px-2 ml-2 cursor-pointer">
                                            Email
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
                                <MessageSquare className="h-4 w-4" />
                                Nhắn tin
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Thông tin lịch hẹn */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Chi tiết lịch hẹn
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Package className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Gói dịch vụ</p>
                                        <p className="font-medium">{appointment.package}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Thời gian</p>
                                        <p className="font-medium">
                                            {appointment.from && appointment.to 
                                                ? `${appointment.from} - ${appointment.to}`
                                                : "Cả ngày"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Địa điểm</p>
                                        <p className="font-medium">{appointment.location}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày chụp</p>
                                        <p className="font-medium">{formatDate(appointment.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Tổng giá trị</p>
                                        <p className="font-medium text-lg">{formatCurrency(appointment.price)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Thông tin thanh toán */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Thông tin thanh toán
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-600 font-medium">Đã thanh toán</p>
                                <p className="text-xl font-bold text-green-700">{formatCurrency(appointment.deposit)}</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <p className="text-sm text-orange-600 font-medium">Còn lại</p>
                                <p className="text-xl font-bold text-orange-700">{formatCurrency(remainingAmount)}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600 font-medium">Tổng cộng</p>
                                <p className="text-xl font-bold text-blue-700">{formatCurrency(appointment.price)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ghi chú */}
                    {appointment.notes && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Ghi chú
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700">{appointment.notes}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <div className="flex gap-2 flex-1">
                        <Button variant="outline" className="flex-1 gap-1 cursor-pointer">
                            <Edit className="h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                        <Button variant="outline" className="flex-1 gap-1 text-red-600 hover:text-red-700 cursor-pointer">
                            <Trash2 className="h-4 w-4" />
                            Hủy lịch
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="cursor-pointer">
                            Đóng
                        </Button>
                        {appointment.status === "chờ xử lý" && (
                            <Button className="gap-1">
                                <Calendar className="h-4 w-4" />
                                Xác nhận lịch
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
