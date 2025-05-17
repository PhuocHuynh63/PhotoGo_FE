"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { HelpCircle } from "lucide-react"
import Button from "@components/Atoms/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Molecules/Tabs"
import { motion } from 'framer-motion'
// Define the type for a transaction
type Transaction = {
    id: number;
    amount: number;
    description: string;
    date: string;
    expiryDate?: string; // Optional property
    expiredDate?: string; // Optional property
}

export default function PointsPage() {
    const [activeTab, setActiveTab] = useState("all")
    const [points, setPoints] = useState(100)
    const [animatedPoints, setAnimatedPoints] = useState(0)

    useEffect(() => {
        let start: number | null = null
        const duration = 1000 // in ms
        const initialValue = animatedPoints
        const diff = points - initialValue

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

        const step = (timestamp: number) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            const eased = easeOutCubic(progress)
            setAnimatedPoints(Math.floor(initialValue + diff * eased))
            if (progress < 1) requestAnimationFrame(step)
        }

        requestAnimationFrame(step)
    }, [points])

    // Update the xuTransactions object to use the new type
    const xuTransactions: { received: Transaction[]; used: Transaction[]; expired: Transaction[] } = {
        received: [
            {
                id: 1,
                amount: 50,
                description: "Hoàn tiền từ đơn hàng #ORD-2023-1205",
                date: "05/12/2023",
                expiryDate: "05/12/2024", // This property is now valid
            },
        ],
        used: [
            {
                id: 3,
                amount: -30,
                description: "Sử dụng cho đơn hàng #ORD-2024-0215",
                date: "15/02/2024",
                // expiryDate and expiredDate are not required here
            },
        ],
        expired: [
            {
                id: 5,
                amount: 20,
                description: "Khuyến mãi chào mừng",
                date: "01/01/2023",
                expiredDate: "01/01/2024", // This property is now valid
            },
            {
                id: 2,
                amount: 30,
                description: "Khuyến mãi chào mừng",
                date: "01/01/2023",
                expiredDate: "01/01/2024", // This property is now valid
            },
        ],
    }

    // Function to render transactions based on active tab
    const renderTransactions = () => {
        let transactions = []

        switch (activeTab) {
            case "received":
                transactions = xuTransactions.received
                break
            case "used":
                transactions = xuTransactions.used
                break
            case "expired":
                transactions = xuTransactions.expired
                break
            case "all":
            default:
                transactions = [...xuTransactions.received, ...xuTransactions.used, ...xuTransactions.expired]
                break
        }

        if (transactions.length === 0) {
            return (
                <div className="text-center py-12">
                    <div className="flex justify-center">
                        <Image
                            src="/placeholder.svg?height=120&width=120"
                            alt="Empty jar"
                            width={120}
                            height={120}
                            className="opacity-70"
                        />
                    </div>
                    <p className="mt-4 text-gray-500">Chưa có điểm</p>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                {transactions.map((transaction) => (
                    <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: transaction.id * 0.05 }}
                        className="border rounded-lg p-4"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-gray-500">{transaction.date}</p>
                                {transaction?.expiryDate && <p className="text-xs text-gray-400">Hết hạn: {transaction?.expiryDate}</p>}
                                {transaction?.expiredDate && (
                                    <p className="text-xs text-red-500">Đã hết hạn: {transaction?.expiredDate}</p>
                                )}
                            </div>
                            <div className={`font-bold ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                                {transaction.amount > 0 ? "+" : ""}
                                {transaction.amount} pp
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        )
    }

    return (
        <div className="container mx-auto">
            {/* Purple header with coins */}
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 mb-6 overflow-hidden">
                {/* Decorative coins */}
                <div className="absolute top-4 left-4 animate-bounce">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full border-4 border-yellow-300 shadow-lg transform -rotate-12"></div>
                </div>
                <div className="absolute bottom-12 right-12 animate-bounce" style={{ animationDelay: "0.5s" }}>
                    <div className="w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-300 shadow-lg transform rotate-12"></div>
                </div>
                <div className="absolute top-16 left-32 animate-bounce" style={{ animationDelay: "0.3s" }}>
                    <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-300 shadow-lg"></div>
                </div>

                {/* Stars */}
                <div className="absolute top-8 right-24">
                    <div className="text-yellow-300 text-2xl">✦</div>
                </div>
                <div className="absolute bottom-16 left-16">
                    <div className="text-yellow-300 text-xl">✦</div>
                </div>
                <div className="absolute bottom-8 right-8">
                    <div className="text-yellow-300 text-2xl">✦</div>
                </div>

                {/* Help button */}
                <Button
                    className="absolute top-2 right-2 text-white/80 hover:text-white hover:bg-white/10"
                >
                    <HelpCircle className="h-5 w-5" />
                </Button>

                {/* Content */}
                <div className="relative text-center text-white">
                    <h1 className={`text-7xl font-bold mb-2`}>
                        {animatedPoints}
                    </h1>
                    <p className="text-white/90">Có vẻ như bạn đã hết điểm. Hãy đặt hoạt động để nhận điểm nhé!</p>
                </div>
            </div>

            {/* Tabs section */}
            <div>
                <h2 className="text-xl font-bold mb-4">Thông tin PhotoGo Point</h2>

                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 gap-2 bg-orange-100 p-1 rounded-xl max-w-md mx-auto mb-6">
                        <TabsTrigger
                            value="all"
                        >
                            Tất cả
                        </TabsTrigger>
                        <TabsTrigger
                            value="received"
                        >
                            Đã nhận
                        </TabsTrigger>
                        <TabsTrigger
                            value="used"
                        >
                            Đã sử dụng
                        </TabsTrigger>
                        <TabsTrigger
                            value="expired"
                        >
                            Đã hết hạn
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderTransactions()}
                        </motion.div>
                    </TabsContent>
                    <TabsContent value="received">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderTransactions()}
                        </motion.div>

                    </TabsContent>
                    <TabsContent value="used">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderTransactions()}

                        </motion.div>
                    </TabsContent>
                    <TabsContent value="expired">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderTransactions()}

                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Information section */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Về PhotoGo Point</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li>• PhotoGo Point là điểm thưởng bạn nhận được khi đặt các dịch vụ trên PhotoGo</li>
                    <li>• 1 PhotoGo Point = 1 VND khi sử dụng để thanh toán</li>
                    <li>• PhotoGo Point có thời hạn sử dụng 12 tháng kể từ ngày nhận</li>
                    <li>• Thành viên hạng Bạc nhận được 1% giá trị đơn hàng bằng PhotoGo Point</li>
                    <li>• Thành viên hạng Vàng nhận được 3% giá trị đơn hàng bằng PhotoGo Point</li>
                </ul>
            </div>
        </div>
    )
}
