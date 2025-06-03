"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Button } from "@/components/Atoms/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import LucideIcon from "@components/Atoms/LucideIcon"

interface AttendanceRecord {
    date: string
    checked: boolean
}

interface AttendanceCalendarModalProps {
    isOpen: boolean
    onClose: () => void
    userId?: string
}

const AttendanceCalendarModal = ({ isOpen, onClose, userId }: AttendanceCalendarModalProps) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
    const [monthStats, setMonthStats] = useState({
        totalDays: 0,
        longestStreak: 0,
        currentStreak: 0,
    })

    // Load attendance data
    useEffect(() => {
        if (!userId) return

        const storageKey = `attendance_${userId}`
        const savedData = localStorage.getItem(storageKey)

        if (savedData) {
            const parsed = JSON.parse(savedData)
            setAttendanceData(parsed)
            calculateMonthStats(parsed, currentDate)
        }
    }, [userId, currentDate])

    // Calculate stats for current month
    const calculateMonthStats = (data: AttendanceRecord[], date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()

        const monthData = data.filter((record) => {
            const recordDate = new Date(record.date)
            return recordDate.getFullYear() === year && recordDate.getMonth() === month && record.checked
        })

        const totalDays = monthData.length

        // Calculate longest streak in this month
        const sortedData = data
            .filter((record) => {
                const recordDate = new Date(record.date)
                return recordDate.getFullYear() === year && recordDate.getMonth() === month
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        let longestStreak = 0
        let currentStreak = 0

        for (const record of sortedData) {
            if (record.checked) {
                currentStreak++
                longestStreak = Math.max(longestStreak, currentStreak)
            } else {
                currentStreak = 0
            }
        }

        // Calculate current streak (from today backwards)
        const today = new Date()
        const todayStr = today.toISOString().split("T")[0]
        let streakCount = 0

        const reversedData = [...data].reverse()
        for (const record of reversedData) {
            if (record.date <= todayStr && record.checked) {
                streakCount++
            } else if (record.date <= todayStr) {
                break
            }
        }

        setMonthStats({
            totalDays,
            longestStreak,
            currentStreak: streakCount,
        })
    }

    // Get days in month
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

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const attendanceRecord = attendanceData.find((record) => record.date === dateStr)
            const isToday = dateStr === new Date().toISOString().split("T")[0]

            days.push({
                day,
                date: dateStr,
                isChecked: attendanceRecord?.checked || false,
                isToday,
            })
        }

        return days
    }

    // Navigate months
    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            if (direction === "prev") {
                newDate.setMonth(prev.getMonth() - 1)
            } else {
                newDate.setMonth(prev.getMonth() + 1)
            }
            return newDate
        })
    }

    // Format month/year
    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString("vi-VN", {
            month: "long",
            year: "numeric",
        })
    }

    const days = getDaysInMonth(currentDate)
    const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose()
                    }
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-full max-w-md mx-auto"
                >
                    <Card className="bg-white shadow-2xl border-0 overflow-hidden">
                        {/* Header */}
                        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold">Lịch điểm danh</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="text-white hover:bg-white/20 h-8 w-8 p-0 cursor-pointer"
                                >
                                    <LucideIcon name="X" className="w-4 h-4" />
                                </Button>
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
                                    if (!day) {
                                        return <div key={index} className="aspect-square" />
                                    }

                                    return (
                                        <motion.div
                                            key={day.date}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.2, delay: index * 0.01 }}
                                            className="aspect-square relative"
                                        >
                                            <div
                                                className={`w-full h-full flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 ${day.isToday
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
                                                        className="absolute -top-1 -right-1"
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
            </motion.div>
        </AnimatePresence>
    )
}

export default AttendanceCalendarModal
