"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Package, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/Atoms/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card";
import { Separator } from "@components/Atoms/ui/separator";
import CustomCalendar from "@components/Molecules/Canlender";
import { Button } from "@components/Atoms/ui/button";
import { Badge } from "@components/Atoms/ui/badge";
import { useLocationAvailability } from "@utils/hooks/useLocationAvailability";
import { IServiceConcept } from "@models/serviceConcepts/common.model";
import { useAddressLocation } from "@stores/vendor/selectors";

interface EnhancedBookingPopupProps {
    isOpen: boolean;
    onClose: () => void;
    serviceConcept?: IServiceConcept;
}

export default function EnhancedBookingPopup({
    isOpen,
    onClose,
    serviceConcept,
}: EnhancedBookingPopupProps) {
    const addressLocation = useAddressLocation();

    const [timeSlots, setTimeSlots] = useState<any[]>([]);
    console.log(timeSlots);

    const [isLoading, setIsLoading] = useState(false);

    /**
     * Hook to fetch location availability based on the selected address location.
     * It retrieves the working dates and slot times for the specified location.
     * The availability data is used to determine which dates and times are available for booking.
     */
    const { locationAvailability } = useLocationAvailability({
        locationId: addressLocation?.id || "",
        enabled: true,
    });
    //-----------------------------End---------------------------------//

    // Tổng hợp availability từ tất cả các range
    const availability = locationAvailability
        ? locationAvailability.flatMap((loc: any) =>
            loc.workingDates.map((wd: any) => {
                const date = new Date(wd.date.split("/").reverse().join("-"));
                const totalSlots = loc.slotTimes.length;
                const availableSlots = loc.slotTimes.filter((slot: any) => slot.isAvailable).length;
                return {
                    date,
                    totalSlots,
                    availableSlots,
                    isFullyBooked: availableSlots === 0,
                    isPastDate: date < new Date(new Date().setHours(0, 0, 0, 0)),
                };
            }),
        )
        : [];


    /**
     * useState hooks to manage the selected date and time slot.
     * - selectedDate: The date selected by the user for booking.
     * - selectedSlot: The time slot selected by the user for booking.
     */
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    useEffect(() => {
        if (selectedDate && locationAvailability) {
            setIsLoading(true);
            setSelectedSlot(null);

            // Định dạng ngày thành DD/MM/YYYY
            const formattedDate = `${selectedDate.getDate().toString().padStart(2, "0")}/${(selectedDate.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${selectedDate.getFullYear()}`;

            // Tìm range chứa ngày đã chọn
            const matchingRange = locationAvailability.find((loc: any) =>
                loc.workingDates.some((wd: any) => wd.date === formattedDate && wd.isAvailable),
            );

            if (matchingRange) {
                // Map slotTimes của range đó
                const updatedSlots = matchingRange.slotTimes.map((slot: any) => ({
                    id: slot.id,
                    time: `${slot.startSlotTime.slice(0, 5)} - ${slot.endSlotTime.slice(0, 5)}`,
                    available: slot.isAvailable && slot.alreadyBooked < slot.maxParallelBookings,
                    price: serviceConcept?.price
                        ? Number(serviceConcept.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                        : "Liên hệ",
                }));
                setTimeSlots(updatedSlots);
            } else {
                setTimeSlots([]);
            }

            setIsLoading(false);
        }
    }, [locationAvailability, selectedDate, serviceConcept?.price]);
    //-----------------------------End---------------------------------//

    const handleConfirmBooking = () => {
        if (selectedDate && selectedSlot) {
            const selectedSlotData = timeSlots.find((slot) => slot.id === selectedSlot);
            alert(
                `Đặt lịch thành công!\nNgày: ${selectedDate.toLocaleDateString("vi-VN")}\nGiờ: ${selectedSlotData?.time}\nGói dịch vụ: ${serviceConcept?.name}`,
            );
            onClose();
        }
    };

    const isBookingValid = selectedDate && selectedSlot;
    const selectedSlotData = timeSlots.find((slot) => slot.id === selectedSlot);

    console.log("Location Availability:", locationAvailability);

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
                    {/* Thông tin gói dịch vụ */}
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
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>Thời gian: {serviceConcept?.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{addressLocation?.address}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Giá từ</div>
                                    <div className="text-xl font-bold text-primary">
                                        {Number(serviceConcept?.price).toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tóm tắt đặt lịch */}
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

                    {/* Lịch */}
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

                    {/* Khung giờ */}
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
                                    {!locationAvailability ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                                        </div>
                                    ) : !selectedDate ? (
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
                                    ) : timeSlots.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <p className="text-lg mb-2">Không có khung giờ</p>
                                            <p className="text-sm">Ngày này không có khung giờ nào khả dụng</p>
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

                {/* Nút hành động */}
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
    );
}