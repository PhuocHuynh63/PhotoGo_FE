"use client"

import { useState } from "react"
import { useLocationAvailability } from "@/utils/hooks/useLocationAvailability"
import CreateWorkingDate from "@pages/Vendor/Settings/Left/CreateWorkingDate"
import ManageWorkingDate from "@pages/Vendor/Settings/Right/ManageWorkingDate"
import { PAGES } from "../../../types/IPages"
import { ILocation } from "@models/locationAvailability/common.model"
import ActionBar from "./components/ActionBar"
import locationAvailabilityService from "@services/locationAvailability"
import { toast } from "react-hot-toast"
import { IUpdateAvailabilityResponse } from "@models/locationAvailability/response.model"

export default function WorkingHoursSettings({ vendor }: PAGES.IWorkingHoursSettingsProps) {
    const [selectedLocation, setSelectedLocation] = useState<string>(vendor?.locations[0]?.id || "") // Default location
    const [locations] = useState<ILocation[]>(vendor?.locations || [])
    const [showActionBar, setShowActionBar] = useState(false)
    const [selectedWorkingDateId, setSelectedWorkingDateId] = useState<string>("")
    const [selectedWorkingDateAvailability, setSelectedWorkingDateAvailability] = useState<boolean>(true)

    // Sử dụng custom hook để fetch working hours
    const {
        data: workingHoursList,
        loading: isLoadingData,
        refetch: fetchWorkingHours
    } = useLocationAvailability({
        locationId: selectedLocation,
        enabled: !!selectedLocation
    })

    const handleUpdateAvailability = async (workingDateId: string, isAvailable: boolean) => {
        try {
            const response = await locationAvailabilityService.updateAvailability({ isAvailable }, workingDateId) as IUpdateAvailabilityResponse
            if (response.statusCode === 200) {
                setShowActionBar(false)
                setSelectedWorkingDateAvailability(isAvailable)
                fetchWorkingHours() // Refresh data after update
                toast.success("Cập nhật thành công")
            } else {
                toast.error("Cập nhật thất bại")
            }
        } catch (error) {
            console.error("Error updating availability:", error)
            toast.error("Cập nhật thất bại")
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Quản lý lịch làm việc</h3>
                <p className="text-sm text-gray-500">Thiết lập lịch làm việc và khung giờ cho các địa điểm của bạn</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Form tạo lịch làm việc mới */}
                    <CreateWorkingDate locations={locations} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} fetchWorkingHours={fetchWorkingHours} />

                    {/* Danh sách lịch làm việc */}
                    <ManageWorkingDate
                        workingHoursList={workingHoursList}
                        isLoadingData={isLoadingData}
                        fetchWorkingHours={fetchWorkingHours}
                        showActionBar={showActionBar}
                        setShowActionBar={setShowActionBar}
                        setSelectedWorkingDateId={setSelectedWorkingDateId}
                        setSelectedWorkingDateAvailability={setSelectedWorkingDateAvailability}
                    />
                </div>
                {showActionBar && (
                    <div className="fixed bottom-0 left-0 right-0 z-50">
                        <ActionBar
                            workingDateId={selectedWorkingDateId}
                            isAvailable={selectedWorkingDateAvailability}
                            onUpdateAvailability={handleUpdateAvailability}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
