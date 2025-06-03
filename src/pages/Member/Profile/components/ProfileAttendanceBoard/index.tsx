"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/Atoms/ui/card"
import { Button } from "@/components/Atoms/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import AttendanceCalendarModal from "../../../../Vendor/Components/AttendanceCalendarModal"
import LucideIcon from "@components/Atoms/LucideIcon"


interface AttendanceRecord {
    date: string
    checked: boolean
}

interface ProfileAttendanceBoardProps {
    isLoggedIn: boolean
    userId?: string
    onCheckIn?: () => void
}

const ProfileAttendanceBoard = ({ isLoggedIn, userId, onCheckIn }: ProfileAttendanceBoardProps) => {
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
    const [hasCheckedToday, setHasCheckedToday] = useState(false)
    const [consecutiveDays, setConsecutiveDays] = useState(0)
    const [isCheckingIn, setIsCheckingIn] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const [showCalendarModal, setShowCalendarModal] = useState(false)
    // Lấy ngày hôm nay theo định dạng YYYY-MM-DD
    const getTodayString = () => {
        return new Date().toISOString().split("T")[0]
    }

    // Lấy 7 ngày gần nhất
    const getLast7Days = () => {
        const days = []
        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            days.push(date.toISOString().split("T")[0])
        }
        return days
    }

    // Load dữ liệu điểm danh từ localStorage
    useEffect(() => {
        if (!isLoggedIn || !userId) return

        const storageKey = `attendance_${userId}`
        const savedData = localStorage.getItem(storageKey)
        const last7Days = getLast7Days()

        let attendance: AttendanceRecord[] = []

        if (savedData) {
            const parsed = JSON.parse(savedData)
            attendance = last7Days.map((date) => {
                const existing = parsed.find((record: AttendanceRecord) => record.date === date)
                return existing || { date, checked: false }
            })
        } else {
            attendance = last7Days.map((date) => ({ date, checked: false }))
        }

        setAttendanceData(attendance)

        // Kiểm tra đã điểm danh hôm nay chưa
        const today = getTodayString()
        const todayRecord = attendance.find((record) => record.date === today)
        setHasCheckedToday(todayRecord?.checked || false)

        // Tính số ngày liên tục
        calculateConsecutiveDays(attendance)
    }, [isLoggedIn, userId])

    // Tính số ngày điểm danh liên tục
    const calculateConsecutiveDays = (attendance: AttendanceRecord[]) => {
        let consecutive = 0
        const sortedAttendance = [...attendance].reverse() // Từ hôm nay về trước

        for (const record of sortedAttendance) {
            if (record.checked) {
                consecutive++
            } else {
                break
            }
        }

        setConsecutiveDays(consecutive)
    }

    // Xử lý điểm danh
    const handleCheckIn = async () => {
        if (!isLoggedIn || !userId || hasCheckedToday || isCheckingIn) return

        setIsCheckingIn(true)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const today = getTodayString()
        const updatedAttendance = attendanceData.map((record) =>
            record.date === today ? { ...record, checked: true } : record,
        )

        setAttendanceData(updatedAttendance)
        setHasCheckedToday(true)

        // Lưu vào localStorage
        const storageKey = `attendance_${userId}`
        const allData = JSON.parse(localStorage.getItem(storageKey) || "[]")
        const existingIndex = allData.findIndex((record: AttendanceRecord) => record.date === today)

        if (existingIndex >= 0) {
            allData[existingIndex] = { date: today, checked: true }
        } else {
            allData.push({ date: today, checked: true })
        }

        localStorage.setItem(storageKey, JSON.stringify(allData))

        // Tính lại số ngày liên tục
        const newConsecutive = consecutiveDays + 1
        setConsecutiveDays(newConsecutive)

        setIsCheckingIn(false)

        // Show confetti effect
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2000)

        // Callback if provided
        if (onCheckIn) onCheckIn()

        // Kiểm tra nếu đạt 7 ngày liên tục
        if (newConsecutive === 7) {
            console.log("🎉📸 CHÚC MỪNG NHIẾP ẢNH GIA XUẤT SẮC! 📸🎉")
            console.log("✨ Bạn đã hoàn thành thử thách 7 ngày liên tục!")
            console.log("🏆 Phần thưởng đặc biệt: Unlock Premium Features!")
            console.log("📷 Hãy tiếp tục hành trình sáng tạo của mình!")
            console.log("🎯 Thành tích mới: Photography Master!")
        }
    }

    // Định dạng ngày hiển thị
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
        const months = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"]
        return {
            day: days[date.getDay()],
            date: date.getDate(),
            month: months[date.getMonth()],
        }
    }

    // Get streak info with enhanced levels
    const getStreakInfo = (days: number): {
        color: string
        icon: "Crown" | "Flame" | "Target" | "Zap" | "Circle"
        title: string
        subtitle: string
        bgGlow: string
        textColor: string
        level: string
    } => {
        if (days >= 7)
            return {
                color: "from-orange-400 via-orange-500 to-orange-600",
                icon: "Crown",
                title: "Bậc Thầy Nhiếp Ảnh",
                subtitle: "Chuỗi Huyền Thoại",
                bgGlow: "from-orange-400/30 to-orange-600/30",
                textColor: "text-orange-600",
                level: "BẬC THẦY",
            }
        if (days >= 5)
            return {
                color: "from-orange-500 via-orange-600 to-orange-700",
                icon: "Flame",
                title: "Bùng Cháy",
                subtitle: "Đam Mê Rực Lửa",
                bgGlow: "from-orange-500/25 to-orange-700/25",
                textColor: "text-orange-700",
                level: "CHUYÊN GIA",
            }
        if (days >= 3)
            return {
                color: "from-orange-300 via-orange-400 to-orange-500",
                icon: "Target",
                title: "Đang Tiến Bộ",
                subtitle: "Xây Dựng Đà",
                bgGlow: "from-orange-300/20 to-orange-500/20",
                textColor: "text-orange-500",
                level: "NÂNG CAO",
            }
        if (days >= 1)
            return {
                color: "from-orange-200 via-orange-300 to-orange-400",
                icon: "Zap",
                title: "Khởi Đầu Tốt",
                subtitle: "Những Bước Đầu Tiên",
                bgGlow: "from-orange-200/15 to-orange-400/15",
                textColor: "text-orange-400",
                level: "NGƯỜI MỚI",
            }
        return {
            color: "from-gray-300 via-gray-400 to-gray-500",
            icon: "Circle",
            title: "Bắt Đầu Hành Trình",
            subtitle: "Bắt Đầu Con Đường Của Bạn",
            bgGlow: "from-gray-300/10 to-gray-500/10",
            textColor: "text-gray-500",
            level: "NGƯỜI MỚI",
        }
    }

    const streakInfo = getStreakInfo(consecutiveDays)

    if (!isLoggedIn) {
        return (
            <div className="text-center py-8 px-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LucideIcon name="Camera" className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Vui lòng đăng nhập</h3>
                <p className="text-gray-500">Đăng nhập để truy cập bảng điểm danh</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Confetti Effect */}
            <AnimatePresence>
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none z-20">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 1,
                                    y: 0,
                                    x: Math.random() * 300 - 150,
                                    rotate: 0,
                                    scale: 1,
                                }}
                                animate={{
                                    opacity: 0,
                                    y: -150,
                                    x: Math.random() * 300 - 150,
                                    rotate: 360,
                                    scale: 0,
                                }}
                                transition={{ duration: 2, delay: Math.random() * 0.5 }}
                                className={`absolute top-1/2 left-1/2 w-2 h-2 sm:w-3 sm:h-3 ${i % 4 === 0
                                    ? "bg-orange-400"
                                    : i % 4 === 1
                                        ? "bg-orange-500"
                                        : i % 4 === 2
                                            ? "bg-orange-600"
                                            : "bg-orange-300"
                                    } rounded-full`}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Calendar Section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Lịch điểm danh tuần này</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <LucideIcon name="Circle" className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Chưa điểm danh</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <LucideIcon name="CheckCircle" className="w-4 h-4 text-orange-500" />
                            <span className="text-xs text-gray-500">Đã điểm danh</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCalendarModal(true)}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50 h-8 px-3"
                        >
                            <LucideIcon name="Calendar" className="w-4 h-4 mr-1" />
                            <span className="text-xs">Xem lịch</span>
                        </Button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-3">
                    {attendanceData.map((record, index) => {
                        const { day, date, month } = formatDate(record.date)
                        const isToday = record.date === getTodayString()

                        return (
                            <motion.div
                                key={record.date}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.1 + index * 0.1,
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                className="relative group"
                            >
                                <div
                                    className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${isToday
                                        ? "bg-orange-50 border border-orange-200 shadow-sm"
                                        : "bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                                        }`}
                                >
                                    {/* Day Label */}
                                    <span className={`text-xs font-medium mb-1 ${isToday ? "text-orange-600" : "text-gray-600"}`}>
                                        {day}
                                    </span>

                                    {/* Date */}
                                    <span className={`text-base font-bold mb-1 ${isToday ? "text-orange-700" : "text-gray-800"}`}>
                                        {date}
                                    </span>

                                    {/* Month */}
                                    <span className={`text-xs mb-2 ${isToday ? "text-orange-500" : "text-gray-500"}`}>{month}</span>

                                    {/* Check Status */}
                                    <div className="relative">
                                        {record.checked ? (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                            >
                                                <LucideIcon name="CheckCircle" className="w-6 h-6 text-orange-500" />
                                            </motion.div>
                                        ) : (
                                            <LucideIcon name="Circle" className={`w-6 h-6 ${isToday ? "text-orange-300" : "text-gray-300"}`} />
                                        )}
                                    </div>

                                    {/* Today Indicator */}
                                    {isToday && (
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.7, 1, 0.7],
                                            }}
                                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                            className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Streak Info */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-r ${streakInfo.color} flex items-center justify-center shadow-md`}
                    >
                        <LucideIcon name={streakInfo.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className={`font-medium ${streakInfo.textColor}`}>{streakInfo.title}</h3>
                        <p className="text-xs text-gray-500">{streakInfo.subtitle}</p>
                    </div>
                    <div className="ml-auto">
                        <div className="text-xl font-bold text-gray-800"><span className="text-primary border border-primary rounded-md px-2 py-1">{consecutiveDays}</span> ngày liên tục</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Tiến độ</span>
                        <span>{Math.min(consecutiveDays, 7)}/7 ngày</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(Math.min(consecutiveDays, 7) / 7) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-2 rounded-full bg-gradient-to-r ${streakInfo.color}`}
                        />
                    </div>
                </div>
            </div>

            {/* Check-in Button */}
            <div className="text-center">
                {hasCheckedToday ? (
                    <Card className="bg-gradient-to-r py-4 from-orange-50 to-orange-100 border-orange-200">
                        <CardContent>
                            <div className="flex items-center justify-center gap-3 pt-4">
                                <LucideIcon name="CheckCircle" className="w-5 h-5 text-orange-500" />
                                <div>
                                    <div className="font-medium text-orange-700">Đã điểm danh hôm nay!</div>
                                    <div className="text-xs text-orange-600">Quay lại vào ngày mai</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Button
                        onClick={handleCheckIn}
                        disabled={isCheckingIn}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 rounded-lg shadow-md transition-all duration-300"
                    >
                        {isCheckingIn ? (
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                    <LucideIcon name="Zap" className="w-5 h-5" />
                                </motion.div>
                                <span>Đang xử lý...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <LucideIcon name="Camera" className="w-5 h-5" />
                                <span>Điểm danh ngay</span>
                            </div>
                        )}
                    </Button>
                )}
            </div>

            {/* Rewards Info */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                    <LucideIcon name="Star" className="w-4 h-4 text-orange-500" />
                    <h4 className="font-medium text-gray-700">Phần thưởng điểm danh</h4>
                </div>
                <ul className="space-y-2 text-gray-600 text-xs">
                    <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-orange-400 rounded-full" />
                        <span>Mỗi lần điểm danh: +10 điểm</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-orange-400 rounded-full" />
                        <span>Chuỗi 7 ngày: +100 điểm</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-orange-400 rounded-full" />
                        <span>Chuỗi 30 ngày: +500 điểm</span>
                    </li>
                </ul>
            </div>
            <AttendanceCalendarModal isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)} userId={userId} />
        </div>
    )
}

export default ProfileAttendanceBoard
