"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Rocket, Star, Calendar, Bell, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/Atoms/ui/card"
import Button from "@/components/Atoms/Button"
import Input from "@/components/Atoms/Input"

interface ComingSoonProps {
    title?: string
    subtitle?: string
    description?: string
    launchDate?: string
    showNotifyForm?: boolean
    className?: string
}

const ComingSoon = ({
    title = "Tính năng đang phát triển",
    subtitle = "Sắp ra mắt",
    description = "Chúng tôi đang làm việc chăm chỉ để mang đến cho bạn trải nghiệm tuyệt vời nhất. Vui lòng quay lại sau!",
    launchDate,
    showNotifyForm = true,
    className = ""
}: ComingSoonProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)

    // Countdown timer effect
    useEffect(() => {
        if (!launchDate) return

        const timer = setInterval(() => {
            const now = new Date().getTime()
            const launch = new Date(launchDate).getTime()
            const distance = launch - now

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                })
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                clearInterval(timer)
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [launchDate])

    const handleNotifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (email) {
            // Here you would typically call an API to subscribe the email
            setIsSubscribed(true)
            setEmail("")
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    const floatingVariants = {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    return (
        <motion.div
            className={`min-h-[500px] flex items-center justify-center p-6 ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-2xl mx-auto text-center space-y-8">
                {/* Floating Icons */}
                <div className="relative">
                    <motion.div
                        variants={floatingVariants}
                        initial="initial"
                        animate="animate"
                        className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg"
                    >
                        <Rocket className="w-12 h-12 text-white" />
                    </motion.div>

                    {/* Decorative stars */}
                    <motion.div
                        className="absolute -top-4 -right-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    </motion.div>
                    <motion.div
                        className="absolute -bottom-2 -left-6"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <Star className="w-4 h-4 text-purple-400 fill-current" />
                    </motion.div>
                </div>

                {/* Main Content */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                        {subtitle}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                        {title}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-lg mx-auto">
                        {description}
                    </p>
                </motion.div>

                {/* Countdown Timer */}
                {launchDate && (
                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Clock className="w-5 h-5 text-orange-500" />
                                    <span className="text-lg font-semibold text-gray-700">Thời gian còn lại</span>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { label: "Ngày", value: timeLeft.days },
                                        { label: "Giờ", value: timeLeft.hours },
                                        { label: "Phút", value: timeLeft.minutes },
                                        { label: "Giây", value: timeLeft.seconds }
                                    ].map((item, index) => (
                                        <div key={index} className="text-center">
                                            <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-2">
                                                <span className="text-2xl font-bold text-orange-600">
                                                    {item.value.toString().padStart(2, '0')}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Notification Form */}
                {showNotifyForm && (
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white shadow-lg">
                            <CardContent className="p-6">
                                {!isSubscribed ? (
                                    <form onSubmit={handleNotifySubmit} className="space-y-4">
                                        <div className="flex items-center gap-2 justify-center mb-4">
                                            <Bell className="w-5 h-5 text-blue-500" />
                                            <h3 className="text-lg font-semibold text-gray-700">
                                                Nhận thông báo khi ra mắt
                                            </h3>
                                        </div>
                                        <div className="flex gap-3 max-w-md mx-auto">
                                            <Input
                                                type="email"
                                                placeholder="Nhập email của bạn"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="flex-1"
                                                required
                                            />
                                            <Button
                                                type="submit"
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                                            >
                                                Đăng ký
                                            </Button>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Chúng tôi sẽ thông báo cho bạn ngay khi tính năng sẵn sàng!
                                        </p>
                                    </form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center space-y-3"
                                    >
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-green-700">
                                            Đăng ký thành công!
                                        </h3>
                                        <p className="text-green-600">
                                            Cảm ơn bạn! Chúng tôi sẽ thông báo khi tính năng sẵn sàng.
                                        </p>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Additional Info */}
                <motion.div variants={itemVariants} className="space-y-3">
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Đang phát triển</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            <span>Tính năng mới</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default ComingSoon 