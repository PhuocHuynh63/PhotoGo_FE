import { Calendar, Clock } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@components/Atoms/ui/alert'
import { Label } from '@components/Atoms/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@components/Atoms/ui/select'
import { ISlotTime, ILocationSchedule } from '@models/locationAvailability/common.model'
import TimeSlotCard from './TimeSlotCard'

interface TimeSlotsListProps {
    workingHours: ILocationSchedule
    selectedDate: string | undefined
    editingSlot: { workingDateId: string, slotTimeId: string, selectedDate: string } | null
    editingMaxBookings: number
    isUpdatingSlot: boolean
    onDateChange: (value: string) => void
    onEditSlot: (workingDateId: string, slotTimeId: string, selectedDate: string, currentMaxBookings: number) => void
    onUpdateSlot: () => void
    onCancelEdit: () => void
    onMaxBookingsChange: (value: number) => void
    formatTime: (time: string) => string
    getMonthFromDate: (date: string) => number
    getWeekFromDate: (date: string) => number
    month: number
    week: number
}

const TimeSlotsList = ({
    workingHours,
    selectedDate,
    editingSlot,
    editingMaxBookings,
    isUpdatingSlot,
    onDateChange,
    onEditSlot,
    onUpdateSlot,
    onCancelEdit,
    onMaxBookingsChange,
    formatTime,
    getMonthFromDate,
    getWeekFromDate,
    month,
    week
}: TimeSlotsListProps) => {
    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-slate-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Khung giờ làm việc
                </h4>
                <div className="flex items-center gap-2">
                    <Label className="text-sm text-slate-600">Chọn ngày:</Label>
                    <Select
                        value={selectedDate || ""}
                        onValueChange={onDateChange}
                    >
                        <SelectTrigger className="w-32 border-slate-200">
                            <SelectValue placeholder="Chọn ngày" />
                        </SelectTrigger>
                        <SelectContent>
                            {workingHours?.workingDates
                                ?.filter(
                                    (wd) =>
                                        getMonthFromDate(wd.date) === month &&
                                        getWeekFromDate(wd.date) === week,
                                )
                                ?.sort((a, b) => {
                                    const dateA = new Date(
                                        a.date.split("/").reverse().join("-"),
                                    )
                                    const dateB = new Date(
                                        b.date.split("/").reverse().join("-"),
                                    )
                                    return dateA.getTime() - dateB.getTime()
                                })
                                ?.map((workingDate) => (
                                    <SelectItem key={workingDate.id} value={workingDate.date}>
                                        {workingDate.date}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {workingHours?.slotTimes?.length > 0 && selectedDate ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {workingHours?.slotTimes
                        ?.sort((a, b) => a.slot - b.slot)
                        ?.map((slot: ISlotTime) => {
                            const selectedWorkingDate = workingHours?.workingDates?.find(
                                (wd: ILocationSchedule["workingDates"][number]) =>
                                    wd.date === selectedDate,
                            )
                            const workingDateId = selectedWorkingDate?.id || workingHours.id

                            const isEditing =
                                editingSlot?.workingDateId === workingDateId &&
                                editingSlot?.slotTimeId === slot.id

                            return (
                                <TimeSlotCard
                                    key={slot?.slot}
                                    slot={slot}
                                    isEditing={isEditing}
                                    editingMaxBookings={editingMaxBookings}
                                    isUpdatingSlot={isUpdatingSlot}
                                    onEdit={() => onEditSlot(workingDateId, slot.id, selectedDate, slot.maxParallelBookings)}
                                    onUpdate={onUpdateSlot}
                                    onCancel={onCancelEdit}
                                    onMaxBookingsChange={onMaxBookingsChange}
                                    formatTime={formatTime}
                                />
                            )
                        })}
                </div>
            ) : workingHours?.slotTimes?.length > 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-200">
                    <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">
                        Vui lòng chọn ngày để xem và chỉnh sửa khung giờ
                    </p>
                </div>
            ) : (
                <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertTitle className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Chưa có khung giờ
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">
                        Lịch làm việc này chưa có khung giờ. Bấm nút bên dưới để tạo các
                        khung giờ tự động.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}

export default TimeSlotsList 