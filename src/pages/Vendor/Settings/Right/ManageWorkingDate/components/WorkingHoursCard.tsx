import { Clock, MapPin, Trash2 } from 'lucide-react'
import { Badge } from '@components/Atoms/ui/badge'
import { Button } from '@components/Atoms/ui/button'
import { cn } from '@utils/helpers/CN'
import { ILocationSchedule } from '@models/locationAvailability/common.model'

interface WorkingHoursCardProps {
    workingHours: ILocationSchedule
    isActive: boolean
    onToggle: () => void
    onDelete: (e: React.MouseEvent) => void
    formatTime: (time: string) => string
}

const WorkingHoursCard = ({
    workingHours,
    isActive,
    onToggle,
    onDelete,
    formatTime
}: WorkingHoursCardProps) => {
    if (!workingHours || typeof formatTime !== 'function') {
        return null;
    }

    const formattedStartTime = workingHours.startTime ? formatTime(workingHours.startTime) : '';
    const formattedEndTime = workingHours.endTime ? formatTime(workingHours.endTime) : '';

    return (
        <div className="rounded-md border border-slate-200 overflow-hidden">
            <div className="relative">
                <div
                    className={cn(
                        "flex items-center justify-between p-3 cursor-pointer transition-colors",
                        isActive ? "bg-blue-50" : "bg-white hover:bg-slate-50",
                    )}
                    onClick={onToggle}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                isActive
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-700",
                            )}
                        >
                            <Clock className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-800">
                                    {formattedStartTime} - {formattedEndTime}
                                </span>
                                <Badge
                                    variant={workingHours.isAvailable ? "default" : "outline"}
                                    className={
                                        workingHours.isAvailable
                                            ? "bg-emerald-500 hover:bg-emerald-600"
                                            : ""
                                    }
                                >
                                    {workingHours.isAvailable ? "Hoạt động" : "Không hoạt động"}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[200px]">
                                    {workingHours.location?.address}, {workingHours.location?.ward}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default WorkingHoursCard 