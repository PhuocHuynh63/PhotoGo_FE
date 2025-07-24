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
    Clock,
    DollarSign,
    FileText,
    Trash2,
    MessageSquare,
    Calendar,
    User,
    Notebook,
} from "lucide-react"
import { BOOKING_STATUS } from "@constants/booking"
import { useBooking } from "@utils/hooks/useBooking"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ROUTES } from "@routes"
import { formatDate } from "@utils/helpers/Date"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"
import { PAGES } from "../../../../../types/IPages"
import { Socket } from "socket.io-client"
import { getSocket } from "@configs/socket"
import { useRouter } from "next/navigation"
import { useSession } from "@stores/user/selectors"
import { METADATA } from "../../../../../types/IMetadata"

export default function AppointmentModal({ appointment, isOpen, onClose, onAppointmentUpdate }: PAGES.AppointmentModalProps) {
    const session = useSession() as METADATA.ISession;
    const router = useRouter();

    /**
     * Socket connection to handle chat functionality
     */
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const socketInstance = getSocket(session?.accessToken);
        setSocket(socketInstance);
        if (socketInstance) {
            socketInstance.on('joinedRoom', (data) => {
                router.push(`${ROUTES.USER.CHAT.replace(':id', data.chatId)}`);
            });
        }

        return () => {
            if (socketInstance) {
                socketInstance.off('joinedRoom');
            }
        };
    }, [session?.accessToken]);

    const handleSelectConversation = () => {
        if (socket && socket.connected) {
            socket.emit('joinChat', { memberId: appointment?.userId });
        }
    };
    //-----------------------------End---------------------------------//
    // const [isEditing, setIsEditing] = useState(false)
    const { updateBookingStatus, updatingStatus, error, clearError } = useBooking()
    const [localAppointment, setLocalAppointment] = useState<PAGES.Appointment | null>(appointment)
    // Update local appointment when prop changes
    useEffect(() => {
        setLocalAppointment(appointment)
    }, [appointment])

    // Clear error when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            clearError()
        }
    }, [isOpen, clearError])

    if (!localAppointment) return null

    const handleConfirmAppointment = async (bookingId: string) => {
        try {
            await updateBookingStatus(bookingId, BOOKING_STATUS.CONFIRMED)

            // Update local state immediately
            const updatedAppointment = {
                ...localAppointment,
                status: BOOKING_STATUS.CONFIRMED
            }
            setLocalAppointment(updatedAppointment)

            // Notify parent component
            if (onAppointmentUpdate) {
                onAppointmentUpdate(updatedAppointment)
            }

            toast.success("Đã xác nhận lịch hẹn thành công!")
            onClose() // Đóng modal sau khi xác nhận thành công
        } catch (err) {
            console.error("Error confirming appointment:", err)
            toast.error("Có lỗi xảy ra khi xác nhận lịch hẹn")
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case BOOKING_STATUS.PAID:
                return (
                    <Badge variant='outline' className="bg-green-100 text-green-800 hover:bg-green-100">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                        {status}
                    </Badge>
                )
            case BOOKING_STATUS.PENDING:
                return (
                    <Badge variant='outline' className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
                        {status}
                    </Badge>
                )
            case BOOKING_STATUS.CONFIRMED:
                return (
                    <Badge variant='outline' className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                        {status}
                    </Badge>
                )
            case BOOKING_STATUS.CANCELLED:
                return (
                    <Badge variant='outline' className="bg-red-100 text-red-800 hover:bg-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                        {status}
                    </Badge>
                )
            case BOOKING_STATUS.IN_PROGRESS:
                return (
                    <Badge variant='outline' className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                        {status}
                    </Badge>
                )
            case BOOKING_STATUS.COMPLETED:
                return (
                    <Badge variant='outline' className="bg-green-100 text-green-800 hover:bg-green-100">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                        {status}
                    </Badge>
                )
            default:
                return null
        }
    }

    const handleCompleteAppointment = async (bookingId: string) => {
        try {
            await updateBookingStatus(bookingId, BOOKING_STATUS.COMPLETED)

            // Update local state immediately
            const updatedAppointment = {
                ...localAppointment,
                status: BOOKING_STATUS.COMPLETED
            }
            setLocalAppointment(updatedAppointment)

            // Notify parent component
            if (onAppointmentUpdate) {
                onAppointmentUpdate(updatedAppointment)
            }

            toast.success("Đã hoàn thành lịch hẹn thành công!")
            onClose() // Đóng modal sau khi hoàn thành thành công
        } catch (err) {
            console.error("Error completing appointment:", err)
            toast.error("Có lỗi xảy ra khi hoàn thành lịch hẹn")
        }
    }

    const handleProgressAppointment = async (bookingId: string) => {
        try {
            await updateBookingStatus(bookingId, BOOKING_STATUS.IN_PROGRESS)

            // Update local state immediately
            const updatedAppointment = {
                ...localAppointment,
                status: BOOKING_STATUS.IN_PROGRESS
            }
            setLocalAppointment(updatedAppointment)

            // Notify parent component
            if (onAppointmentUpdate) {
                onAppointmentUpdate(updatedAppointment)
            }

            toast.success("Đã tiến hành lịch hẹn thành công!")
            onClose() // Đóng modal sau khi tiến hành thành công
        } catch (err) {
            console.error("Error progressing appointment:", err)
            toast.error("Có lỗi xảy ra khi tiến hành lịch hẹn")
        }
    }



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseIcon={false} className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-xl font-semibold">{localAppointment.service}</DialogTitle>
                            <DialogDescription className="text-base mt-1">
                                ID lịch hẹn: <span className="font-medium">{localAppointment.id.toUpperCase()}</span>
                            </DialogDescription>
                        </div>
                        {getStatusBadge(localAppointment.status)}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Error display */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">{error.message}</p>
                        </div>
                    )}

                    {/* Thông tin khách hàng */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Thông tin khách hàng
                        </h3>
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src="/placeholder.svg" alt={localAppointment.customerName} />
                                <AvatarFallback className="text-lg">{localAppointment.customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h4 className="font-medium text-lg">{localAppointment.customerName}</h4>
                                <div className="space-y-2 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        <span>{localAppointment.customerPhone}</span>

                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span>{localAppointment.customerEmail}</span>

                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1 cursor-pointer" onClick={handleSelectConversation}>
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
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Thời gian</p>
                                        <p className="font-medium">
                                            {localAppointment.from && localAppointment.to
                                                ? `${localAppointment.from} - ${localAppointment.to}`
                                                : "Cả ngày"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày chụp</p>
                                        <p className="font-medium">{formatDate(localAppointment.date)}</p>
                                    </div>
                                </div>

                            </div>
                            <div className="space-y-3 col-span-1 md:col-span-2">
                                <div className="flex items-start gap-3">
                                    <Notebook className="h-4 w-4 text-gray-500 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Ghi chú khách hàng</p>
                                        <p className="font-medium text-sm leading-relaxed">
                                            {localAppointment.notes || "Không có ghi chú"}
                                        </p>
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
                                <p className="text-xl font-bold text-green-700">{formatPrice(localAppointment.alreadyPaid)}</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <p className="text-sm text-orange-600 font-medium">Còn lại</p>
                                <p className="text-xl font-bold text-orange-700">{formatPrice(localAppointment.remain)}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600 font-medium">Tổng cộng</p>
                                <p className="text-xl font-bold text-blue-700">{formatPrice(localAppointment.total)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ghi chú */}
                    {localAppointment.notes && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Ghi chú
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700">{localAppointment.notes}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <div className="flex gap-2 flex-1">
                        {localAppointment.status === BOOKING_STATUS.PAID && (
                            <Button variant="outline" className="flex-1 gap-1 text-red-600 hover:text-red-700 cursor-pointer">
                                <Trash2 className="h-4 w-4" />
                                Hủy lịch
                            </Button>
                        )}

                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="cursor-pointer">
                            Đóng
                        </Button>
                        {localAppointment.status === BOOKING_STATUS.PENDING && (
                            <Button
                                className="gap-1"
                                onClick={() => handleConfirmAppointment(localAppointment.id)}
                                disabled={updatingStatus}
                            >
                                <Calendar className="h-4 w-4" />
                                {updatingStatus ? "Đang xác nhận..." : "Xác nhận lịch"}
                            </Button>
                        )}
                        {localAppointment.status === BOOKING_STATUS.IN_PROGRESS && (
                            <Button
                                className="gap-1"
                                onClick={() => handleCompleteAppointment(localAppointment.id)}
                                disabled={updatingStatus}
                            >
                                <Calendar className="h-4 w-4" />
                                {updatingStatus ? "Đang xác nhận..." : "Hoàn thành lịch"}
                            </Button>
                        )}
                        {localAppointment.status === BOOKING_STATUS.CONFIRMED && (
                            <Button
                                className="gap-1"
                                onClick={() => handleProgressAppointment(localAppointment.id)}
                                disabled={updatingStatus}
                            >
                                <Calendar className="h-4 w-4" />
                                {updatingStatus ? "Đang xác nhận..." : "Đang thực hiện"}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
