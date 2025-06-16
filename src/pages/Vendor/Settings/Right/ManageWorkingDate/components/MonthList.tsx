import { ChevronDown } from 'lucide-react'
import { cn } from '@utils/helpers/CN'
import { ILocationSchedule } from '@models/locationAvailability/common.model'
import WeekList from './WeekList'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface MonthListProps {
    month: number
    monthData: { [week: number]: ILocationSchedule[] }
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
    getMonthName: (month: number) => string
    setShowActionBar: (show: boolean) => void
    setSelectedWorkingDateId: (id: string) => void
    onResetSelectedDate: () => void
}

const MonthList = ({
    month,
    monthData,
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
    getMonthName,
    setShowActionBar,
    setSelectedWorkingDateId,
    onResetSelectedDate
}: MonthListProps) => {
    const [activeWeek, setActiveWeek] = useState<string | null>(null)
    const [prevSelectedDate, setPrevSelectedDate] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Reset ActionBar animation when selected date changes
    useEffect(() => {
        const currentSelectedDate = Object.values(selectedDateForSlots)[0]
        if (currentSelectedDate) {
            if (currentSelectedDate === prevSelectedDate) {
                // Nếu click vào ngày đã chọn, unselect và ẩn ActionBar
                const workingHoursId = Object.keys(selectedDateForSlots)[0]
                onDateUnselect(workingHoursId)
                setShowActionBar(false)
                setSelectedWorkingDateId("")
                setPrevSelectedDate(null)
            } else {
                // Nếu chọn ngày mới, unselect ngày cũ và cập nhật ngày mới
                if (prevSelectedDate) {
                    const prevWorkingHoursId = Object.entries(selectedDateForSlots).find(([, date]) => date === prevSelectedDate)?.[0]
                    if (prevWorkingHoursId) {
                        onDateUnselect(prevWorkingHoursId)
                    }
                }
                setPrevSelectedDate(currentSelectedDate)
            }
        } else {
            // Nếu không còn ngày nào được chọn (đóng accordion), reset prevSelectedDate về null
            setPrevSelectedDate(null)
        }
    }, [selectedDateForSlots])

    if (!isMounted) {
        return null
    }

    const handleMonthToggle = () => {
        if (isActive) {
            // Khi đóng tháng, unselect tất cả các ngày trong tháng
            Object.keys(monthData).forEach(week => {
                monthData[Number.parseInt(week)].forEach(workingHours => {
                    onDateUnselect(workingHours.id)
                })
            })
            setPrevSelectedDate(null)
            // Ẩn ActionBar khi đóng tháng
            setShowActionBar(false)
            setSelectedWorkingDateId("")
            onResetSelectedDate()
        }
        onToggle()
    }

    const handleWeekToggle = (weekKey: string) => {
        if (activeWeek === weekKey) {
            // Khi đóng tuần, unselect tất cả các ngày trong tuần đó
            const week = weekKey.split('-')[2]
            monthData[Number.parseInt(week)].forEach(workingHours => {
                onDateUnselect(workingHours.id)
            })
            setPrevSelectedDate(null)
            // Ẩn ActionBar khi đóng tuần
            setShowActionBar(false)
            setSelectedWorkingDateId("")
        }
        setActiveWeek(activeWeek === weekKey ? null : weekKey)
    }

    return (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
            <div
                className={cn(
                    "flex items-center justify-between p-4 cursor-pointer transition-colors",
                    isActive ? "bg-orange-200" : "bg-white hover:bg-slate-50",
                )}
                onClick={handleMonthToggle}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            isActive ? "bg-orange-100 text-black" : "bg-slate-100 text-slate-700",
                        )}
                    >
                        {month}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{getMonthName(month)}</span>
                        <span className="text-sm text-slate-500">
                            {Object.keys(monthData).length} tuần có lịch làm việc
                        </span>
                    </div>
                </div>
                <div className={cn("transition-transform", isActive ? "rotate-180" : "")}>
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                </div>
            </div>

            {isActive && (
                <div className="border-t border-slate-200 px-4 py-2 bg-slate-50">
                    {Object.keys(monthData).length > 0 && Object.keys(monthData)
                        .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
                        .map((week) => {
                            const weekData = monthData[Number.parseInt(week)]
                            const weekKey = `week-${month}-${week}`
                            const isWeekActive = activeWeek === weekKey

                            return (
                                <WeekList
                                    key={weekKey}
                                    week={Number.parseInt(week)}
                                    month={month}
                                    weekData={weekData}
                                    isActive={isWeekActive}
                                    onToggle={() => handleWeekToggle(weekKey)}
                                    onDelete={onDelete}
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
                                    selectedDateForSlots={selectedDateForSlots}
                                    editingSlot={editingSlot}
                                    editingMaxBookings={editingMaxBookings}
                                    isUpdatingSlot={isUpdatingSlot}
                                />
                            )
                        })}
                </div>
            )}
        </div>
    )
}

export default dynamic(() => Promise.resolve(MonthList), { ssr: false }) 