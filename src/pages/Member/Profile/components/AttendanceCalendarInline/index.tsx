"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Button } from "@/components/Atoms/ui/button"
import { motion } from "framer-motion"
import LucideIcon from "@components/Atoms/LucideIcon"
import { IAttendance } from "@models/attendance/common.model"
import { PAGES } from "../../../../../types/IPages"

// Utility to calculate streaks for a given month
function calculateStreaks(records: IAttendance[], year: number, month: number) {
    // Filter and sort records for the month
    const monthRecords = records
        .filter((r) => {
            const d = new Date(r.date)
            return d.getFullYear() === year && d.getMonth() === month
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    let currentStreak = 0
    let maxStreak = 0
    let prevDate: Date | null = null

    for (const record of monthRecords) {
        if (!record.isChecked) {
            currentStreak = 0
            prevDate = null
            continue
        }
        const recordDate = new Date(record.date)
        if (
            prevDate &&
            recordDate.getTime() - prevDate.getTime() === 24 * 60 * 60 * 1000
        ) {
            currentStreak += 1
        } else {
            currentStreak = 1
        }
        maxStreak = Math.max(maxStreak, currentStreak)
        prevDate = recordDate
    }
    // For current streak, check if the last checked day is the last day in the month or today
    const lastChecked = monthRecords.filter(r => r.isChecked).pop()
    let currentStreakFinal = 0
    if (lastChecked) {
        const idx = monthRecords.findIndex(r => r.date === lastChecked.date)
        let streak = 0
        for (let i = idx; i >= 0; i--) {
            if (monthRecords[i].isChecked) streak++
            else break
        }
        currentStreakFinal = streak
    }
    return {
        totalDays: monthRecords.filter(r => r.isChecked).length,
        longestStreak: maxStreak,
        currentStreak: currentStreakFinal,
    }
}

const AttendanceCalendarInline = ({ attendance }: PAGES.IAttendanceCalendarInlineProps) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const todayStr = useMemo(() => new Date().toISOString().split("T")[0], [])
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Memoized month stats
    const monthStats = useMemo(() => {
        if (!attendance) return { totalDays: 0, longestStreak: 0, currentStreak: 0 }
        return calculateStreaks(attendance, year, month)
    }, [attendance, year, month])

    // Memoized days in month
    const days = useMemo(() => {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()
        const daysArr = []
        for (let i = 0; i < startingDayOfWeek; i++) daysArr.push(null)
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const attendanceRecord = attendance?.find((record: IAttendance) => record.date === dateStr)
            daysArr.push({
                day,
                date: dateStr,
                isChecked: attendanceRecord?.isChecked || false,
                isToday: dateStr === todayStr,
            })
        }
        return daysArr
    }, [attendance, year, month, todayStr])

    const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

    // Month navigation
    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1))
            return newDate
        })
    }

    // Format month/year
    const formatMonthYear = (date: Date) =>
        date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-md mx-auto mb-6"
        >
            <Card className="bg-white shadow-2xl border-0 overflow-hidden">
                {/* Header */}
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">Lịch điểm danh</CardTitle>
                    </div>
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateMonth("prev")}
                            className="text-white hover:bg-white/20 h-8 w-8 p-0  cursor-pointer"
                        >
                            <LucideIcon name="ChevronLeft" className="w-4 h-4" />
                        </Button>
                        <h2 className="text-xl font-bold capitalize">{formatMonthYear(currentDate)}</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateMonth("next")}
                            className="text-white hover:bg-white/20 h-8 w-8 p-0  cursor-pointer"
                            disabled={
                                currentDate.getMonth() >= new Date().getMonth() &&
                                currentDate.getFullYear() >= new Date().getFullYear()
                            }
                        >
                            <LucideIcon name="ChevronRight" className="w-4 h-4" />
                        </Button>
                    </div>
                    {/* Month Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                        <div className="bg-white/20 rounded-lg p-2">
                            <div className="text-lg font-bold">{monthStats.totalDays}</div>
                            <div className="text-xs opacity-90">Ngày điểm danh</div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-2">
                            <div className="text-lg font-bold">{monthStats.currentStreak}</div>
                            <div className="text-xs opacity-90">Chuỗi hiện tại</div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-2">
                            <div className="text-lg font-bold">{monthStats.longestStreak}</div>
                            <div className="text-xs opacity-90">Chuỗi dài nhất</div>
                        </div>
                    </div>
                </CardHeader>
                {/* Calendar */}
                <CardContent className="p-4">
                    {/* Day Labels */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayLabels.map((label) => (
                            <div key={label} className="text-center text-xs font-medium text-gray-500 py-2">
                                {label}
                            </div>
                        ))}
                    </div>
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                            if (!day) return <div key={index} className="aspect-square" />
                            return (
                                <motion.div
                                    key={day.date}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: index * 0.01 }}
                                    className="aspect-square relative"
                                >
                                    <div
                                        className={`w-full h-full flex items-center justify-center text-sm font-medium rounded-full transition-all duration-200 ${day.isToday
                                            ? day.isChecked
                                                ? "bg-orange-500 text-white shadow-lg"
                                                : "bg-orange-100 text-orange-600 border-2 border-orange-300"
                                            : day.isChecked
                                                ? "bg-orange-200 text-orange-700 hover:bg-orange-300"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {day.day}
                                        {/* Check indicator */}
                                        {day.isChecked && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-0.5 -right-0.5"
                                            >
                                                <LucideIcon name="CheckCircle" className="w-3 h-3 text-orange-600 bg-white rounded-full" />
                                            </motion.div>
                                        )}
                                        {/* Today indicator */}
                                        {day.isToday && (
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.7, 1, 0.7],
                                                }}
                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 bg-orange-200 rounded"></div>
                            <span>Đã điểm danh</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 bg-orange-500 rounded"></div>
                            <span>Hôm nay</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 bg-gray-100 rounded border"></div>
                            <span>Chưa điểm danh</span>
                        </div>
                    </div>
                    {/* Achievement Section */}
                    {monthStats.longestStreak >= 7 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200"
                        >
                            <div className="flex items-center gap-2 text-orange-600">
                                <LucideIcon name="Trophy" className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    Thành tích xuất sắc! Chuỗi {monthStats.longestStreak} ngày trong tháng này
                                </span>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default AttendanceCalendarInline
