import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Calendar } from 'lucide-react'
import { ILocationSchedule } from '@models/locationAvailability/common.model'
import WorkingHoursCard from './WorkingHoursCard'
import LocationInfo from './LocationInfo'
import WorkingDateCard from './WorkingDateCard'
import TimeSlotsList from './TimeSlotsList'

interface WorkingHoursListProps {
    workingHours: ILocationSchedule
    isActive: boolean
    selectedDateForSlots: { [key: string]: string }
    editingSlot: { workingDateId: string, slotTimeId: string, selectedDate: string } | null
    editingMaxBookings: number
    isUpdatingSlot: boolean
    onToggle: () => void
    onDelete: (e: React.MouseEvent) => void
    onDateSelect: (workingHoursId: string, date: string, workingDateId: string, isAvailable: boolean) => void
    onDateUnselect: (workingHoursId: string) => void
    onEditSlot: (workingDateId: string, slotTimeId: string, selectedDate: string, currentMaxBookings: number) => void
    onUpdateSlot: () => void
    onCancelEdit: () => void
    onMaxBookingsChange: (value: number) => void
    formatTime: (time: string) => string
    getMonthFromDate: (date: string) => number
    getWeekFromDate: (date: string) => number
    getWeekdayLabel: (date: string) => string
    month: number
    week: number
}

const WorkingHoursList = ({
    workingHours,
    isActive,
    selectedDateForSlots,
    editingSlot,
    editingMaxBookings,
    isUpdatingSlot,
    onToggle,
    onDelete,
    onDateSelect,
    onDateUnselect,
    onEditSlot,
    onUpdateSlot,
    onCancelEdit,
    onMaxBookingsChange,
    formatTime,
    getMonthFromDate,
    getWeekFromDate,
    getWeekdayLabel,
    month,
    week
}: WorkingHoursListProps) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <div className="rounded-md border border-slate-200 overflow-hidden">
            <WorkingHoursCard
                workingHours={workingHours}
                isActive={isActive}
                onToggle={onToggle}
                onDelete={onDelete}
                formatTime={formatTime}
            />

            {isActive && (
                <div className="border-t border-slate-200 p-4 bg-white">
                    <div className="space-y-4">
                        <LocationInfo
                            address={workingHours.location?.address}
                            ward={workingHours.location?.ward}
                            district={workingHours.location?.district}
                            city={workingHours.location?.city}
                        />

                        <div>
                            <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-black" />
                                Ngày làm việc trong tuần này
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {workingHours.workingDates
                                    ?.filter(
                                        (wd) =>
                                            getMonthFromDate(wd.date) === month &&
                                            getWeekFromDate(wd.date) === week,
                                    )
                                    ?.sort((a, b) => {
                                        const dateA = new Date(a.date.split("/").reverse().join("-"))
                                        const dateB = new Date(b.date.split("/").reverse().join("-"))
                                        return dateA.getTime() - dateB.getTime()
                                    })
                                    ?.map((workingDate) => {
                                        const isActive = selectedDateForSlots[workingHours.id] === workingDate.date
                                        return (
                                            <WorkingDateCard
                                                key={workingDate.id}
                                                date={workingDate.date}
                                                isAvailable={workingDate.isAvailable}
                                                isActive={isActive}
                                                weekdayLabel={getWeekdayLabel(workingDate.date)}
                                                onClick={() => {
                                                    if (isActive) {
                                                        onDateUnselect(workingHours.id)
                                                    } else {
                                                        onDateSelect(workingHours.id, workingDate.date, workingDate.id, workingDate.isAvailable)
                                                    }
                                                }}
                                            />
                                        )
                                    })}
                            </div>
                        </div>

                        <TimeSlotsList
                            workingHours={workingHours}
                            selectedDate={selectedDateForSlots[workingHours.id]}
                            editingSlot={editingSlot}
                            editingMaxBookings={editingMaxBookings}
                            isUpdatingSlot={isUpdatingSlot}
                            onDateChange={(value) => {
                                const selectedWorkingDate = workingHours.workingDates?.find(
                                    (wd) => wd.date === value
                                )
                                if (selectedWorkingDate) {
                                    onDateSelect(workingHours.id, value, selectedWorkingDate.id, selectedWorkingDate.isAvailable)
                                }
                            }}
                            onEditSlot={onEditSlot}
                            onUpdateSlot={onUpdateSlot}
                            onCancelEdit={onCancelEdit}
                            onMaxBookingsChange={onMaxBookingsChange}
                            formatTime={formatTime}
                            getMonthFromDate={getMonthFromDate}
                            getWeekFromDate={getWeekFromDate}
                            month={month}
                            week={week}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default dynamic(() => Promise.resolve(WorkingHoursList), { ssr: false }) 