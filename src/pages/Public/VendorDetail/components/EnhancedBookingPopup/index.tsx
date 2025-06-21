"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Package, MapPin } from "lucide-react";
import { useSession } from "@stores/user/selectors";
import { useRouter } from "next/navigation";
import { useAddressLocation, useVendor } from "@stores/vendor/selectors";
import { useLocationAvailability, useLocationAvailabilityByLocationIdAndDate } from "@utils/hooks/useLocationAvailability";
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
import { ICheckoutSessionRequest } from "@models/booking/request.model";

interface EnhancedBookingPopupProps {
    isOpen: boolean;
    onClose: () => void;
    serviceConcept?: IServiceConcept;
}

// Define the structure for a time slot
interface TimeSlot {
    id: string;
    time: string;
    price: number;
    available: boolean;
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
    const vendor = useVendor();
    //--------------------------End--------------------------//

    const [isLoading, setIsLoading] = useState(false);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    /**
     * React Hook Form setup
     * - register: Register form fields
     * - handleSubmit: Handle form submission
     * - setValue: Set form field values
     * - watch: Watch form field values
     * - errors: Form validation errors
     */
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ICheckoutSessionRequest>({
        defaultValues: {
            bookingDetails: {
                date: "",
                time: "",
                working_date_id: "",
                slot_time_id: "",
                duration: serviceConcept?.duration || 0,
            },
            conceptId: serviceConcept?.id || "",
            price: serviceConcept?.price || 0,
            vendorDetails: {
                id: serviceConcept?.id || "",
                name: serviceConcept?.name || "",
            },
            locationDetails: {
                id: addressLocation?.id || "",
                address: addressLocation?.address || "",
            },
        }
    });

    const watchedDate = watch('bookingDetails.date');
    const watchedTime = watch('bookingDetails.slot_time_id');
    //--------------------------End--------------------------//


    /**
     * useLocationAvailability hook to fetch general location availability
     * - Fetches working dates and times for the selected location
     * - Enabled only when addressLocation is available
     */
    const { locationAvailability } = useLocationAvailability({
        locationId: addressLocation?.id || "",
        enabled: !!addressLocation?.id,
    });

    const availability = locationAvailability
        ? locationAvailability.flatMap((loc: any) =>
            loc.workingDates
                .filter((wd: any) => wd.isAvailable)
                .map((wd: any) => {
                    const date = new Date(wd.date.split("/").reverse().join("-"));
                    return {
                        id: wd.id,
                        date,
                        isPastDate: date < new Date(new Date().setHours(0, 0, 0, 0)),
                        isFullyBooked: false,
                    };
                }),
        )
        : [];
    //--------------------------End--------------------------//


    /**
     * useLocationAvailabilityByLocationIdAndDate hook to fetch specific time slots
     * - Fetches time slots for the selected date and location
     *  - Enabled only when both date and location are available
     */
    const {
        locationAvailabilitySelectDate,
        loading: isTimeSlotsLoading,
    } = useLocationAvailabilityByLocationIdAndDate({
        locationId: addressLocation?.id || "",
        date: watchedDate ? format(new Date(watchedDate), 'dd/MM/yyyy') : "",
        // enabled: !!watchedDate && !!addressLocation?.id // Only fetch when date and location are available
    });
    //--------------------------End--------------------------//


    /**
     * Effect to set initial form values based on serviceConcept and addressLocation    
     * - Sets values for concept, price, booking details, and location details
     * - Runs when serviceConcept, addressLocation, or vendor changes
     */
    useEffect(() => {
        setValue('conceptId', serviceConcept?.id || "");
        setValue('price', serviceConcept?.price || 0);
        setValue('bookingDetails.duration', serviceConcept?.duration || 0);
        setValue('locationDetails.id', addressLocation?.id || "");
        setValue('locationDetails.address', addressLocation?.address || "");
        setValue('vendorDetails.id', vendor?.id || "");
        setValue('vendorDetails.name', vendor?.name || "");
    }, [
        serviceConcept?.id,
        serviceConcept?.name,
        serviceConcept?.price,
        serviceConcept?.duration,
        addressLocation?.id,
        addressLocation?.address,
        vendor?.id,
        vendor?.name,
        setValue,
    ]);
    //--------------------------End--------------------------//

    // Update timeSlots when locationAvailabilitySelectDate changes
    useEffect(() => {
        if (locationAvailabilitySelectDate && locationAvailabilitySelectDate.length > 0) {
            const firstLocationAvailability = locationAvailabilitySelectDate[0] as any;
            const availableSlots = firstLocationAvailability.slotTimeWorkingDates.map((slotDetail: any) => {
                const startTime = slotDetail.startSlotTime.substring(0, 5);
                const endTime = slotDetail.endSlotTime.substring(0, 5);
                const price = Number(serviceConcept?.price || 0);

                return {
                    id: slotDetail.id,
                    time: `${startTime} - ${endTime}`,
                    price: price,
                    available: slotDetail.isAvailable && (slotDetail.maxParallelBookings - slotDetail.alreadyBooked) > 0,
                };
            });
            setTimeSlots(availableSlots);
        } else if (watchedDate && !isTimeSlotsLoading) {
            setTimeSlots([]);
        } else if (!watchedDate) {
            setTimeSlots([]);
        }
    }, [locationAvailabilitySelectDate, watchedDate, isTimeSlotsLoading, serviceConcept?.price]);


