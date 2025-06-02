"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Calendar, Trophy, Flame, Target, Star, TrendingUp, Award, Camera, Clock, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import ProfileAttendanceBoard from "@pages/Member/Profile/components/ProfileAttendanceBoard"

interface AttendancePageProps {
    isLoggedIn: boolean
    userId?: string
}

const AttendancePage = ({ isLoggedIn, userId }: AttendancePageProps) => {
    const [attendanceStats, setAttendanceStats] = useState({
        totalDays: 0,
        currentStreak: 0,
        longestStreak: 0,
        thisMonthDays: 0,
        totalRewards: 0,
    })

    const [recentActivity, setRecentActivity] = useState<
        Array<{
            date: string
            type: string
            description: string
            points?: number
        }>
    >([])

    // Tải thống kê điểm danh
    useEffect(() => {
        if (!isLoggedIn || !userId) return

        const storageKey = `attendance_${userId}`
        const savedData = localStorage.getItem(storageKey)

        if (savedData) {
            const attendanceData = JSON.parse(savedData)

            // Tính toán thống kê
            const totalDays = attendanceData.filter((record: any) => record.checked).length
            const currentStreak = calculateCurrentStreak(attendanceData)
            const longestStreak = calculateLongestStreak(attendanceData)
            const thisMonthDays = calculateThisMonthDays(attendanceData)

            setAttendanceStats({
                totalDays,
                currentStreak,
                longestStreak,
                thisMonthDays,
                totalRewards: totalDays * 10, // 10 điểm mỗi ngày
            })

            // Tạo hoạt động gần đây
            const recent = attendanceData
                .filter((record: any) => record.checked)
                .slice(-5)
                .reverse()
                .map((record: any) => ({
                    date: record.date,
                    type: "check-in",
                    description: "Điểm danh thành công",
                    points: 10,
                }))

            setRecentActivity(recent)
        }
    }, [isLoggedIn, userId])

    const calculateCurrentStreak = (data: any[]) => {
        let streak = 0
        const sortedData = [...data].reverse()

        for (const record of sortedData) {
            if (record.checked) {
                streak++
            } else {
                break
            }
        }

        return streak
    }

    const calculateLongestStreak = (data: any[]) => {
        let maxStreak = 0
        let currentStreak = 0

        for (const record of data) {
            if (record.checked) {
                currentStreak++
                maxStreak = Math.max(maxStreak, currentStreak)
            } else {
                currentStreak = 0
            }
        }

        return maxStreak
    }

    const calculateThisMonthDays = (data: any[]) => {
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()

        return data.filter((record: any) => {
            if (!record.checked) return false
            const recordDate = new Date(record.date)
            return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
        }).length
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const getStreakLevel = (streak: number) => {
        if (streak >= 30) return { level: "Bậc Thầy", color: "text-purple-600", icon: Award }
        if (streak >= 14) return { level: "Chuyên Gia", color: "text-orange-600", icon: Trophy }
        if (streak >= 7) return { level: "Nâng Cao", color: "text-orange-500", icon: Flame }
        if (streak >= 3) return { level: "Trung Cấp", color: "text-blue-500", icon: Target }
        return { level: "Sơ Cấp", color: "text-green-500", icon: Star }
    }

    const streakLevel = getStreakLevel(attendanceStats.currentStreak)

    // Xử lý callback điểm danh
    const handleCheckIn = () => {
        // Làm mới thống kê sau khi điểm danh
        const storageKey = `attendance_${userId}`
        const savedData = localStorage.getItem(storageKey)

        if (savedData) {
            const attendanceData = JSON.parse(savedData)

            setAttendanceStats((prev) => ({
                ...prev,
                totalDays: prev.totalDays + 1,
                currentStreak: prev.currentStreak + 1,
                longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
                thisMonthDays: prev.thisMonthDays + 1,
                totalRewards: prev.totalRewards + 10,
            }))

            // Thêm hoạt động mới
            const today = new Date().toISOString().split("T")[0]
            setRecentActivity((prev) => [
                {
                    date: today,
                    type: "check-in",
                    description: "Điểm danh thành công",
                    points: 10,
                },
                ...prev.slice(0, 4),
            ])
        }
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-4"
            >
                <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Điểm danh hàng ngày</h1>
                        <p className="text-gray-600">Theo dõi và duy trì thói quen điểm danh của bạn</p>
                    </div>
                </div>
            </motion.div>

            {/* Thẻ thống kê */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-4">
                    <CardContent className="p-4 pt-5 text-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-blue-700">{attendanceStats.totalDays}</div>
                        <div className="text-sm text-blue-600">Tổng ngày điểm danh</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 p-4">
                    <CardContent className="p-4 pt-5 text-center">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                            <Flame className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-orange-700">{attendanceStats.currentStreak}</div>
                        <div className="text-sm text-orange-600">Chuỗi hiện tại</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-4">
                    <CardContent className="p-4 pt-5 text-center">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-purple-700">{attendanceStats.longestStreak}</div>
                        <div className="text-sm text-purple-600">Kỷ lục cá nhân</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-4">
                    <CardContent className="p-4 pt-5 text-center">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <Star className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-green-700">{attendanceStats.totalRewards}</div>
                        <div className="text-sm text-green-600">Điểm thưởng</div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Lưới nội dung chính */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Bảng điểm danh */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="lg:col-span-2"
                >
                    <Card className="h-fit">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Camera className="w-5 h-5 text-orange-500" />
                                Bảng điểm danh
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProfileAttendanceBoard isLoggedIn={isLoggedIn} userId={userId} onCheckIn={handleCheckIn} />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Thanh bên */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="space-y-6"
                >
                    {/* Cấp độ hiện tại */}
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <streakLevel.icon className={`w-5 h-5 ${streakLevel.color}`} />
                                Cấp độ hiện tại
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${streakLevel.color}`}>{streakLevel.level}</div>
                                <div className="text-sm text-gray-600">Chuỗi {attendanceStats.currentStreak} ngày</div>
                            </div>

                            {attendanceStats.currentStreak < 30 && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Tiến độ đến cấp tiếp theo</span>
                                        <span className="font-medium">
                                            {attendanceStats.currentStreak}/
                                            {attendanceStats.currentStreak < 3
                                                ? 3
                                                : attendanceStats.currentStreak < 7
                                                    ? 7
                                                    : attendanceStats.currentStreak < 14
                                                        ? 14
                                                        : 30}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full bg-gradient-to-r ${attendanceStats.currentStreak < 3
                                                ? "from-green-400 to-green-500"
                                                : attendanceStats.currentStreak < 7
                                                    ? "from-blue-400 to-blue-500"
                                                    : attendanceStats.currentStreak < 14
                                                        ? "from-orange-400 to-orange-500"
                                                        : "from-purple-400 to-purple-500"
                                                }`}
                                            style={{
                                                width: `${(attendanceStats.currentStreak /
                                                    (attendanceStats.currentStreak < 3
                                                        ? 3
                                                        : attendanceStats.currentStreak < 7
                                                            ? 7
                                                            : attendanceStats.currentStreak < 14
                                                                ? 14
                                                                : 30)) *
                                                    100
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tiến độ tháng này */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                Tháng này
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Đã điểm danh</span>
                                <span className="font-bold text-blue-600">{attendanceStats.thisMonthDays} ngày</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Điểm thưởng tháng</span>
                                <span className="font-bold text-green-600">{attendanceStats.thisMonthDays * 10} điểm</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
                                    style={{ width: `${Math.min((attendanceStats.thisMonthDays / 30) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-500 text-center">Mục tiêu: 30 ngày/tháng</div>
                        </CardContent>
                    </Card>

                    {/* Hoạt động gần đây */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-500" />
                                Hoạt động gần đây
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentActivity.length > 0 ? (
                                <div className="space-y-3">
                                    {recentActivity.map((activity, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                                        >
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{activity.description}</div>
                                                <div className="text-xs text-gray-500">{formatDate(activity.date)}</div>
                                            </div>
                                            {activity.points && <div className="text-sm font-bold text-green-600">+{activity.points}</div>}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Chưa có hoạt động nào</p>
                                    <p className="text-xs">Hãy bắt đầu điểm danh ngay!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Phần mẹo */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
            >
                <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-orange-700 mb-3 flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            Mẹo duy trì thói quen điểm danh
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-600">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                <span>Đặt nhắc nhở hàng ngày vào cùng một thời điểm</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                <span>Kết hợp điểm danh với hoạt động hàng ngày khác</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                <span>Theo dõi tiến độ để duy trì động lực</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                <span>Chia sẻ thành tích với bạn bè để tạo động lực</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default AttendancePage
