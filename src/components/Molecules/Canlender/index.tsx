"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Badge } from "@components/Atoms/ui/badge"

interface DateRange {
    from: Date;
    to: Date;
}

interface CustomCalendarProps {
    selected?: Date | DateRange;
    onDateSelect: (data: { date: Date; id: string }) => void;
    availability: {
        id: string;
        date: Date;
        isFullyBooked: boolean;
        availableSlots?: number;
    }[];
    mode?: 'single' | 'range';
}

export default function CustomCalendar({
    selected,
    onDateSelect,
    availability,
    mode = 'single'
}: CustomCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    const isDateInRange = (date: Date, range: DateRange) => {
        if (!range.from || !range.to) return false;
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const from = new Date(range.from);
        from.setHours(0, 0, 0, 0);
        const to = new Date(range.to);
        to.setHours(0, 0, 0, 0);
        return d >= from && d <= to;
    };

    const isRangeStart = (date: Date, range: DateRange) => {
        if (!range.from) return false;
        return date.toDateString() === range.from.toDateString();
    };

    const isRangeEnd = (date: Date, range: DateRange) => {
        if (!range.to) return false;
        return date.toDateString() === range.to.toDateString();
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()
        const days = []

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day))
        }
        return days
    }

    const getDateAvailability = (date: Date) => {
        return availability.find((avail) => avail.date.toDateString() === date.toDateString())
    }

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev)
            if (direction === "prev") {
                newMonth.setMonth(prev.getMonth() - 1)
            } else {
                newMonth.setMonth(prev.getMonth() + 1)
            }
            return newMonth
        })
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const days = getDaysInMonth(currentMonth)
    const handleDateSelect = (date: Date) => {
        const avail = getDateAvailability(date);
        onDateSelect({
            date,
            id: avail?.id || "",
        });
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-semibold">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Day names */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => {
                        if (!date) {
                            return <div key={index} className="h-16" />
                        }

                        const dayAvailability = getDateAvailability(date);
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                        // --- LOGIC MỚI BẮT ĐẦU TỪ ĐÂY ---

                        // Một ngày được coi là "ngày có slot" nếu nó có trong danh sách availability và chưa bị book hết.
                        const isDayWithSlots = dayAvailability && !dayAvailability.isFullyBooked;

                        // Ngày này sẽ bị làm mờ (không thể chọn) nếu ta đang ở mode 'range' VÀ nó là "ngày có slot".
                        const shouldBeDimmedForRange = mode === 'range' && isDayWithSlots;

                        // Điều kiện cuối cùng để một ngày có thể được chọn.
                        const canSelect = !isPast && isDayWithSlots && !shouldBeDimmedForRange;

                        // Logic kiểm tra lựa chọn (cho cả single và range)
                        let isSelected = false;
                        let isStart = false;
                        let isEnd = false;
                        let isInRange = false;

                        if (mode === 'range' && selected && 'from' in selected && selected.from && selected.to) {
                            const range = selected as DateRange;
                            isInRange = isDateInRange(date, range);
                            isStart = isRangeStart(date, range);
                            isEnd = isRangeEnd(date, range);
                            isSelected = isInRange;
                        } else if (mode === 'single' && selected && !('from' in selected)) {
                            isSelected = selected.toDateString() === date.toDateString();
                        }

                        // Các lớp CSS để render ô ngày
                        const cellClasses = `
                            relative h-16 border rounded-lg transition-all duration-200
                            ${!canSelect && !isInRange ? "cursor-not-allowed" : "cursor-pointer"}
                            ${isPast ? "bg-muted/30" : ""}
                            ${isToday(date) && !isSelected ? "border-primary border-2" : ""}
                            ${shouldBeDimmedForRange ? "opacity-40" : ""}
                            ${mode === 'single' && isSelected ? "bg-primary text-primary-foreground" : ""}
                            ${mode === 'range' && isInRange
                                ? isStart && isEnd
                                    ? "bg-primary text-primary-foreground rounded-lg"
                                    : isStart
                                        ? "bg-primary text-primary-foreground rounded-l-lg rounded-r-none"
                                        : isEnd
                                            ? "bg-primary text-primary-foreground rounded-r-lg rounded-l-none"
                                            : "bg-primary/20 rounded-none text-primary"
                                : ""
                            }
                        `;

                        return (
                            <div
                                key={date.toISOString()}
                                className={cellClasses}
                                onClick={() => canSelect && handleDateSelect(date)}
                            >
                                <div className="p-1 h-full flex flex-col justify-between">
                                    <div className={`text-sm font-medium ${isPast || shouldBeDimmedForRange ? "text-muted-foreground" : ""}`}>{date.getDate()}</div>
                                    {dayAvailability && !isPast && (
                                        <div className="flex flex-col items-center gap-1">
                                            {dayAvailability.isFullyBooked ? (
                                                <XCircle className="h-3 w-3 text-red-500" />
                                            ) : (
                                                <CheckCircle className={`h-3 w-3 ${isInRange ? 'text-white' : 'text-green-500'}`} />
                                            )}
                                            <div className="text-xs">
                                                {dayAvailability.isFullyBooked ? (
                                                    <Badge variant="destructive" className="text-xs px-1 py-0 h-4">Hết</Badge>
                                                ) : (
                                                    <Badge variant={isInRange ? 'default' : 'secondary'} className="text-xs px-1 py-0 h-4">
                                                        {dayAvailability.availableSlots}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Chú thích */}
                <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /><span>Còn slot (chọn theo giờ)</span></div>
                        <div className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-500" /><span>Hết slot</span></div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 border-2 border-gray-300 rounded-lg"></div><span>Ngày trống (chọn nhiều ngày)</span></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}