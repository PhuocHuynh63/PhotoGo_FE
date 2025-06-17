"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Package, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/Atoms/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Separator } from "@components/Atoms/ui/separator"
import CustomCalendar from "@components/Molecules/Canlender"
import { Button } from "@components/Atoms/ui/button"
import { Badge } from "@components/Atoms/ui/badge"
import { useAddressLocation } from "@stores/vendor/selectors"
import { IServiceConcept } from "@models/serviceConcepts/common.model"

const mockTimeSlots = [
    { id: 1, time: "08:00 - 12:00", available: true, price: "5,000,000 VNĐ" },
    { id: 2, time: "09:00 - 13:00", available: false, price: "5,000,000 VNĐ" },
    { id: 3, time: "10:00 - 14:00", available: true, price: "5,000,000 VNĐ" },
    { id: 4, time: "13:00 - 17:00", available: true, price: "5,500,000 VNĐ" },
    { id: 5, time: "14:00 - 18:00", available: false, price: "5,500,000 VNĐ" },
    { id: 6, time: "15:00 - 19:00", available: true, price: "6,000,000 VNĐ" },
]

// Mock availability data for calendar
const generateMockAvailability = () => {
    const availability = []
    const today = new Date()

    for (let i = 0; i < 60; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        const totalSlots = 6
        const availableSlots = Math.floor(Math.random() * 7) // 0-6 available slots

        availability.push({
            date,
            totalSlots,
            availableSlots,
            isFullyBooked: availableSlots === 0,
            isPastDate: date < today,
        })
    }

    return availability
}

interface EnhancedBookingPopupProps {
    isOpen: boolean
    onClose: () => void
    serviceConcept?: IServiceConcept;
}

export default function EnhancedBookingPopup({
    isOpen,
    onClose,
    serviceConcept,
}: EnhancedBookingPopupProps) {
    /**
     * Define data from store
     * - AddressLocation: Used to display vendor's address in the booking popup
     */
    const addressLocation = useAddressLocation();
    //----------------------End----------------------//

    console.log("Service Concept:", serviceConcept);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
    const [timeSlots, setTimeSlots] = useState(mockTimeSlots)
    const [isLoading, setIsLoading] = useState(false)
    const [availability] = useState(generateMockAvailability())

    useEffect(() => {
        if (selectedDate) {
            setIsLoading(true)
            setSelectedSlot(null)

            setTimeout(() => {
                const updatedSlots = mockTimeSlots.map((slot) => ({
                    ...slot,
                    available: Math.random() > 0.3,
                }))
                setTimeSlots(updatedSlots)
                setIsLoading(false)
            }, 800)
        }
    }, [selectedDate])

    const handleConfirmBooking = () => {
        if (selectedDate && selectedSlot) {
            const selectedSlotData = timeSlots.find((slot) => slot.id === selectedSlot)
            alert(
                `Đặt lịch thành công!\nNgày: ${selectedDate.toLocaleDateString("vi-VN")}\nGiờ: ${selectedSlotData?.time}\nGói dịch vụ: ${serviceConcept?.name}`,
            )
            onClose()
        }
    }

    const isBookingValid = selectedDate && selectedSlot
    const selectedSlotData = timeSlots.find((slot) => slot.id === selectedSlot)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="xl:max-w-[1200px] max-h-[100vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Calendar className="h-6 w-6" />
                        Đặt lịch dịch vụ
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Service Package Info */}
                    <div className="xl:col-span-1 space-y-4">
                        <Card className="border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Package className="h-5 w-5" />
                                    Gói dịch vụ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{serviceConcept?.name}</h3>
                                    {/* <p className="text-sm text-muted-foreground mb-3">{serviceConcept?.description}</p> */}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>Thời gian: {serviceConcept?.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{addressLocation}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Giá từ</div>
                                    <div className="text-xl font-bold text-primary">{Number(serviceConcept?.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Booking Summary */}
                        {isBookingValid && (
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader>
                                    <CardTitle className="text-lg text-green-800">Tóm tắt đặt lịch</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700">Ngày:</span>
                                        <span className="font-medium">{selectedDate?.toLocaleDateString("vi-VN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700">Giờ:</span>
                                        <span className="font-medium">{selectedSlotData?.time}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700">Dịch vụ:</span>
                                        <span className="font-medium">{serviceConcept?.name}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-green-800">Tổng tiền:</span>
                                        <span className="font-bold text-lg text-green-800">{selectedSlotData?.price}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Calendar */}
                    <div className="xl:col-span-1">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Chọn ngày</h3>
                                <CustomCalendar
                                    selectedDate={selectedDate}
                                    onDateSelect={setSelectedDate}
                                    availability={availability}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div className="xl:col-span-1">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Chọn khung giờ
                                    {selectedDate && (
                                        <span className="text-sm font-normal text-muted-foreground ml-2">
                                            - {selectedDate.toLocaleDateString("vi-VN")}
                                        </span>
                                    )}
                                </h3>
                            </div>

                            <Card>
                                <CardContent className="p-4">
                                    {!selectedDate ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Clock className="h-16 w-16 mx-auto mb-4 opacity-30" />
                                            <p className="text-lg mb-2">Chọn ngày trước</p>
                                            <p className="text-sm">Vui lòng chọn ngày để xem các khung giờ có sẵn</p>
                                        </div>
                                    ) : isLoading ? (
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                            <p className="text-muted-foreground">Đang tải khung giờ...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {timeSlots.map((slot) => (
                                                <Button
                                                    key={slot.id}
                                                    variant={selectedSlot === slot.id ? "default" : "outline"}
                                                    className={`w-full justify-between h-auto p-4 cursor-pointer ${!slot.available ? "opacity-50 cursor-not-allowed bg-muted" : ""
                                                        }`}
                                                    onClick={() => slot.available && setSelectedSlot(slot.id)}
                                                    disabled={!slot.available}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="h-4 w-4" />
                                                        <div className="text-left">
                                                            <div className="font-medium">{slot.time}</div>
                                                            <div className="text-sm opacity-70">{slot.price}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {!slot.available && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                Đã đặt
                                                            </Badge>
                                                        )}
                                                        {slot.available && selectedSlot === slot.id && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Đã chọn
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button variant="outline" onClick={onClose} size="lg">
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleConfirmBooking} disabled={!isBookingValid} size="lg" className="min-w-[180px]">
                        Xác nhận đặt lịch
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
