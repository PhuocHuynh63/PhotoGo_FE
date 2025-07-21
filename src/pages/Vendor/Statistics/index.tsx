"use client"
import StatisticsCharts from "@pages/Vendor/Components/Statistics/StatisticsChart"
import StatisticsOverview from "@pages/Vendor/Components/Statistics/StatisticsOverview"
import { ILocation } from "@models/location/common.model"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select"
import { useEffect, useState } from "react"
import { useFinanceOverview } from "@utils/hooks/useFinance/useFinanceOverview"
import { IBookingOverview } from '@models/overview/common.model';
import { Alert, AlertTitle, AlertDescription } from "@components/Atoms/ui/alert";
import LucideIcon from "@components/Atoms/LucideIcon";
import { Loader2 } from "lucide-react"


export default function BookingPage({ locations = [] }: { locations: ILocation[] }) {

    const [selectedLocationId, setSelectedLocationId] = useState<string>(locations?.[0]?.id || "");
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [startDate, setStartDate] = useState<Date | null>(new Date(`${currentYear}-01-01`));
    const [endDate, setEndDate] = useState<Date | null>(new Date(`${currentYear}-12-31`));

    useEffect(() => {
        setStartDate(new Date(`${selectedYear}-01-01`));
        setEndDate(new Date(`${selectedYear}-12-31`));
    }, [selectedYear]);

    function formatDateDMY(date: Date) {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    }

    const { data, loading, error, refetch } = useFinanceOverview({
        locationId: selectedLocationId,
        startDate: startDate ? formatDateDMY(startDate) : formatDateDMY(new Date()),
        endDate: endDate ? formatDateDMY(endDate) : formatDateDMY(new Date()),
        type: 'booking'
    });

    useEffect(() => {
        refetch();
    }, [selectedLocationId, startDate, endDate, refetch]);

    // Type guard for booking overview
    function isBookingOverview(data: unknown): data is IBookingOverview {
        return (
            typeof data === 'object' &&
            data !== null &&
            'totalAppointments' in data &&
            typeof (data as { totalAppointments?: unknown }).totalAppointments === 'number'
        );
    }

    return (


        <div className="space-y-4">
            {/* Loading/Error/Refetch UI */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin w-4 h-4">
                            <Loader2 className="animate-spin" />
                        </div>
                        <span className="mt-4 text-gray-100 text-lg animate-pulse drop-shadow">Đang tải dữ liệu...</span>
                    </div>
                </div>
            )}
            {error && (
                <div className="flex justify-center py-4">
                    <Alert variant="destructive" className="max-w-md w-full flex items-center gap-3">
                        <LucideIcon name="AlertCircle" iconColor="#ef4444" iconSize={24} className="shrink-0" />
                        <div>
                            <AlertTitle className="text-red-600">Đã xảy ra lỗi</AlertTitle>
                            <AlertDescription className="mb-2">Không thể tải dữ liệu. Vui lòng thử lại.</AlertDescription>
                            <button
                                onClick={() => refetch()}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow"
                            >
                                Thử lại
                            </button>
                        </div>
                    </Alert>
                </div>
            )}
            {!loading && !error && (
                <button className="mb-2 px-3 py-1 bg-orange-500 text-white rounded" onClick={() => refetch()}>Làm mới</button>
            )}
            <div className="flex justify-between">

                <div>
                    <h2 className="text-xl font-semibold">Thống kê</h2>
                    <p className="text-sm text-gray-500">Xem thống kê hoạt động của bạn</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={selectedLocationId}
                        onValueChange={value => setSelectedLocationId(value)}
                        disabled={!Array.isArray(locations) || locations.length === 0}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={
                                !Array.isArray(locations) || locations.length === 0
                                    ? "Không có địa điểm"
                                    : "Chọn địa điểm"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.isArray(locations) && locations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                    {location.address}, {location.ward}, {location.district}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div>
                        <Select
                            value={selectedYear.toString()}
                            onValueChange={y => setSelectedYear(Number(y))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn năm" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(y => (
                                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div>
                <StatisticsOverview
                    data={{
                        totalBookings: isBookingOverview(data) ? data.totalAppointments : 0,
                        completedBookings: isBookingOverview(data) ? data.completedAppointments : 0,
                        cancelledBookings: isBookingOverview(data) ? data.cancelledAppointments : 0,
                        pendingBookings: isBookingOverview(data) ? data.pendingAppointments : 0,
                        totalRevenue: 0, // Không có trường này trong data mới, để 0 hoặc map trường phù hợp nếu có
                        averageRating: isBookingOverview(data) ? data.averageRating : 0,
                    }}
                />
                <StatisticsCharts
                    data={isBookingOverview(data) ? data.monthlyBookings.map(item => ({
                        month: item.month.toString(),
                        monthName: item.monthName,
                        count: item.bookings
                    })) : []}
                />
            </div>
        </div>

    )
}

