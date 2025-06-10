"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/Atoms/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Input } from "@/components/Atoms/ui/input"
import { Label } from "@/components/Atoms/ui/label"
import { Calendar } from "@/components/Atoms/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Atoms/ui/popover"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, Clock, Plus, Loader2, RefreshCw } from "lucide-react"
import { Badge } from "@/components/Atoms/ui/badge"
import { Switch } from "@/components/Atoms/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Atoms/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/Atoms/ui/alert"
import toast from "react-hot-toast"
import { cn } from "@utils/helpers/CN"
import { IVendorResponse } from "@models/vendor/response.model"
import { IVendor } from "@models/vendor/common.model"
import locationAvailabilityService from "@services/locationAvailability"

interface Location {
    id: string
    address: string
    district: string
    ward: string
    city: string
}

interface SlotTime {
    slot: number
    startSlotTime: string
    endSlotTime: string
    isStrictTimeBlocking: boolean
    maxParallelBookings: number
}

interface WorkingHoursData {
    id: string
    startTime: string
    endTime: string
    isAvailable: boolean
    createdAt: string
    updatedAt: string
    location: Location
    workingDates: string[]
    slotTimes: SlotTime[]
}

export default function WorkingHoursSettings({ vendor }: { vendor: IVendor }) {
    // console.log(vendor)
    // State for form
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [startTime, setStartTime] = useState("08:00")
    const [endTime, setEndTime] = useState("19:00")
    const [isAvailable, setIsAvailable] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [workingHoursList, setWorkingHoursList] = useState<WorkingHoursData[]>([])
    const [selectedLocation, setSelectedLocation] = useState<string>(vendor?.locations[0]?.id || "") // Default location
    const [locations, setLocations] = useState<Location[]>(vendor?.locations || [])

    // Fetch working hours data
    const fetchWorkingHours = async () => {
        setIsLoadingData(true)
        try {
            const result = await locationAvailabilityService.getLocationAvailabilityByLocationId(selectedLocation)
            console.log(result)
            if (result.statusCode === 200) {
                setWorkingHoursList(result?.data.data as WorkingHoursData[])
            } else {
                toast.error("Không thể tải dữ liệu lịch làm việc")
            }
        } catch (error) {
            console.error("Error fetching working hours:", error)
            toast.error("Đã xảy ra lỗi khi tải dữ liệu lịch làm việc")
        } finally {
            setIsLoadingData(false)
        }
    }

    // Load data on mount and when location changes
    useEffect(() => {
        fetchWorkingHours()
    }, [selectedLocation, date])

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!date) {
            toast.error("Vui lòng chọn ngày bắt đầu")
            return
        }

        setIsLoading(true)
        try {
            const formattedDate = format(date, "dd/MM/yyyy")
            // const result = await createWorkingHours({
            //     locationId: selectedLocation,
            //     date: formattedDate,
            //     startTime,
            //     endTime,
            //     isAvailable,
            // })

            toast.success("Đã tạo lịch làm việc cho 7 ngày liên tục")
            fetchWorkingHours() // Refresh data
        } catch (error) {
            console.error("Error creating working hours:", error)
            toast.error("Đã xảy ra lỗi khi tạo lịch làm việc")
        } finally {
            setIsLoading(false)
        }
    }

    // Handle creating time slots
    const handleCreateTimeSlots = async (workingHoursId: string) => {
        setIsLoadingSlots(true)
        try {
            // const result = await createTimeSlots({
            //     locationAvailabilityId: workingHoursId,
            //     isStrictTimeBlocking: true,
            //     maxParallelBookings: 1,
            // })

            toast.success("Đã tạo các khung giờ làm việc")
            fetchWorkingHours() // Refresh data
        } catch (error) {
            console.error("Error creating time slots:", error)
            toast.error("Đã xảy ra lỗi khi tạo khung giờ làm việc")
        } finally {
            setIsLoadingSlots(false)
        }
    }

    // Format time for display
    const formatTime = (time: string) => {
        return time.substring(0, 5)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Quản lý lịch làm việc</h3>
                <p className="text-sm text-gray-500">Thiết lập lịch làm việc và khung giờ cho các địa điểm của bạn</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Form tạo lịch làm việc mới */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Tạo lịch làm việc mới</CardTitle>
                            <CardDescription>Tạo lịch làm việc cho 7 ngày liên tục từ ngày được chọn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Địa điểm</Label>
                                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn địa điểm" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((location) => (
                                                <SelectItem key={location.id} value={location.id}>
                                                    {location.address}, {location.district} - {location.ward}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Ngày bắt đầu</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={vi} />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">Giờ bắt đầu</Label>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                            <Input
                                                id="startTime"
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="endTime">Giờ kết thúc</Label>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                            <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch id="isAvailable" checked={isAvailable} onCheckedChange={setIsAvailable} />
                                    <Label htmlFor="isAvailable">Có thể đặt lịch</Label>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tạo lịch làm việc
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Danh sách lịch làm việc */}
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Lịch làm việc đã tạo</CardTitle>
                                <CardDescription>Quản lý các lịch làm việc và khung giờ</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchWorkingHours} disabled={isLoadingData}>
                                <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingData && "animate-spin")} />
                                Làm mới
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {isLoadingData ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            ) : workingHoursList.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full">
                                    {workingHoursList?.map((workingHours) => (
                                        <AccordionItem key={workingHours.id} value={workingHours.id}>
                                            <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                                                <div className="flex flex-col items-start text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {formatTime(workingHours.startTime)} - {formatTime(workingHours.endTime)}
                                                        </span>
                                                        <Badge variant={workingHours.isAvailable ? "default" : "outline"}>
                                                            {workingHours.isAvailable ? "Hoạt động" : "Không hoạt động"}
                                                        </Badge>
                                                    </div>
                                                    {/* <span className="text-sm text-gray-500">
                                                        {workingHours?.workingDates?.length} ngày từ {workingHours?.workingDates[0]} đến{" "}
                                                        {workingHours?.workingDates[workingHours?.workingDates?.length - 1]}
                                                    </span> */}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4">
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {workingHours.workingDates?.map((date) => (
                                                            <Badge key={date} variant="outline">
                                                                {date}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="border rounded-md p-4">
                                                        <h4 className="font-medium mb-2">Khung giờ làm việc</h4>

                                                        {workingHours.slotTimes?.length > 0 ? (
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                                {workingHours.slotTimes?.map((slot) => (
                                                                    <div key={slot.slot} className="border rounded-md p-2 flex flex-col">
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="font-medium">Slot {slot.slot}</span>
                                                                            <Badge variant="outline" className="text-xs">
                                                                                {slot.maxParallelBookings} lịch
                                                                            </Badge>
                                                                        </div>
                                                                        <span className="text-sm">
                                                                            {formatTime(slot.startSlotTime)} - {formatTime(slot.endSlotTime)}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                <Alert>
                                                                    <AlertTitle>Chưa có khung giờ</AlertTitle>
                                                                    <AlertDescription>
                                                                        Lịch làm việc này chưa có khung giờ. Bấm nút bên dưới để tạo các khung giờ tự động.
                                                                    </AlertDescription>
                                                                </Alert>
                                                                <Button
                                                                    onClick={() => handleCreateTimeSlots(workingHours.id)}
                                                                    disabled={isLoadingSlots}
                                                                    className="w-full"
                                                                >
                                                                    {isLoadingSlots ? (
                                                                        <>
                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                            Đang tạo...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Plus className="mr-2 h-4 w-4" />
                                                                            Tạo khung giờ tự động
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className="text-center py-8 border rounded-md">
                                    <p className="text-gray-500">Chưa có lịch làm việc nào được tạo</p>
                                    <p className="text-sm text-gray-400 mt-1">Sử dụng form bên trái để tạo lịch làm việc mới</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
