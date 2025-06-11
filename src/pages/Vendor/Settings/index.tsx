"use client"

import { useState } from "react"
import { useLocationAvailability } from "@/utils/hooks/useLocationAvailability"
import CreateWorkingDate from "@pages/Vendor/Settings/Left/CreateWorkingDate"
import ManageWorkingDate from "@pages/Vendor/Settings/Right/ManageWorkingDate"
import { PAGES } from "../../../types/IPages"
import { ILocation } from "@models/locationAvailability/common.model"

export default function WorkingHoursSettings({ vendor }: PAGES.IWorkingHoursSettingsProps) {
    const [selectedLocation, setSelectedLocation] = useState<string>(vendor?.locations[0]?.id || "") // Default location
    const [locations] = useState<ILocation[]>(vendor?.locations || [])

    // Sử dụng custom hook để fetch working hours
    const {
        data: workingHoursList,
        loading: isLoadingData,
        refetch: fetchWorkingHours
    } = useLocationAvailability({
        locationId: selectedLocation,
        enabled: !!selectedLocation
    })

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
