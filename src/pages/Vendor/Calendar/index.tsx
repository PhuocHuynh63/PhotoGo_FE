"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/Atoms/ui/button"
import { CalendarDays, List, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/Atoms/ui/alert"
import CalendarView, { type Appointment } from "../Components/Calendars/CalendarView"
import CalendarSidebar from "../Components/Calendars/CalendarSidebar"
import AppointmentTable from "../Components/Appointment/AppointmentTable"
import AppointmentStats from "../Components/Appointment/AppointmentStats"
import RecentAppointments from "../Components/Appointment/RecentAppointments"
import { useLocationOverview, type Booking, type Slot } from "@/utils/hooks/useLocation/useLocationOverview"
import { useVendorLocations } from "@/utils/hooks/useVendorLocations"
import { BOOKING_STATUS } from "@constants/booking"

interface WorkingHours {
    start: string
    end: string
    breakStart: string
    breakEnd: string
}

export default function CalendarManagement({ vendorId }: { vendorId: string | undefined }) {
    const [viewMode, setViewMode] = useState<"calendar" | "appointments">("calendar")
    const [selectedLocationId, setSelectedLocationId] = useState<string>("")
    // Get current week range (Monday to Sunday)
    const getCurrentWeekRange = () => {
        const today = new Date()
        const currentDay = today.getDay()
        const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) // Monday

        const monday = new Date(today)
        monday.setDate(diff)

        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)

        const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}/${month}/${year}`
        }

        return {
            from: formatDate(monday),
            to: formatDate(sunday)
        }
    }

    const [dateRange, setDateRange] = useState(getCurrentWeekRange)

    // Fetch vendor's locations
    const {
        data: vendorLocations,
        loading: locationsLoading,
        error: locationsError,
        refetch: refetchLocations
    } = useVendorLocations(vendorId || '')

    // Convert vendor locations to format expected by CalendarView
    const locations = vendorLocations?.map(location => ({
        id: location.id,
        name: `${location.address}, ${location.district}, ${location.city}`
    })) || []

    // Set default selectedLocationId to first location when locations are loaded
    useEffect(() => {
        if (vendorLocations && vendorLocations.length > 0 && !selectedLocationId) {
            setSelectedLocationId(vendorLocations[0].id)
        }
    }, [vendorLocations, selectedLocationId])
    // Handle date range change from CalendarView
    const handleDateRangeChange = useCallback((from: string, to: string) => {
        setDateRange({ from, to })
        // refetch sẽ tự động được gọi khi dateRange thay đổi
    }, [])

    // Fetch location overview data
    const {
        data: locationOverview,
        loading: locationLoading,
        error: locationError,
        refetch: refetchLocation
    } = useLocationOverview({
        locationId: selectedLocationId,
        from: dateRange.from, // Sử dụng state thay vì hardcode
        to: dateRange.to      // Sử dụng state thay vì hardcode
    })
    // Handle location change
    const handleLocationChange = (locationId: string) => {
        setSelectedLocationId(locationId)
        // refetch sẽ tự động được gọi khi selectedLocationId thay đổi
    }
    // Helper functions để convert location overview data sang format của UI components

    const convertBookingToAppointment = (booking: Booking, slot: Slot): Appointment => {
        const statusMap: Record<string, BOOKING_STATUS> = {
            "đã thanh toán": BOOKING_STATUS.PAID,
            "chờ xử lý": BOOKING_STATUS.PENDING,
            "chờ xác nhận": BOOKING_STATUS.PENDING,
            "đã xác nhận": BOOKING_STATUS.CONFIRMED,
            "đang thực hiện": BOOKING_STATUS.IN_PROGRESS,
            "đã hoàn thành": BOOKING_STATUS.COMPLETED,
            "đã hủy": BOOKING_STATUS.CANCELLED
        }

        const colorMap: Record<string, string> = {
            "đã thanh toán": "green",
            "chờ xử lý": "yellow",
            "đã hủy": "red",
            "chờ xác nhận": "yellow",
            "đã xác nhận": "blue",
            "đang thực hiện": "green",
            "đã hoàn thành": "green"
        }

        const mappedStatus = statusMap[booking.status] || BOOKING_STATUS.PENDING

        // Helper function to format time from "HH:MM:SS" to "HH:MM"
        const formatTime = (timeString: string | null) => {
            if (!timeString) return null
            return timeString.substring(0, 5) // "11:00:00" -> "11:00"
        }

        return {
            id: booking.id,
            title: `${booking.service} - ${booking.fullName}`,
            customerName: booking.fullName,
            customerPhone: booking.phone,
            customerEmail: booking.email,
            service: booking.service,
            package: "Gói Tiêu Chuẩn", // Default package
            date: slot.date,
            alreadyPaid: booking.alreadyPaid,
            remain: booking.remain,
            total: booking.total,
            from: formatTime((slot as unknown as { from: string | null }).from), // Access slot.from
            to: formatTime((slot as unknown as { to: string | null }).to), // Access slot.to
            status: mappedStatus,
            color: colorMap[mappedStatus],
            notes: booking.notes || "",
            location: "Studio", // Default location
        }
    }

    const convertToTodayAppointments = (bookings: Booking[]) => {
        return bookings.map(booking => ({
            id: booking.id,
            customerName: booking.fullName,
            service: booking.service,
            time: (booking as unknown as { from: string | null }).from ?
                (booking as unknown as { from: string | null }).from!.substring(0, 5) : "N/A",
            status: booking.status
        }))
    }

    const convertToUpcomingAppointments = (slots: Slot[]) => {
        return slots.slice(0, 4).map(slot => {
            const firstBooking = slot.bookings[0]
            if (!firstBooking) return null

            return {
                id: firstBooking.id,
                customerName: firstBooking.fullName,
                service: firstBooking.service,
                date: new Date(slot.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                time: (slot as unknown as { from: string | null, to: string | null }).from &&
                    (slot as unknown as { from: string | null, to: string | null }).to ?
                    `${(slot as unknown as { from: string | null, to: string | null }).from!.substring(0, 5)} - ${(slot as unknown as { from: string | null, to: string | null }).to!.substring(0, 5)}` :
                    "09:00 - 11:00",
                status: firstBooking.status
            }
        }).filter((item): item is NonNullable<typeof item> => item !== null)
    }

    // Convert location overview data sang format cho UI components
    const appointments: Appointment[] = locationOverview
        ? locationOverview.slots.flatMap((slot: Slot) =>
            slot.bookings.map((booking: Booking) => convertBookingToAppointment(booking, slot))
        )
        : []
    const todayAppointments = locationOverview
        ? convertToTodayAppointments(locationOverview.todayBookings)
        : []

    const upcomingAppointments = locationOverview
        ? convertToUpcomingAppointments(locationOverview.slots)
        : []

    const stats = locationOverview
        ? {
            totalThisWeek: locationOverview.stats.total,
            confirmedThisWeek: locationOverview.stats.confirmed,
            pendingThisWeek: locationOverview.stats.pending,
            revenueThisWeek: locationOverview.stats.expectedRevenue
        }
        : {
            totalThisWeek: 0,
            confirmedThisWeek: 0,
            pendingThisWeek: 0,
            revenueThisWeek: 0
        }

    const workingHours: WorkingHours = {
        start: "08:00",
        end: "18:00",
        breakStart: "12:00",
        breakEnd: "13:00",
    }

    // Handle appointment update from CalendarView
    const handleAppointmentUpdate = useCallback((updatedAppointment: Appointment) => {
        // Refetch data to get the latest state from server
        console.log('Appointment updated:', updatedAppointment.id)
        refetchLocation()
    }, [refetchLocation])

    return (
        <div>
            {/* Header với toggle buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Quản lý lịch làm việc</h2>
                    <p className="text-sm text-gray-500">
                        {viewMode === "calendar"
                            ? "Theo dõi lịch hẹn và quản lý thời gian làm việc"
                            : "Quản lý các đơn đặt lịch của khách hàng"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Toggle Buttons */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <Button
                            variant={viewMode === "calendar" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("calendar")}
                            className={`cursor-pointer gap-2 ${viewMode === "calendar" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                            disabled={locationLoading}
                        >
                            <CalendarDays className="h-4 w-4" />
                            Lịch
                        </Button>
                        <Button
                            variant={viewMode === "appointments" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("appointments")}
                            className={`cursor-pointer gap-2 ${viewMode === "appointments" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                            disabled={locationLoading}
                        >
                            <List className="h-4 w-4" />
                            Danh sách
                        </Button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {(locationLoading || locationsLoading) && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-gray-500">
                        {locationsLoading ? "Đang tải danh sách địa điểm..." : "Đang tải dữ liệu lịch làm việc..."}
                    </p>
                </div>
            )}

            {/* Error State */}
            {(locationError || locationsError) && !locationLoading && !locationsLoading && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                        <div className="flex flex-col gap-2">
                            <span>
                                {locationsError
                                    ? `Không thể tải danh sách địa điểm: ${locationsError}`
                                    : "Không thể tải dữ liệu lịch làm việc. Vui lòng thử lại."}
                            </span>
                            <div className="flex gap-2">
                                {locationsError && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => refetchLocations()}
                                        className="w-fit"
                                    >
                                        Thử lại tải địa điểm
                                    </Button>
                                )}
                                {locationError && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => refetchLocation()}
                                        className="w-fit"
                                    >
                                        Thử lại tải lịch
                                    </Button>
                                )}
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Content based on view mode */}
            {!locationLoading && !locationsLoading && !locationError && !locationsError && locations.length > 0 && selectedLocationId && (
                <>
                    {viewMode === "calendar" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-3">
                                <CalendarView
                                    appointments={appointments}
                                    workingHours={workingHours}
                                    locations={locations}
                                    selectedLocationId={selectedLocationId}
                                    onLocationChange={handleLocationChange}
                                    onDateRangeChange={handleDateRangeChange}
                                    isLoading={locationLoading}
                                    onAppointmentUpdate={handleAppointmentUpdate}
                                />
                            </div>
                            <div className="space-y-4">
                                <CalendarSidebar
                                    todayAppointments={todayAppointments}
                                    upcomingAppointments={upcomingAppointments}
                                    stats={stats}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <AppointmentTable appointments={appointments} />
                            </div>
                            <div className="space-y-6">
                                <AppointmentStats appointments={appointments} />
                                <RecentAppointments appointments={appointments} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
