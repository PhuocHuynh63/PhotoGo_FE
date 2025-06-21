"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Badge } from "@components/Atoms/ui/badge"


export default function CustomCalendar({ selectedDate, onDateSelect, availability }: ICOMPONENTS.CustomCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const monthNames = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
    ]

    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }

        // Add all days of the month
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

    const isSelected = (date: Date) => {
        return selectedDate?.toDateString() === date.toDateString()
    }

    const days = getDaysInMonth(currentMonth)
    const handleDateSelect = (date: Date,) => {
        const avail = getDateAvailability(date) as any;
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
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0 cursor-pointer">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <h3 className="text-lg font-semibold">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>

                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0 cursor-pointer">
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

                        const availability = getDateAvailability(date)
                        const isPast = date < new Date()
                        const canSelect = !isPast && availability && !availability.isFullyBooked

                        return (
                            <div
                                key={date.toISOString()}
                                className={`
                  relative h-16 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                  ${isSelected(date) ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-border"}
                  ${canSelect ? "hover:border-primary/50 hover:bg-primary/5" : ""}
                  ${isPast ? "bg-muted/30 cursor-not-allowed" : ""}
                  ${availability?.isFullyBooked ? "bg-red-50 border-red-200" : ""}
                  ${isToday(date) && !isSelected(date) ? "border-primary border-2" : ""}
                `}
                                onClick={() => canSelect && handleDateSelect(date)}
                            >
                                <div className="p-1 h-full flex flex-col justify-between">
                                    {/* Date number */}
                                    <div className={`text-sm font-medium ${isPast ? "text-muted-foreground" : ""}`}>{date.getDate()}</div>

                                    {/* Availability indicator */}
                                    {availability && !isPast && (
                                        <div className="flex flex-col items-center gap-1">
                                            {availability.isFullyBooked ? (
                                                <XCircle className="h-3 w-3 text-red-500" />
                                            ) : (
                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                            )}
                                            <div className="text-xs">
                                                {availability.isFullyBooked ? (
                                                    <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                                                        Hết
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                                                        {availability.availableSlots}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Today indicator */}
                                    {isToday(date) && (
                                        <div className="absolute -top-1 -right-1">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Còn slot</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <XCircle className="h-3 w-3 text-red-500" />
                            <span>Hết slot</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span>Hôm nay</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 border-2 border-primary rounded"></div>
                            <span>Đã chọn</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
