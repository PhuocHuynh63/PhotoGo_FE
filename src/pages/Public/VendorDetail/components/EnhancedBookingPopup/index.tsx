"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Package, MapPin } from "lucide-react";
import { useSession } from "@stores/user/selectors";
import { useRouter } from "next/navigation";
import { useAddressLocation } from "@stores/vendor/selectors";
import { useLocationAvailability } from "@utils/hooks/useLocationAvailability";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { generateUUIDV4 } from "@utils/helpers/GenerateUUID";
import { ROUTES } from "@routes";
import checkoutSessionService from "@services/checkoutSession";
import { ICheckoutSessionResponseModel } from "@models/checkoutSession/repsonse.model";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/Atoms/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card";
import { Separator } from "@components/Atoms/ui/separator";
import CustomCalendar from "@components/Molecules/Canlender";
import { Button } from "@components/Atoms/ui/button";
import { Badge } from "@components/Atoms/ui/badge";
import { IServiceConcept } from "@models/serviceConcepts/common.model";

// Define the form data structure
interface BookingFormData {
    conceptId: string;
    date: Date | undefined;
    time: string | null; // This will store the selected slot ID
}

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
    /**
     * Define data from stores Zustand
     * - session: User session data
     * - router: Next.js router for navigation
     * - addressLocation: Current address location for the booking
     */
    const session = useSession() as METADATA.ISession;
    const router = useRouter();
    const addressLocation = useAddressLocation();

    // State for managing loading indicator during API calls
    const [isLoading, setIsLoading] = useState(false);

    /**
     * React Hook Form initialization
     * - `register`: Function to register input elements.
     * - `handleSubmit`: Function to handle form submission, includes validation.
     * - `setValue`: Function to programmatically update form values.
     * - `watch`: Function to observe changes in form values.
     * - `formState: { errors }`: Object containing form errors.
     */
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<BookingFormData>({
        defaultValues: {
            conceptId: serviceConcept?.id || '', // Initialize with service concept ID
            date: undefined, // No date selected initially
            time: null, // No time slot selected initially
        }
    });

    // Watch form values for dynamic rendering and validation checks
    const watchedDate = watch('date');
    const watchedTime = watch('time');

    // State to hold available time slots for the selected date
    const [timeSlots, setTimeSlots] = useState<any[]>([]);

    /**
     * Hook to fetch location availability based on the selected address location.
     * It retrieves the working dates and slot times for the specified location.
     * The availability data is used to determine which dates and times are available for booking.
     */
    const { locationAvailability } = useLocationAvailability({
        locationId: addressLocation?.id || "",
        enabled: true, // Enable the hook if locationId is available
    });

    // Aggregate availability from all ranges to pass to the calendar
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
     * Effect hook to set the initial `conceptId` when `serviceConcept` is available.
     * This ensures the hidden form field `conceptId` is populated.
     */
    useEffect(() => {
        if (serviceConcept?.id) {
            setValue('conceptId', serviceConcept.id);
        }
    }, [serviceConcept?.id, setValue]);

    /**
     * Effect hook to update `timeSlots` when `locationAvailability` or `watchedDate` changes.
     * This logic fetches and processes available time slots for the currently selected date.
     */
    useEffect(() => {
        if (watchedDate && locationAvailability) {
            setIsLoading(true);
            // Reset the time slot selection when the date changes
            setValue('time', null);

            // Format the watched date to DD/MM/YYYY for matching with availability data
            const formattedDate = `${watchedDate.getDate().toString().padStart(2, "0")}/${(watchedDate.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${watchedDate.getFullYear()}`;

            // Find the matching availability range for the selected date
            const matchingRange = locationAvailability.find((loc: any) =>
                loc.workingDates.some((wd: any) => wd.date === formattedDate && wd.isAvailable),
            );

            if (matchingRange) {
                // Map the slotTimes of the matching range to the component's state
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
                setTimeSlots([]); // No slots available for the selected date
            }

            setIsLoading(false);
        } else if (!watchedDate) {
            setTimeSlots([]); // Clear time slots if no date is selected
        }
    }, [locationAvailability, watchedDate, serviceConcept?.price, setValue]);

    // Find the selected slot's data for display in the summary
    const selectedSlotData = timeSlots.find((slot) => slot.id === watchedTime);

    /**
     * Handle form submission for booking a service concept.
     * This function is called by `handleSubmit` from `react-hook-form`.
     * It includes logic for authentication, creating a checkout session, and navigation.
     */
    const onSubmit = async (data: BookingFormData) => {
        console.log("Form data submitted:", data);

        const selectedDate = data.date;
        const formattedDate = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '';
        const selectedSlotId = data.time;

        // Ensure date and slot are selected before proceeding
        if (!selectedDate || !selectedSlotId) {
            toast.error('Vui lòng chọn ngày và khung giờ để đặt lịch hẹn.');
            return;
        }

        const slotDetails = timeSlots.find(s => s.id === selectedSlotId);
        if (!slotDetails) {
            toast.error('Không tìm thấy thông tin khung giờ đã chọn.');
            return;
        }

        const id = generateUUIDV4(); // Generate a unique ID for the checkout session

        const bookingData = {
            conceptId: data.conceptId,
            date: formattedDate,
            time: slotDetails.time, // Use the display time for the backend
            slotId: selectedSlotId, // Also pass the ID of the selected slot
        };

        const userId = session?.user?.id || '';
        if (!userId) {
            toast.error('Bạn cần đăng nhập để đặt lịch hẹn');
            router.replace(ROUTES.AUTH.LOGIN);
            return;
        }

        setIsLoading(true); // Indicate submission is in progress
        try {
            const res = await checkoutSessionService.createCheckSession(id, userId, bookingData) as ICheckoutSessionResponseModel;
            if (res.statusCode !== 201) {
                toast.error(res.message || 'Đặt lịch không thành công, vui lòng thử lại sau');
            } else {
                toast.success('Đặt lịch thành công! Đang chuyển hướng đến trang thanh toán.');
                router.push(`${ROUTES.USER.CHECKOUT.replace(':id', id)}`);
                onClose(); // Close the popup after successful submission
            }
        } catch (error) {
            console.error('Checkout session creation failed:', error);
            toast.error('Đặt lịch không thành công do lỗi hệ thống.');
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

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
                        {(watchedDate && watchedTime) && (
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader>
                                    <CardTitle className="text-lg text-green-800">Tóm tắt đặt lịch</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700">Ngày:</span>
                                        <span className="font-medium">{watchedDate?.toLocaleDateString("vi-VN")}</span>
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
                                {/* CustomCalendar will update the form's 'date' value */}
                                <CustomCalendar
                                    selectedDate={watchedDate}
                                    onDateSelect={(date) => {
                                        setValue('date', date); // Update react-hook-form date field
                                        setValue('time', null); // Reset time when date changes
                                    }}
                                    availability={availability}
                                />
                                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Khung giờ */}
                    <div className="xl:col-span-1">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Chọn khung giờ
                                    {watchedDate && (
                                        <span className="text-sm font-normal text-muted-foreground ml-2">
                                            - {watchedDate.toLocaleDateString("vi-VN")}
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
                                    ) : !watchedDate ? (
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
                                                    variant={watchedTime === slot.id ? "default" : "outline"}
                                                    className={`w-full justify-between h-auto p-4 cursor-pointer ${!slot.available ? "opacity-50 cursor-not-allowed bg-muted" : ""
                                                        }`}
                                                    onClick={() => {
                                                        if (slot.available) {
                                                            setValue('time', slot.id); // Update react-hook-form time field
                                                        }
                                                    }}
                                                    disabled={!slot.available || isLoading}
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
                                                        {slot.available && watchedTime === slot.id && (
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
                    <Button variant="outline" onClick={onClose} size="lg" disabled={isLoading}>
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={!watchedDate || !watchedTime || isLoading}
                        size="lg"
                        className="min-w-[180px]"
                    >
                        {isLoading ? 'Đang xác nhận...' : 'Xác nhận đặt lịch'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}