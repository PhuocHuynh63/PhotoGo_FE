"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Package, MapPin } from "lucide-react";
import { useSession } from "@stores/user/selectors";
import { useRouter } from "next/navigation";
import { useAddressLocation, useVendor } from "@stores/vendor/selectors";
import { useLocationAvailability, useLocationAvailabilityByLocationIdAndDate } from "@utils/hooks/useLocationAvailability";
import { useForm } from "react-hook-form";
import { format, addDays } from "date-fns";
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
import { METADATA } from "../../../../../types/IMetadata";

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
    const session = useSession() as METADATA.ISession;
    const router = useRouter();
    const addressLocation = useAddressLocation();
    const vendor = useVendor();

    // Condition to check booking type
    const isMultiDay = serviceConcept?.conceptRangeType === 'nhiều ngày';

    const [isLoading, setIsLoading] = useState(false);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    console.log('timeSlots', timeSlots);


    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<ICheckoutSessionRequest>({
        defaultValues: {
            bookingDetails: {
                date: "",
                dates: [],
                time: "",
                working_date_id: "",
                slot_time_id: "",
                duration: serviceConcept?.duration || 0,
            },
            conceptId: serviceConcept?.id || "",
            price: serviceConcept?.price || 0,
            vendorDetails: { id: vendor?.id || "", name: vendor?.name || "" },
            locationDetails: { id: addressLocation?.id || "", address: addressLocation?.address || "" },
        }
    });

    const watchedDate = watch('bookingDetails.date');
    const watchedDates = watch('bookingDetails.dates');
    const watchedTime = watch('bookingDetails.slot_time_id');

    const { locationAvailability } = useLocationAvailability({
        locationId: addressLocation?.id || "",
        conceptRangeType: serviceConcept?.conceptRangeType,
        enabled: !!addressLocation?.id,
    });

    console.log('locationAvailability', locationAvailability);


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

    const {
        locationAvailabilitySelectDate,
        loading: isTimeSlotsLoading,
    } = useLocationAvailabilityByLocationIdAndDate({
        locationId: addressLocation?.id || "",
        date: watchedDate ? format(new Date(watchedDate), 'dd/MM/yyyy') : "",
        // enabled: !isMultiDay && !!watchedDate && !!addressLocation?.id
    });

    useEffect(() => {
        reset({
            bookingDetails: {
                date: "",
                dates: [],
                time: "",
                working_date_id: "",
                slot_time_id: "",
                duration: serviceConcept?.duration || 0,
            },
            conceptId: serviceConcept?.id || "",
            price: serviceConcept?.price || 0,
            vendorDetails: { id: vendor?.id || "", name: vendor?.name || "" },
            locationDetails: { id: addressLocation?.id || "", address: addressLocation?.address || "" },
        })
    }, [serviceConcept, addressLocation, vendor, reset]);

    useEffect(() => {
        if (isMultiDay) {
            setTimeSlots([]);
            return;
        }
        if (locationAvailabilitySelectDate && locationAvailabilitySelectDate.length > 0) {
            const firstLocationAvailability = locationAvailabilitySelectDate[0] as any;
            const availableSlots = firstLocationAvailability.slotTimeWorkingDates.map((slotDetail: any) => ({
                id: slotDetail.id,
                time: `${slotDetail.startSlotTime.substring(0, 5)}`,
                price: Number(serviceConcept?.price || 0),
                available: slotDetail.isAvailable && (slotDetail.maxParallelBookings - slotDetail.alreadyBooked) > 0,
            }));

            availableSlots.sort((a: any, b: any) => a.time.localeCompare(b.time));

            setTimeSlots(availableSlots);
        } else if (watchedDate && !isTimeSlotsLoading) {
            setTimeSlots([]);
        } else if (!watchedDate) {
            setTimeSlots([]);
        }
    }, [locationAvailabilitySelectDate, watchedDate, isTimeSlotsLoading, serviceConcept?.price, isMultiDay]);

    const selectedSlotData = timeSlots.find((slot) => slot.id === watchedTime);

    const handleDateSelect = (selected: { date: Date, id: string }) => {
        if (isMultiDay) {
            const startDate = selected.date;
            const numberOfDays = serviceConcept?.numberOfDays || 1;
            const availableDateTimes = new Set(availability.map(a => a.date.setHours(0, 0, 0, 0)));
            const dateRange: Date[] = [];
            let allDaysAvailable = true;

            for (let i = 0; i < numberOfDays; i++) {
                const currentDate = addDays(startDate, i);
                currentDate.setHours(0, 0, 0, 0);
                if (availableDateTimes.has(currentDate.getTime())) {
                    dateRange.push(currentDate);
                } else {
                    allDaysAvailable = false;
                    break;
                }
            }

            if (allDaysAvailable) {
                // Store the full array of dates in the form state for submission
                setValue('bookingDetails.dates', dateRange.map(d => d.toISOString()));
                setValue('bookingDetails.date', ""); // Clear single date selection
                toast.success(`Đã chọn chuỗi ${numberOfDays} ngày.`);
            } else {
                setValue('bookingDetails.dates', []);
                toast.error(`Không thể chọn chuỗi ${numberOfDays} ngày liên tiếp. Vui lòng chọn ngày bắt đầu khác.`);
            }
        } else {
            setValue('bookingDetails.date', selected.date ? selected.date.toISOString() : "");
            setValue('bookingDetails.working_date_id', selected.id);
            setValue('bookingDetails.time', "");
            setValue('bookingDetails.slot_time_id', "");
            setValue('bookingDetails.dates', []);
        }
    };

    const onSubmit = async (data: ICheckoutSessionRequest) => {
        const userId = session?.user?.id;
        if (!userId) {
            toast.error('Bạn cần đăng nhập để đặt lịch hẹn');
            router.replace(ROUTES.AUTH.LOGIN);
            return;
        }

        setIsLoading(true);
        const id = generateUUIDV4();
        let bookingData: ICheckoutSessionRequest;

        if (isMultiDay) {
            if (!data.bookingDetails.dates || data.bookingDetails.dates.length === 0) {
                toast.error('Vui lòng chọn khoảng ngày để đặt lịch.');
                setIsLoading(false);
                return;
            }
            bookingData = {
                ...data,
                bookingDetails: {
                    ...data.bookingDetails,
                    dates: data.bookingDetails.dates.map(d => format(new Date(d), 'dd/MM/yyyy')),
                    date: '', time: '', slot_time_id: '', working_date_id: '',
                }
            };
        } else {
            if (!data.bookingDetails.date || !data.bookingDetails.slot_time_id) {
                toast.error('Vui lòng chọn ngày và khung giờ để đặt lịch hẹn.');
                setIsLoading(false);
                return;
            }
            bookingData = {
                ...data,
                bookingDetails: {
                    ...data.bookingDetails,
                    date: format(new Date(data.bookingDetails.date), 'dd/MM/yyyy'),
                    dates: undefined,
                }
            };
        }

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

    const isBookingReady = isMultiDay
        ? (watchedDates && watchedDates.length > 0)
        : (watchedDate && watchedTime);

    // **FIX**: Prepare the correct prop for the calendar's visual state.
    // For range mode, it needs an object { from: Date, to: Date }.
    const calendarSelection = isMultiDay
        ? (watchedDates && watchedDates.length > 0
            ? { from: new Date(watchedDates[0]), to: new Date(watchedDates[watchedDates.length - 1]) }
            : undefined)
        : (watchedDate ? new Date(watchedDate) : undefined);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="xl:max-w-[1200px] max-h-[100vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Calendar className="h-6 w-6" />
                        Đặt lịch dịch vụ
                    </DialogTitle>
                </DialogHeader>

                <div className={`grid grid-cols-1 ${isMultiDay ? 'xl:grid-cols-2' : 'xl:grid-cols-3'} gap-6`}>
                    {/* Column 1: Service Info & Booking Summary */}
                    <div className="space-y-4">
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
                                        <span>
                                            Thời gian thực hiện: {isMultiDay ? `${serviceConcept?.numberOfDays} ngày` : `${serviceConcept?.duration} phút`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{addressLocation?.address}</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Giá dịch vụ</div>
                                    <div className="text-xl font-bold text-primary">
                                        {Number(serviceConcept?.price).toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Booking Summary */}
                        {isBookingReady && (
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader>
                                    <CardTitle className="text-lg text-green-800">Tóm tắt đặt lịch</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {isMultiDay ? (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-700">Từ ngày:</span>
                                                <span className="font-medium">{watchedDates ? new Date(watchedDates[0]).toLocaleDateString("vi-VN") : ""}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-700">Đến ngày:</span>
                                                <span className="font-medium">{watchedDates ? new Date(watchedDates[watchedDates.length - 1]).toLocaleDateString("vi-VN") : ""}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-700">Ngày:</span>
                                                <span className="font-medium">{watchedDate ? new Date(watchedDate).toLocaleDateString("vi-VN") : ""}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-700">Giờ:</span>
                                                <span className="font-medium">{selectedSlotData?.time}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700">Dịch vụ:</span>
                                        <span className="font-medium">{serviceConcept?.name}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-green-800">Tổng tiền:</span>
                                        <span className="font-bold text-lg text-green-800">
                                            {Number(serviceConcept?.price).toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Column 2: Calendar */}
                    <div className="xl:col-span-1">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{isMultiDay ? 'Chọn ngày bắt đầu' : 'Chọn ngày'}</h3>
                                <CustomCalendar
                                    selected={calendarSelection}
                                    onDateSelect={handleDateSelect}
                                    availability={availability}
                                    mode={isMultiDay ? 'range' : 'single'}
                                />
                                {errors.bookingDetails?.date && <p className="text-red-500 text-sm mt-1">{errors.bookingDetails.date.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Time Slots (Only for single day) */}
                    {!isMultiDay && (
                        <div className="xl:col-span-1">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Chọn khung giờ
                                        {watchedDate && (
                                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                                - {new Date(watchedDate).toLocaleDateString("vi-VN")}
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
                                                        className={`w-full justify-between h-auto p-4 cursor-pointer ${!slot.available ? "opacity-50 cursor-not-allowed bg-muted" : ""}`}
                                                        onClick={() => {
                                                            if (slot.available) {
                                                                setValue('bookingDetails.slot_time_id', slot.id);
                                                                setValue('bookingDetails.time', slot.time);
                                                            }
                                                        }}
                                                        disabled={!slot.available || isLoading}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Clock className="h-4 w-4" />
                                                            <div className="text-left">
                                                                <div className="font-medium">{slot.time}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {!slot.available && <Badge variant="destructive" className="text-xs">Đã đặt</Badge>}
                                                            {slot.available && watchedTime === slot.id && <Badge variant="secondary" className="text-xs">Đã chọn</Badge>}
                                                        </div>
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button variant="outline" onClick={onClose} size="lg" disabled={isLoading}>
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={!isBookingReady || isLoading}
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