    const selectedSlotData = timeSlots.find((slot) => slot.id === watchedTime);

    /**
     * Handles form submission for booking a service
     * @param data - Form data submitted from the booking form
     * @returns
     * This function processes the booking by:
     * 1. Validating the selected date and time slot
     * 2. Formatting the date for submission
     * 3. Creating a booking data object 
     */
    const onSubmit = async (data: ICheckoutSessionRequest) => {
        const { bookingDetails, conceptId, price, locationDetails, vendorDetails } = data;
        console.log("conceptId: ", conceptId);

        const selectedDate = new Date(bookingDetails.date);
        const formattedDate = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '';
        const selectedSlotId = bookingDetails.slot_time_id;

        if (!selectedDate || !selectedSlotId) {
            toast.error('Vui lòng chọn ngày và khung giờ để đặt lịch hẹn.');
            return;
        }

        if (!selectedSlotId) {
            toast.error('Không tìm thấy thông tin khung giờ đã chọn.');
            return;
        }

        const id = generateUUIDV4();

        const bookingData: ICheckoutSessionRequest = {
            bookingDetails: {
                date: formattedDate,
                time: bookingDetails.time,
                working_date_id: bookingDetails.working_date_id,
                slot_time_id: selectedSlotId,
                duration: bookingDetails.duration,
            },
            conceptId: conceptId,
            price: price,
            vendorDetails: {
                id: vendorDetails.id,
                name: vendorDetails.name,
            },
            locationDetails: {
                id: locationDetails.id,
                address: locationDetails.address,
            },
        };

        const userId = session?.user?.id || '';
        if (!userId) {
            toast.error('Bạn cần đăng nhập để đặt lịch hẹn');
            router.replace(ROUTES.AUTH.LOGIN);
            return;
        }

        setIsLoading(true);
        try {
            const res = await checkoutSessionService.createCheckSession(id, userId, bookingData) as ICheckoutSessionResponseModel;
            if (res.statusCode !== 201) {
                toast.error(res.message || 'Đặt lịch không thành công, vui lòng thử lại sau');
            } else {
                toast.success('Đặt lịch thành công! Đang chuyển hướng đến trang thanh toán.');
                router.push(`${ROUTES.USER.CHECKOUT.replace(':id', id)}`);
                onClose();
            }
        } catch (error) {
            console.error('Checkout session creation failed:', error);
            toast.error('Đặt lịch không thành công do lỗi hệ thống.');
        } finally {
            setIsLoading(false);
        }
    };
    //---------------------------End--------------------------//

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
                        {(watchedDate && watchedTime && selectedSlotData) && (
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader>
                                    <CardTitle className="text-lg text-green-800">Tóm tắt đặt lịch</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700">Ngày:</span>
                                        <span className="font-medium">{watchedDate ? new Date(watchedDate).toLocaleDateString("vi-VN") : ""}</span>
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
                                        <span className="font-bold text-lg text-green-800">
                                            {selectedSlotData?.price.toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </span>
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
                                    selectedDate={watchedDate ? new Date(watchedDate) : undefined}
                                    onDateSelect={(date: { date: Date, id: string }) => {
                                        setValue('bookingDetails.date', date.date ? date.date.toISOString() : "");
                                        setValue('bookingDetails.working_date_id', date.id);
                                        setValue('bookingDetails.time', "");
                                    }}
                                    availability={availability}
                                />
                                {errors.bookingDetails?.date && <p className="text-red-500 text-sm mt-1">{errors.bookingDetails.date.message}</p>}
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
                                            - {watchedDate ? new Date(watchedDate).toLocaleDateString("vi-VN") : ""}
                                        </span>
                                    )}
                                </h3>
                            </div>

                            <Card>
                                <CardContent className="p-4">
                                    {isTimeSlotsLoading ? (
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                            <p className="text-muted-foreground">Đang tải khung giờ...</p>
                                        </div>
                                    ) : !watchedDate ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Clock className="h-16 w-16 mx-auto mb-4 opacity-30" />
                                            <p className="text-lg mb-2">Chọn ngày trước</p>
                                            <p className="text-sm">Vui lòng chọn ngày để xem các khung giờ có sẵn</p>
                                        </div>
                                    ) : timeSlots.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <p className="text-lg mb-2">Không có khung giờ</p>
                                            <p className="text-sm">Ngày này không có khung giờ nào khả dụng hoặc đã hết.</p>
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
                                                            setValue('bookingDetails.slot_time_id', slot.id);
                                                            setValue('bookingDetails.time', slot.time);
                                                        }
                                                    }}
                                                    disabled={!slot.available || isLoading || isTimeSlotsLoading}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="h-4 w-4" />
                                                        <div className="text-left">
                                                            <div className="font-medium">{slot.time}</div>
                                                            {/* <div className="text-sm opacity-70">
                                                                {slot.price.toLocaleString("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                })}
                                                            </div> */}
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
                        disabled={!watchedDate || !watchedTime || isLoading || isTimeSlotsLoading}
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