import { Badge as BadgeIcon } from 'lucide-react'
import { cn } from '@utils/helpers/CN'

interface WorkingDateCardProps {
    date: string
    isAvailable: boolean
    isActive: boolean
    weekdayLabel: string
    onClick: () => void
}

const WorkingDateCard = ({ date, isAvailable, isActive, weekdayLabel, onClick }: WorkingDateCardProps) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-3 rounded-lg cursor-pointer border transition-all",
                isActive
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-slate-800 border-slate-200 hover:border-primary hover:bg-primary/10",
            )}
            onClick={onClick}
        >
            <div className="flex items-center gap-2 mb-1">
                <span
                    className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        isActive
                            ? "bg-gray-200 text-black"
                            : "bg-slate-100 text-slate-600",
                    )}
                >
                    {weekdayLabel}
                </span>
                <BadgeIcon
                    fill={isAvailable ? '#00c951' : '#fb2c36'}
                    className={cn(
                        "text-xs",
                        isAvailable
                            ? "text-green-500 border-green-200"
                            : "text-red-500 border-red-200"
                    )}
                />
            </div>
            <span className="text-sm font-bold">
                {date}
            </span>
        </div>
    )
}

export default WorkingDateCard 