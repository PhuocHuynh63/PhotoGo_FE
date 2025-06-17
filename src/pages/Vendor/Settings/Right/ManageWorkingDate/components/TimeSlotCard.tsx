import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Clock, Edit, Check, X, Loader2 } from 'lucide-react'
import { Badge } from '@components/Atoms/ui/badge'
import { Button } from '@components/Atoms/ui/button'
import { Input } from '@components/Atoms/ui/input'
import { cn } from '@utils/helpers/CN'
import { ISlotTime } from '@models/locationAvailability/common.model'

interface TimeSlotCardProps {
    slot: ISlotTime
    isEditing: boolean
    editingMaxBookings: number
    isUpdatingSlot: boolean
    onEdit: () => void
    onUpdate: () => void
    onCancel: () => void
    onMaxBookingsChange: (value: number) => void
    formatTime: (time: string) => string
}

const TimeSlotCard = ({
    slot,
    isEditing,
    editingMaxBookings,
    isUpdatingSlot,
    onEdit,
    onUpdate,
    onCancel,
    onMaxBookingsChange,
    formatTime
}: TimeSlotCardProps) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <div
            className={cn(
                "border rounded-lg p-3 flex flex-col space-y-2 transition-all",
                isEditing
                    ? "border-blue-300 bg-blue-50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white",
            )}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                        {slot.slot}
                    </div>
                    <span className="font-medium text-slate-800">
                        Slot {slot.slot}
                    </span>
                </div>
                {!isEditing ? (
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                            {slot.maxParallelBookings} lịch
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onEdit}
                            className="cursor-pointer h-6 w-6 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                            <Edit className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            min="1"
                            max="10"
                            value={editingMaxBookings}
                            onChange={(e) => onMaxBookingsChange(Number.parseInt(e.target.value) || 1)}
                            className="w-16 h-7 text-xs"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onUpdate}
                            disabled={isUpdatingSlot}
                            className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                        >
                            {isUpdatingSlot ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Check className="h-3 w-3" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>
                    {formatTime(slot.startSlotTime)} - {formatTime(slot.endSlotTime)}
                </span>
            </div>
        </div>
    )
}

export default dynamic(() => Promise.resolve(TimeSlotCard), { ssr: false }) 