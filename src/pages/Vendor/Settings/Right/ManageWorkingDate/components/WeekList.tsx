import { ChevronRight } from 'lucide-react'
import { cn } from '@utils/helpers/CN'
import { ILocationSchedule } from '@models/locationAvailability/common.model'
import WorkingHoursList from './WorkingHoursList'
import { memo, useMemo } from 'react'

interface WeekListProps {
    week: number
    month: number
    weekData: ILocationSchedule[]
    isActive: boolean
    selectedDateForSlots: { [key: string]: string }
    editingSlot: { workingDateId: string, slotTimeId: string, selectedDate: string } | null
    editingMaxBookings: number
    isUpdatingSlot: boolean
    onToggle: () => void
    onDelete: (workingHoursId: string, e: React.MouseEvent) => void
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
}

const WeekHeader = memo(({ week, isActive, weekDataLength, onToggle }: {
    week: number
    isActive: boolean
    weekDataLength: number
    onToggle: () => void
}) => (
    <div
        className={cn(
            "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors",
            isActive ? "bg-green-200" : "bg-white hover:bg-slate-100",
        )}
        onClick={onToggle}
    >
        <div className="flex items-center gap-3">
            <div
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                    isActive
                        ? "bg-green-100 text-black"
                        : "bg-slate-200 text-slate-700",
                )}
            >
                {week}
            </div>
            <div className="flex flex-col">
                <span className="font-medium text-slate-800">Tuần {week}</span>
                <span className="text-xs text-slate-500">{weekDataLength} lịch làm việc</span>
            </div>
        </div>
        <div className={cn("transition-transform", isActive ? "rotate-90" : "")}>
            <ChevronRight className="h-5 w-5 text-slate-400" />
        </div>
    </div>
))

WeekHeader.displayName = 'WeekHeader'

const WeekList = memo(({
    week,
    month,
    weekData,
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
    getWeekdayLabel
}: WeekListProps) => {
    const workingHoursList = useMemo(() => (
        weekData?.map((workingHours) => (
            <WorkingHoursList
                key={workingHours.id}
                workingHours={workingHours}
                isActive={true}
                selectedDateForSlots={selectedDateForSlots}
                editingSlot={editingSlot}
                editingMaxBookings={editingMaxBookings}
                isUpdatingSlot={isUpdatingSlot}
                onToggle={() => { }}
                onDelete={(e) => onDelete(workingHours.id, e)}
                onDateSelect={onDateSelect}
                onDateUnselect={onDateUnselect}
                onEditSlot={onEditSlot}
                onUpdateSlot={onUpdateSlot}
                onCancelEdit={onCancelEdit}
                onMaxBookingsChange={onMaxBookingsChange}
                formatTime={formatTime}
                getMonthFromDate={getMonthFromDate}
                getWeekFromDate={getWeekFromDate}
                getWeekdayLabel={getWeekdayLabel}
                month={month}
                week={week}
            />
        ))
    ), [
        weekData,
        selectedDateForSlots,
        editingSlot,
        editingMaxBookings,
        isUpdatingSlot,
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
    ])

    return (
        <div className="mb-2 last:mb-0">
            <WeekHeader
                week={week}
                isActive={isActive}
                weekDataLength={weekData?.length || 0}
                onToggle={onToggle}
            />

            {isActive && workingHoursList && (
                <div className="mt-2 pl-10 space-y-2">
                    {workingHoursList}
                </div>
            )}
        </div>
    )
})

WeekList.displayName = 'WeekList'

export default WeekList 