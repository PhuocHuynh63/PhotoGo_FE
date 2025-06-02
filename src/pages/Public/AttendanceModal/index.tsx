"use client"

import { useState, useEffect } from "react"

import { CheckCircle, Circle, Camera, Zap, Star, Sparkles, Trophy, Target, Flame, Crown, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import Link from "next/link"
import { ROUTES } from "@routes"

interface AttendanceRecord {
    date: string
    checked: boolean
}

interface AttendanceBoardProps {
    isLoggedIn: boolean
    userId?: string
}

const AttendanceBoard = ({ isLoggedIn, userId }: AttendanceBoardProps) => {
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
    const [hasCheckedToday, setHasCheckedToday] = useState(false)
    const [consecutiveDays, setConsecutiveDays] = useState(0)
    const [showBoard, setShowBoard] = useState(false)
    const [showCelebration, setShowCelebration] = useState(false)
    const [isCheckingIn, setIsCheckingIn] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)

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

        // Hiển thị bảng điểm danh
        setShowBoard(true)
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

        // Kiểm tra nếu đạt 7 ngày liên tục
        if (newConsecutive === 7) {
            console.log("🎉📸 CHÚC MỪNG NHIẾP ẢNH GIA XUẤT SẮC! 📸🎉")
            console.log("✨ Bạn đã hoàn thành thử thách 7 ngày liên tục!")
            console.log("🏆 Phần thưởng đặc biệt: Unlock Premium Features!")
            console.log("📷 Hãy tiếp tục hành trình sáng tạo của mình!")
            console.log("🎯 Thành tích mới: Photography Master!")

            setTimeout(() => {
                setShowCelebration(true)
                setTimeout(() => setShowCelebration(false), 5000)
            }, 500)
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
    const getStreakInfo = (days: number) => {
        if (days >= 7)
            return {
                color: "from-orange-400 via-orange-500 to-orange-600",
                icon: Crown,
                title: "Bậc thầy Nhiếp ảnh",
                subtitle: "Chuỗi ngày huyền thoại",
                bgGlow: "from-orange-400/30 to-orange-600/30",
                textColor: "text-orange-600",
                level: "BẬC THẦY",
            }
        if (days >= 5)
            return {
                color: "from-orange-500 via-orange-600 to-orange-700",
                icon: Flame,
                title: "Đang bùng cháy",
                subtitle: "Đam mê rực lửa",
                bgGlow: "from-orange-500/25 to-orange-700/25",
                textColor: "text-orange-700",
                level: "CHUYÊN GIA",
            }
        if (days >= 3)
            return {
                color: "from-orange-300 via-orange-400 to-orange-500",
                icon: Target,
                title: "Đang tiến bộ",
                subtitle: "Tăng tốc độ",
                bgGlow: "from-orange-300/20 to-orange-500/20",
                textColor: "text-orange-500",
                level: "NÂNG CAO",
            }
        if (days >= 1)
            return {
                color: "from-orange-200 via-orange-300 to-orange-400",
                icon: Zap,
                title: "Khởi đầu tốt",
                subtitle: "Bước đi đầu tiên",
                bgGlow: "from-orange-200/15 to-orange-400/15",
                textColor: "text-orange-400",
                level: "MỚI BẮT ĐẦU",
            }
        return {
            color: "from-gray-300 via-gray-400 to-gray-500",
            icon: Circle,
            title: "Bắt đầu hành trình",
            subtitle: "Hãy bắt đầu ngay!",
            bgGlow: "from-gray-300/10 to-gray-500/10",
            textColor: "text-gray-500",
            level: "KHỞI ĐẦU",
        }
    }

    const streakInfo = getStreakInfo(consecutiveDays)

    if (!isLoggedIn || !showBoard) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                className="w-full max-w-lg mx-auto"
            >
                <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-gray-400/20 to-gray-600/20 rounded-3xl blur-2xl"></div>

                    <Card className="relative bg-white border-0 shadow-2xl overflow-hidden py-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>
                        <CardContent className="relative text-center px-8">
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                                    scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                                }}
                                className="w-24 h-24 mx-auto mb-8"
                            >
                                <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-2xl">
                                    <Camera className="w-12 h-12 text-white" />
                                </div>
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Chào mừng đến PhotoGo</h3>

                            <Link href={`${ROUTES.AUTH.LOGIN}`}>
                                <p className="text-gray-600 text-lg mb-2 underline hover:text-orange-500">Vui lòng đăng nhập để truy cập</p>
                            </Link>

                            <p className="text-gray-500 text-sm">Bảng điểm danh nhiếp ảnh gia chuyên nghiệp</p>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        )
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative"
            >
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

                {/* Main Glow Effect */}
                <motion.div
                    animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    className={`absolute -inset-3 sm:-inset-6 bg-gradient-to-r ${streakInfo.bgGlow} rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl`}
                />

                {/* Celebration Ring */}
                <AnimatePresence>
                    {showCelebration && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute -inset-4 sm:-inset-8 border-2 sm:border-4 border-orange-400 rounded-2xl sm:rounded-3xl"
                        />
                    )}
                </AnimatePresence>

                <Card className="relative z-10 bg-white border-0 shadow-2xl overflow-hidden">
                    {/* Decorative Top Border */}
                    <div className={`h-1 sm:h-2 bg-gradient-to-r ${streakInfo.color}`}></div>

                    {/* Header Section */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-white">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.3)_0%,transparent_50%)]"></div>
                        </div>

                        <CardHeader className="text-center pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 relative">
                            {/* Main Title */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6"
                            >
                                <motion.div
                                    className="relative"
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                                        <Camera className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                                    </div>
                                    {consecutiveDays >= 7 && (
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                rotate: [0, 180, 360],
                                            }}
                                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
                                        >
                                            <Crown className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-orange-400 drop-shadow-lg" />
                                        </motion.div>
                                    )}
                                </motion.div>
                                <div className="text-left">
                                    <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">PhotoGo</h1>
                                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Attendance Tracker</p>
                                </div>
                            </motion.div>

                            {/* Streak Display */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 200 }}
                                className="space-y-3 sm:space-y-4"
                            >
                                {/* Level Badge */}
                                <div className="flex justify-center">
                                    <motion.div
                                        animate={{
                                            scale: consecutiveDays > 0 ? [1, 1.05, 1] : 1,
                                            boxShadow:
                                                consecutiveDays > 0
                                                    ? [
                                                        "0 0 0 0 rgba(251, 146, 60, 0)",
                                                        "0 0 0 10px rgba(251, 146, 60, 0.1)",
                                                        "0 0 0 0 rgba(251, 146, 60, 0)",
                                                    ]
                                                    : "0 0 0 0 rgba(251, 146, 60, 0)",
                                        }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${streakInfo.color} text-white font-bold text-base sm:text-lg lg:text-xl shadow-xl`}
                                    >
                                        <streakInfo.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                                        <span>{consecutiveDays}</span>
                                        <span className="text-sm sm:text-base lg:text-lg">ngày liên tục</span>
                                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                                    </motion.div>
                                </div>

                                {/* Level Info */}
                                <div className="text-center space-y-1 sm:space-y-2">
                                    <div
                                        className={`inline-block px-3 sm:px-4 py-1 rounded-full text-xs font-bold ${streakInfo.textColor} bg-orange-50 border border-orange-200`}
                                    >
                                        {streakInfo.level}
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">{streakInfo.title}</h3>
                                    <p className="text-sm text-gray-600">{streakInfo.subtitle}</p>
                                </div>

                                {/* Master Achievement */}
                                {consecutiveDays >= 7 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-orange-200 mx-2 sm:mx-4"
                                    >
                                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="font-bold text-xs sm:text-sm">Photography Master Achieved!</span>
                                        <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </motion.div>
                                )}
                            </motion.div>
                        </CardHeader>
                    </div>

                    {/* Calendar Section */}
                    <CardContent className="p-4 sm:p-6 lg:p-8 bg-white">
                        {/* Calendar Title */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-center mb-4 sm:mb-6 lg:mb-8"
                        >
                            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">Lịch điểm danh tuần này</h2>
                            <p className="text-xs sm:text-sm text-gray-600">Theo dõi tiến độ hàng ngày của bạn</p>
                        </motion.div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 mb-6 sm:mb-8 lg:mb-10">
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
                                            delay: 0.8 + index * 0.1,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                        className={`relative group cursor-pointer`}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex flex-col items-center p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 ${isToday
                                                ? "bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100 border border-orange-400 sm:border-2 shadow-lg sm:shadow-xl"
                                                : "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 hover:border-gray-300 hover:shadow-md sm:hover:shadow-lg"
                                                }`}
                                        >
                                            {/* Day Label */}
                                            <span className={`text-xs font-bold mb-1 ${isToday ? "text-orange-600" : "text-gray-600"}`}>
                                                {day}
                                            </span>

                                            {/* Date */}
                                            <span
                                                className={`text-sm sm:text-base lg:text-lg font-black mb-1 ${isToday ? "text-orange-700" : "text-gray-800"}`}
                                            >
                                                {date}
                                            </span>

                                            {/* Month - Hidden on small screens */}
                                            <span
                                                className={`text-xs font-medium mb-2 sm:mb-3 hidden sm:block ${isToday ? "text-orange-500" : "text-gray-500"}`}
                                            >
                                                {month}
                                            </span>

                                            {/* Check Status */}
                                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="relative">
                                                {record.checked ? (
                                                    <motion.div
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                                    >
                                                        <div className="relative">
                                                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-orange-500 drop-shadow-lg" />
                                                            <motion.div
                                                                animate={{
                                                                    scale: [1, 1.3, 1],
                                                                    opacity: [0.5, 0.8, 0.5],
                                                                }}
                                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                                className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 border border-orange-300 sm:border-2 rounded-full"
                                                            />
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <Circle
                                                        className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${isToday ? "text-orange-300" : "text-gray-400"} group-hover:text-orange-400 transition-colors`}
                                                    />
                                                )}
                                            </motion.div>

                                            {/* Today Pulse */}
                                            {isToday && (
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.4, 1],
                                                        opacity: [0.7, 1, 0.7],
                                                    }}
                                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                    className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-orange-500 rounded-full shadow-lg"
                                                />
                                            )}

                                            {/* Streak Indicator */}
                                            {record.checked && consecutiveDays >= 3 && (
                                                <motion.div
                                                    animate={{ y: [-2, 2, -2] }}
                                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                    className="absolute -bottom-0.5 sm:-bottom-1 w-1 h-1 sm:w-2 sm:h-2 bg-orange-400 rounded-full shadow-sm"
                                                />
                                            )}
                                        </motion.div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Action Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.6 }}
                            className="space-y-4 sm:space-y-6"
                        >
                            {/* Check-in Button */}
                            <div className="text-center">
                                {hasCheckedToday ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl sm:rounded-2xl blur-sm"></div>
                                        <div className="relative flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 text-orange-600 font-bold bg-gradient-to-r from-orange-50 to-orange-100 py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl border border-orange-200 sm:border-2 shadow-lg">
                                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                            <div className="text-center">
                                                <div className="text-base sm:text-lg lg:text-xl">Hoàn thành xuất sắc!</div>
                                                <div className="text-xs sm:text-sm font-medium text-orange-500">Hôm nay bạn đã điểm danh</div>
                                            </div>
                                            <Camera className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative">
                                        <Button
                                            onClick={handleCheckIn}
                                            disabled={isCheckingIn}
                                            className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white border-0 shadow-2xl py-7 sm:py-7 lg:py-7 px-4 sm:px-6 lg:px-8 text-base sm:text-lg lg:text-xl font-bold rounded-xl sm:rounded-2xl transition-all duration-300 relative overflow-hidden group"
                                        >
                                            {isCheckingIn ? (
                                                <motion.div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                    >
                                                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                                    </motion.div>
                                                    <div className="text-center">
                                                        <div>Đang xử lý...</div>
                                                        <div className="text-xs sm:text-sm font-medium opacity-90">Vui lòng chờ</div>
                                                    </div>
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                                                    >
                                                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                                    </motion.div>
                                                </motion.div>
                                            ) : (
                                                <>
                                                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-3 lg:mr-4" />
                                                    <div className="text-center">
                                                        <div>Điểm danh hôm nay</div>
                                                        <div className="text-xs sm:text-sm font-medium opacity-90">Ghi nhận hoạt động</div>
                                                    </div>
                                                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ml-2 sm:ml-3 lg:ml-4" />
                                                </>
                                            )}

                                            {/* Button Shine Effect */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                initial={{ x: "-100%" }}
                                                whileHover={{ x: "100%" }}
                                                transition={{ duration: 0.6 }}
                                            />
                                        </Button>
                                    </motion.div>
                                )}
                            </div>

                            {/* Progress Section */}
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-gray-700">Tiến độ tuần này</span>
                                    <span className={`${streakInfo.textColor} font-bold text-base sm:text-lg`}>
                                        {Math.min(consecutiveDays, 7)}/7 ngày
                                    </span>
                                </div>

                                <div className="relative">
                                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(Math.min(consecutiveDays, 7) / 7) * 100}%` }}
                                            transition={{ duration: 2, ease: "easeOut", delay: 1.8 }}
                                            className={`h-3 sm:h-4 rounded-full bg-gradient-to-r ${streakInfo.color} relative overflow-hidden shadow-lg`}
                                        >
                                            {/* Progress Shine Effect */}
                                            <motion.div
                                                animate={{ x: ["0%", "100%"] }}
                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3"
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Progress Milestones */}
                                    <div className="absolute top-0 w-full h-3 sm:h-4 flex justify-between items-center px-0.5 sm:px-1">
                                        {[...Array(7)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 2 + i * 0.1, duration: 0.3 }}
                                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${i < consecutiveDays ? "bg-white shadow-lg" : "bg-gray-400"}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-xs text-gray-600">
                                        {consecutiveDays < 7
                                            ? `Còn ${7 - consecutiveDays} ngày để đạt Photography Master! 🎯`
                                            : "🎉 Bạn đã đạt cấp độ cao nhất! Hãy tiếp tục duy trì!"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Enhanced Celebration Modal */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 180, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="relative max-w-xs sm:max-w-sm lg:max-w-md mx-4"
                        >
                            {/* Background Glow */}
                            <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-gradient-to-r from-orange-400/40 to-orange-600/40 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl"></div>

                            <div className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center shadow-2xl overflow-hidden">
                                {/* Background Pattern */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className="absolute inset-0 opacity-10"
                                >
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_2px,transparent_2px)] bg-[length:20px_20px] sm:bg-[length:30px_30px]"></div>
                                </motion.div>

                                <div className="relative z-10">
                                    {/* Trophy Animation */}
                                    <motion.div
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1],
                                            y: [0, -5, 0],
                                        }}
                                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                        className="mb-4 sm:mb-6 lg:mb-8"
                                    >
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl">
                                            <Crown className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" />
                                        </div>
                                    </motion.div>

                                    {/* Text Content */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                    >
                                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 sm:mb-3">CHÚC MỪNG!</h3>
                                        <div className="bg-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                                            <p className="text-white/95 text-lg sm:text-xl font-bold mb-1">Photography Master</p>
                                            <p className="text-white/90 text-sm">7 ngày liên tục hoàn thành!</p>
                                        </div>
                                    </motion.div>

                                    {/* Stars Animation */}
                                    <div className="flex justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
                                        {[...Array(7)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{
                                                    delay: 1 + i * 0.1,
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 15,
                                                }}
                                            >
                                                <Star className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Achievement Badge */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.8, duration: 0.6 }}
                                        className="bg-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-sm"
                                    >
                                        <div className="flex items-center justify-center gap-2 text-white/95 text-xs sm:text-sm font-bold">
                                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span>Premium Features Unlocked!</span>
                                            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default AttendanceBoard
