"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/Atoms/ui/card"
import { Button } from "@/components/Atoms/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import AttendanceCalendarInline from "../../../../Vendor/Components/AttendanceCalendarInline"
import LucideIcon from "@components/Atoms/LucideIcon"
import { IAttendance } from "@models/attendance/common.model"
import { CheckCircle, Circle } from "lucide-react"
import toast from "react-hot-toast"
import attendanceService from "@services/attendance"

type IconName = "Crown" | "Flame" | "Target" | "Zap" | "Circle";

interface ProfileAttendanceBoardProps {
    attendance?: IAttendance[]
    checkAttendance?: { hasAttended: boolean }
    isLoggedIn: boolean
    userId: string
    onCheckIn?: () => void
}
interface AttendanceRecord {
    date: string
    checked: boolean
}
interface ApiResponse {
    statusCode?: number
    message?: string
    data?: unknown
}
// Utility functions outside the component
const getTodayString = () => new Date().toISOString().split("T")[0]

const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        days.push(date.toISOString().split("T")[0])
    }
    return days
}

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

const getStreakInfo = (days: number) => {
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

const calculateConsecutiveDays = (attendance: AttendanceRecord[]) => {
    let consecutive = 0
    const sortedAttendance = [...attendance].reverse()
    for (const record of sortedAttendance) {
        if (record.checked) consecutive++
        else break
    }
    return consecutive
}

const ProfileAttendanceBoard = ({ attendance, checkAttendance, isLoggedIn, userId, onCheckIn }: ProfileAttendanceBoardProps) => {
    const [isCheckingIn, setIsCheckingIn] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const [showCalendarModal, setShowCalendarModal] = useState(false)
    const [localAttendanceData, setLocalAttendanceData] = useState<AttendanceRecord[] | null>(null);

    // Memoize attendanceData
    const attendanceData = useMemo(() => {
        if (localAttendanceData) return localAttendanceData;
        if (!isLoggedIn || !userId) return [];
        const last7Days = getLast7Days();
        return last7Days.map((date) => {
            const apiRecord = attendance?.find((record) => record.date === date);
            return {
                date,
                checked: apiRecord ? apiRecord.isChecked : false
            }
        });
    }, [isLoggedIn, userId, attendance, localAttendanceData]);

    // Memoize consecutiveDays
    const consecutiveDays = useMemo(() => calculateConsecutiveDays(attendanceData), [attendanceData])

    // Memoize hasCheckedToday
    const hasCheckedToday = useMemo(() => {
        const today = getTodayString()
        return attendanceData.find((record) => record.date === today)?.checked || false
    }, [attendanceData])

    const streakInfo = useMemo(() => getStreakInfo(consecutiveDays), [consecutiveDays])

    // Handle check-in
    const handleCheckIn = useCallback(async () => {
        if (!isLoggedIn || !userId || hasCheckedToday || isCheckingIn) return
        setIsCheckingIn(true)
        try {
            const today = getTodayString()
            const response = await attendanceService.checkIn(userId)
            if (response && (response as ApiResponse)?.statusCode === 201) {
                toast.success("Điểm danh thành công")
                setLocalAttendanceData(prev => {
                    const newData = (prev || attendanceData).map(record =>
                        record.date === today ? { ...record, checked: true } : record
                    );
                    return newData;
                })
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 2000)
                if (onCheckIn) onCheckIn()
            }
        } catch (error) {
            toast.error(error as string)
        } finally {
            setIsCheckingIn(false)
        }
    }, [isLoggedIn, userId, hasCheckedToday, isCheckingIn, onCheckIn, attendanceData, setLocalAttendanceData])

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
                    <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <LucideIcon name="Circle" className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-500">Chưa điểm danh</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <LucideIcon name="CheckCircle" className="w-4 h-4 text-orange-500" />
                                <span className="text-xs text-gray-500">Đã điểm danh</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCalendarModal((prev) => !prev)}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50 h-8 px-3 cursor-pointer"
                        >
                            <LucideIcon name="Calendar" className="w-4 h-4 mr-1" />
                            <span className="text-xs">{showCalendarModal ? "Ẩn lịch" : "Xem lịch"}</span>
                        </Button>
                    </div>
                </div>

                {/* Inline Calendar Modal */}
                {showCalendarModal && (
                    <AttendanceCalendarInline attendance={attendance} />
                )}

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
                                    <span className={`text-xs font-bold mb-1 ${isToday ? "text-orange-600" : "text-gray-600"}`}>{day}</span>
                                    <span className={`text-sm sm:text-base lg:text-lg font-black mb-1 ${isToday ? "text-orange-700" : "text-gray-800"}`}>{date}</span>
                                    <span className={`text-xs font-medium mb-2 sm:mb-3 hidden sm:block ${isToday ? "text-orange-500" : "text-gray-500"}`}>{month}</span>
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
                                                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                        className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 border border-orange-300 sm:border-2 rounded-full"
                                                    />
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <Circle className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${isToday ? "text-orange-300" : "text-gray-400"} group-hover:text-orange-400 transition-colors`} />
                                        )}
                                    </motion.div>
                                    {isToday && (
                                        <motion.div
                                            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                            className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-orange-500 rounded-full shadow-lg"
                                        />
                                    )}
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
            </div>

            {/* Streak Info */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${streakInfo.color} flex items-center justify-center shadow-md`}>
                        <LucideIcon name={streakInfo.icon as IconName} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className={`font-medium ${streakInfo.textColor}`}>{streakInfo.title}</h3>
                        <p className="text-xs text-gray-500">{streakInfo.subtitle}</p>
                    </div>
                    <div className="ml-auto">
                        <div className="text-xl font-bold text-gray-800"><span className="text-primary border border-primary rounded-md px-2 py-1">{consecutiveDays}</span> ngày liên tục</div>
                    </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-gray-700">Tiến độ tuần này</span>
                        <span className={`${streakInfo.textColor} font-bold text-base sm:text-sm`}>
                            {Math.min(consecutiveDays, 7)}/7 ngày
                        </span>
                    </div>
                    <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-4 overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(Math.min(consecutiveDays, 7) / 7) * 100}%` }}
                                transition={{ duration: 2, ease: "easeOut", delay: 1.8 }}
                                className={`h-3 sm:h-4 rounded-full bg-gradient-to-r ${streakInfo.color} relative overflow-hidden shadow-lg`}
                            >
                                <motion.div
                                    animate={{ x: ["0%", "100%"] }}
                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3"
                                />
                            </motion.div>
                        </div>
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
                </div>
            </div>

            {/* Check-in Button */}
            <div className="text-center">
                {checkAttendance?.hasAttended ? (
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
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 rounded-lg shadow-md transition-all duration-300 cursor-pointer"
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
        </div>
    )
}

export default ProfileAttendanceBoard
