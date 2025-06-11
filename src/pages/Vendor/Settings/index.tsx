"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { IVendor } from "@models/vendor/common.model"
import locationAvailabilityService from "@services/locationAvailability"
import CreateWorkingDate from "@pages/Vendor/Settings/Left/CreateWorkingDate"
import ManageWorkingDate from "@pages/Vendor/Settings/Right/ManageWorkingDate"

interface Location {
    id: string
    address: string
    district: string
    ward: string
    city: string
}

interface SlotTime {
    id: string
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
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [workingHoursList, setWorkingHoursList] = useState<WorkingHoursData[]>([])
    const [selectedLocation, setSelectedLocation] = useState<string>(vendor?.locations[0]?.id || "") // Default location
    const [locations] = useState<Location[]>(vendor?.locations || [])

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

    useEffect(() => {
        fetchWorkingHours()
    }, [selectedLocation])

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Quản lý lịch làm việc</h3>
                <p className="text-sm text-gray-500">Thiết lập lịch làm việc và khung giờ cho các địa điểm của bạn</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Form tạo lịch làm việc mới */}
                    <CreateWorkingDate locations={locations} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} fetchWorkingHours={fetchWorkingHours} />

                    {/* Danh sách lịch làm việc */}
                    <ManageWorkingDate workingHoursList={workingHoursList} isLoadingData={isLoadingData} fetchWorkingHours={fetchWorkingHours} />

                </div>
            </div>
        </div>
    )
}
