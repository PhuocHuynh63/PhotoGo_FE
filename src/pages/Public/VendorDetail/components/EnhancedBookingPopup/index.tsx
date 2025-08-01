"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Package, MapPin, Info } from "lucide-react";
import { useSession, useUser } from "@stores/user/selectors";
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
import { IUser } from "@models/user/common.model";
import { USER } from "@constants/user";

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
    const user = useUser() as IUser;
    const router = useRouter();
    const addressLocation = useAddressLocation();
    const vendor = useVendor();

    // Condition to check booking type
    const isMultiDay = serviceConcept?.conceptRangeType === 'nhiều ngày';

    const [isLoading, setIsLoading] = useState(false);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<ICheckoutSessionRequest>({
        defaultValues: {
            singleDayBookingDetails: undefined,
            multiDaysBookingDetails: undefined,
            conceptRangeType: serviceConcept?.conceptRangeType || '',
            conceptId: serviceConcept?.id || "",
            price: serviceConcept?.price || 0,
            vendorDetails: { id: vendor?.id || "", name: vendor?.name || "" },
            locationDetails: { id: addressLocation?.id || "", address: addressLocation?.address || "" },
        }
    });

    const watchedDate = watch('singleDayBookingDetails.date');
    const watchedDates = watch('multiDaysBookingDetails');
    const watchedTime = watch('singleDayBookingDetails.slot_time_id');

    useEffect(() => {
        setValue('conceptRangeType', serviceConcept?.conceptRangeType || 'một ngày');
    }, [serviceConcept?.conceptRangeType, setValue]);

    const { locationAvailability } = useLocationAvailability({
        locationId: addressLocation?.id || "",
        conceptRangeType: serviceConcept?.conceptRangeType,
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
            singleDayBookingDetails: undefined,
            multiDaysBookingDetails: undefined,
            conceptRangeType: serviceConcept?.conceptRangeType || '',
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
                setValue('multiDaysBookingDetails', dateRange.map(d => d.toISOString()));
                toast.success(`Đã chọn chuỗi ${numberOfDays} ngày.`);
            } else {
                setValue('multiDaysBookingDetails', []);
                toast.error(`Không thể chọn chuỗi ${numberOfDays} ngày liên tiếp. Vui lòng chọn ngày bắt đầu khác.`);
            }
        } else {
            setValue('singleDayBookingDetails.date', selected.date ? selected.date.toISOString() : "");
            setValue('singleDayBookingDetails.working_date_id', selected.id);
            setValue('singleDayBookingDetails.time', "");
            setValue('singleDayBookingDetails.slot_time_id', "");
        }
    };

    const onSubmit = async (data: ICheckoutSessionRequest) => {
        const userId = user?.id;
        if (!userId) {
            toast.error('Bạn cần đăng nhập để đặt lịch hẹn');
            router.replace(ROUTES.AUTH.LOGIN);
            return;
        }

        setIsLoading(true);
        const id = generateUUIDV4();
        let bookingData: ICheckoutSessionRequest;

        if (isMultiDay) {
            if (!data.multiDaysBookingDetails || data.multiDaysBookingDetails.length === 0) {
                toast.error('Vui lòng chọn khoảng ngày để đặt lịch.');
                setIsLoading(false);
                return;
            }
            bookingData = {
                ...data,
                multiDaysBookingDetails: data.multiDaysBookingDetails.map(date => format(new Date(date), 'dd/MM/yyyy')),
            };
        } else {
            if (!data.singleDayBookingDetails?.date || !data.singleDayBookingDetails.slot_time_id) {
                toast.error('Vui lòng chọn ngày và khung giờ để đặt lịch hẹn.');
                setIsLoading(false);
                return;
            }
            bookingData = {
                ...data,
                singleDayBookingDetails: {
                    ...data.singleDayBookingDetails,
                    date: format(new Date(data.singleDayBookingDetails.date), 'dd/MM/yyyy'),
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

    /**
     * Tăng giá nếu đặt sát ngày
     */
    let bookingPrice = Number(serviceConcept?.price) || 0;
    let isIncrease = false;
    let daysDiff = 0;
    if (isBookingReady && !user?.subscription?.id) {
        let compareDate;
        if (isMultiDay && watchedDates && watchedDates.length > 0) {
            compareDate = new Date(watchedDates[0]);
        } else if (!isMultiDay && watchedDate) {
            compareDate = new Date(watchedDate);
        }
        if (compareDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            compareDate.setHours(0, 0, 0, 0);
            daysDiff = Math.floor((compareDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            // Chỉ cộng thêm 10% nếu ngày đặt là 1, 2, hoặc 3 ngày sau hôm nay
            if (daysDiff >= 1 && daysDiff <= 3) {
                bookingPrice = Math.round(bookingPrice * 1.05);
                isIncrease = true;
            }
        }
    }

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
                                            {bookingPrice.toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                            {isIncrease && !user?.subscription?.id && (
                                                <span className="ml-2 text-xs text-yellow-600 font-semibold">(+5% do đặt trước {daysDiff} ngày)</span>
                                            )}
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

                                <div className="mb-3 p-2 text-sm text-orange-800 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-2">
                                    <Info className="h-5 w-5 flex-shrink-0" />
                                    <span>Nếu bạn đặt lịch trong vòng 3 ngày tới, hệ thống sẽ tính thêm phụ phí đặt lịch gấp.</span>
                                </div>

                                <CustomCalendar
                                    selected={calendarSelection}
                                    onDateSelect={handleDateSelect}
                                    availability={availability}
                                    mode={isMultiDay ? 'range' : 'single'}
                                />
                                {errors.singleDayBookingDetails?.date && <p className="text-red-500 text-sm mt-1">{errors.singleDayBookingDetails.date.message}</p>}
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
                                                                setValue('singleDayBookingDetails.slot_time_id', slot.id);
                                                                setValue('singleDayBookingDetails.time', slot.time);
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

                    {(user?.role?.id === USER.USER_ROLES_ID.CUSTOMER || !user?.role?.id) ? (
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            disabled={!isBookingReady || isLoading}
                            size="lg"
                            className="min-w-[180px]"
                        >
                            {isLoading ? 'Đang xác nhận...' : 'Xác nhận đặt lịch'}
                        </Button>
                    ) : (
                        <Button
                            disabled={true}
                            size="lg"
                            className="min-w-[180px]"
                        >
                            Bạn không có quyền đặt lịch
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}