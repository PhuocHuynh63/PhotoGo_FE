import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/Atoms/ui/card'
import { Button } from '@components/Atoms/ui/button'
import { Calendar, RefreshCw } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { cn } from '@utils/helpers/CN'
import locationAvailabilityService from '@services/locationAvailability'
import { toast } from 'react-hot-toast'
import { PAGES } from '../../../../../types/IPages'
import { ILocationScheduleResponse } from '@models/locationAvailability/response.model'
import React, { useState, useEffect } from 'react'

import YearSelector from './components/YearSelector'
import MonthList from './components/MonthList'
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog'
import { formatTime, getAllYears, getMonthFromDate, getMonthName, getWeekdayLabel, getWeekFromDate, groupWorkingHoursByMonthAndWeek } from '@utils/helpers/Date'

const ManageWorkingDate = ({ workingHoursList, isLoadingData, fetchWorkingHours, setShowActionBar, setSelectedWorkingDateId, setSelectedWorkingDateAvailability }: PAGES.IManageWorkingDateProps) => {
    const [selectedDateForSlots, setSelectedDateForSlots] = useState<{ [key: string]: string }>({})
    const [editingSlot, setEditingSlot] = useState<{ workingDateId: string, slotTimeId: string, selectedDate: string } | null>(null)
    const [editingMaxBookings, setEditingMaxBookings] = useState(1)
    const [isUpdatingSlot, setIsUpdatingSlot] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [workingHoursToDelete, setWorkingHoursToDelete] = useState<string | null>(null)
    const [isDeletingWorkingHours, setIsDeletingWorkingHours] = useState(false)
    const [selectedYear, setSelectedYear] = useState<number>(() => {
        const now = new Date()
        return now.getFullYear()
    })
    const [activeMonth, setActiveMonth] = useState<string | null>(null)
    const [prevSelectedDate, setPrevSelectedDate] = useState<string | null>(null)

    const years = getAllYears(workingHoursList)
    const groupedData = groupWorkingHoursByMonthAndWeek(workingHoursList, selectedYear)

    // Reset ActionBar animation when selected date changes
    useEffect(() => {
        const currentSelectedDate = Object.values(selectedDateForSlots)[0]
        if (currentSelectedDate && currentSelectedDate !== prevSelectedDate) {
            // Temporarily hide ActionBar
            setShowActionBar(false)
            setSelectedWorkingDateId("")
            setSelectedWorkingDateAvailability(true)

            // Show ActionBar again after a short delay
            setTimeout(() => {
                const workingHoursId = Object.keys(selectedDateForSlots)[0]
                const workingDate = workingHoursList.find(wh => wh.id === workingHoursId)
                if (workingDate) {
                    setShowActionBar(true)
                    setSelectedWorkingDateId(workingDate.workingDates[0].id)
                    setSelectedWorkingDateAvailability(workingDate.workingDates[0].isAvailable)
                }
            }, 50)

            setPrevSelectedDate(currentSelectedDate)
        }
    }, [selectedDateForSlots])

    const handleDeleteWorkingHours = async (workingHoursId: string, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent accordion from toggling
        setWorkingHoursToDelete(workingHoursId)
        setShowDeleteModal(true)
    }

    const confirmDeleteWorkingHours = async () => {
        if (!workingHoursToDelete) return

        setIsDeletingWorkingHours(true)
        try {
            const result = await locationAvailabilityService.deleteLocationAvailability(workingHoursToDelete) as ILocationScheduleResponse
            console.log(result)
            if (result.statusCode === 200) {
                toast.success("Đã xóa lịch làm việc thành công")
                fetchWorkingHours() // Refresh data
            } else {
                toast.error("Đã xảy ra lỗi khi xóa lịch làm việc")
            }
        } catch (error) {
            console.error("Error deleting working hours:", error)
            toast.error("Đã xảy ra lỗi khi xóa lịch làm việc")
        } finally {
            setIsDeletingWorkingHours(false)
            setShowDeleteModal(false)
            setWorkingHoursToDelete(null)
        }
    }

    const cancelDeleteWorkingHours = () => {
        setShowDeleteModal(false)
        setWorkingHoursToDelete(null)
    }

    const handleEditSlot = async (workingDateId: string, slotTimeId: string, selectedDate: string, currentMaxBookings: number) => {
        setEditingSlot({ workingDateId, slotTimeId, selectedDate })
        setEditingMaxBookings(currentMaxBookings)
    }

    const handleCancelEdit = () => {
        setEditingSlot(null)
        setEditingMaxBookings(1)
    }

    const handleUpdateSlot = async () => {
        if (!editingSlot) return

        setIsUpdatingSlot(true)
        try {
            console.log(editingMaxBookings === 1)
            const updateData = {
                isStrictTimeBlocking: editingMaxBookings === 1,
                maxParallelBookings: editingMaxBookings
            }

            const result = await locationAvailabilityService.updateSlotTime(updateData, editingSlot.workingDateId, editingSlot.slotTimeId)
            console.log(result)

            toast.success("Đã cập nhật slot thành công")
            setEditingSlot(null)
            fetchWorkingHours() // Refresh data
        } catch (error) {
            console.error("Error updating slot:", error)
            toast.error("Đã xảy ra lỗi khi cập nhật slot")
        } finally {
            setIsUpdatingSlot(false)
        }
    }

    const handleDateSelect = (workingHoursId: string, date: string) => {
        setSelectedDateForSlots((prev) => ({
            ...prev,
            [workingHoursId]: date,
        }))
    }

    const handleDateUnselect = (workingHoursId: string) => {
        setSelectedDateForSlots((prev) => {
            const newState = { ...prev }
            delete newState[workingHoursId]
            return newState
        })
    }

    return (
        <Card className="md:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50 rounded-t-lg">
                <div>
                    <CardTitle className="text-slate-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                        Lịch làm việc đã tạo
                    </CardTitle>
                    <CardDescription className="text-slate-500">Quản lý các lịch làm việc và khung giờ</CardDescription>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchWorkingHours}
                    disabled={isLoadingData}
                    className="cursor-pointer hover:bg-slate-100 border-slate-200"
                >
                    <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingData && "animate-spin")} />
                    Làm mới
                </Button>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
                <YearSelector
                    selectedYear={selectedYear}
                    years={years}
                    onYearChange={setSelectedYear}
                />

                {isLoadingData ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                            <span className="text-slate-500 mt-2">Đang tải dữ liệu...</span>
                        </div>
                    </div>
                ) : workingHoursList?.length > 0 ? (
                    <div className="space-y-4">
                        {Array.from({ length: 12 }, (_, i) => i + 1)
                            .filter((month) => groupedData[month] && Object.keys(groupedData[month]).length > 0)
                            .map((month) => {
                                const monthData = groupedData[month]
                                const isActive = activeMonth === `month-${month}`

                                return (
                                    <MonthList
                                        key={`month-${month}`}
                                        month={month}
                                        monthData={monthData}
                                        isActive={isActive}
                                        selectedDateForSlots={selectedDateForSlots}
                                        editingSlot={editingSlot}
                                        editingMaxBookings={editingMaxBookings}
                                        isUpdatingSlot={isUpdatingSlot}
                                        onToggle={() => setActiveMonth(activeMonth === `month-${month}` ? null : `month-${month}`)}
                                        onDelete={handleDeleteWorkingHours}
                                        onDateSelect={handleDateSelect}
                                        onDateUnselect={handleDateUnselect}
                                        onEditSlot={handleEditSlot}
                                        onUpdateSlot={handleUpdateSlot}
                                        onCancelEdit={handleCancelEdit}
                                        onMaxBookingsChange={setEditingMaxBookings}
                                        formatTime={formatTime}
                                        getMonthFromDate={getMonthFromDate}
                                        getWeekFromDate={getWeekFromDate}
                                        getWeekdayLabel={getWeekdayLabel}
                                        getMonthName={getMonthName}
                                        setShowActionBar={setShowActionBar}
                                        setSelectedWorkingDateId={setSelectedWorkingDateId}
                                    />
                                )
                            })}
                    </div>
                ) : (
                    <div className="text-center py-12 border rounded-lg bg-slate-50">
                        <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">Chưa có lịch làm việc nào được tạo</p>
                        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                            Sử dụng form bên trái để tạo lịch làm việc mới. Bạn có thể thêm ngày, giờ và các khung thời gian cho lịch
                            làm việc.
                        </p>
                    </div>
                )}
            </CardContent>

            <DeleteConfirmationDialog
                isOpen={showDeleteModal}
                isDeleting={isDeletingWorkingHours}
                onCancel={cancelDeleteWorkingHours}
                onConfirm={confirmDeleteWorkingHours}
            />
        </Card>
    )
}

export default ManageWorkingDate