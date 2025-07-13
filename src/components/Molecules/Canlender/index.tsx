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
        const d = new Date(date); d.setHours(0, 0, 0, 0);
        const from = new Date(range.from); from.setHours(0, 0, 0, 0);
        const to = new Date(range.to); to.setHours(0, 0, 0, 0);
        return d >= from && d <= to;
    };

    const isRangeStart = (date: Date, range: DateRange) => date.toDateString() === range.from?.toDateString();
    const isRangeEnd = (date: Date, range: DateRange) => date.toDateString() === range.to?.toDateString();

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear(), month = date.getMonth();
        const firstDay = new Date(year, month, 1), lastDay = new Date(year, month + 1, 0);
        const days = [];
        for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
        for (let day = 1; day <= lastDay.getDate(); day++) days.push(new Date(year, month, day));
        return days;
    }

    const getDateAvailability = (date: Date) => availability.find((avail) => avail.date.toDateString() === date.toDateString());
    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1));
            return newMonth;
        });
    }
    const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

    const days = getDaysInMonth(currentMonth);
    const handleDateSelect = (date: Date) => {
        const avail = getDateAvailability(date);
        onDateSelect({ date, id: avail?.id || "" });
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")} className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-semibold">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth("next")} className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Day names */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day) => <div key={day} className="text-center text-sm font-medium text-muted-foreground">{day}</div>)}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => {
                        if (!date) return <div key={index} />;

                        const dayAvailability = getDateAvailability(date);
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                        // Logic chọn ngày được đơn giản hóa:
                        // Một ngày có thể chọn nếu nó không phải quá khứ VÀ có trong danh sách availability
                        const canSelect = !isPast && !!dayAvailability;

                        let isSelected = false, isStart = false, isEnd = false, isInRange = false;
                        if (mode === 'range' && selected && 'from' in selected) {
                            const range = selected as DateRange;
                            isInRange = isDateInRange(date, range);
                            isStart = isRangeStart(date, range);
                            isEnd = isRangeEnd(date, range);
                        } else if (mode === 'single' && selected && !('from' in selected)) {
                            isSelected = selected.toDateString() === date.toDateString();
                        }

                        const cellClasses = `
                            relative p-2 h-16 border rounded-md transition-all duration-200 flex flex-col justify-center items-center
                            ${isPast || !dayAvailability ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : "cursor-pointer"}
                            ${isToday(date) && !isSelected && !isInRange ? "border-primary" : ""}
                            ${canSelect && !isSelected && !isInRange ? "hover:bg-accent" : ""}
                            ${mode === 'single' && isSelected ? "bg-primary text-primary-foreground" : ""}
                            ${mode === 'range' && isInRange
                                ? `text-primary-foreground ${isStart && isEnd ? "bg-primary rounded-md" : isStart ? "bg-primary rounded-l-md rounded-r-none" : isEnd ? "bg-primary rounded-r-md rounded-l-none" : "bg-primary/80 rounded-none"}`
                                : ""
                            }
                        `;

                        return (
                            <div key={date.toISOString()} className={cellClasses} onClick={() => canSelect && handleDateSelect(date)}>
                                <span className="font-medium">{date.getDate()}</span>
                                {canSelect && (
                                    <div className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full"></div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="mt-4 pt-2 border-t text-xs text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Ngày có thể chọn</span>
                </div>
            </CardContent>
        </Card>
    );
}