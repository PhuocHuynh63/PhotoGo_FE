"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@components/Atoms/ui/tooltip"
import Button from "@components/Atoms/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Molecules/Tabs"
import { motion } from 'framer-motion'
import Pagination from "@components/Organisms/Pagination/Pagination"
import { IPoint, IPointTransaction } from "@models/point/common.model"
import { IPagination } from "@models/metadata"

interface PointsPageProps {
    point: IPoint
    pointTransaction: IPointTransaction[]
    pagination: IPagination
    onPageChange?: (page: number) => void
}

export default function PointsPage({ point, pointTransaction, pagination, onPageChange }: PointsPageProps) {
    const [activeTab, setActiveTab] = useState("all")
    const [points] = useState(point?.balance ?? 0)
    const [animatedPoints, setAnimatedPoints] = useState(0)
    const [currentPage, setCurrentPage] = useState(pagination?.current || 1)

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
    }, [points, animatedPoints])

    // Update current page when pagination changes
    useEffect(() => {
        setCurrentPage(pagination?.current || 1)
    }, [pagination?.current])

    // Function to categorize transactions based on type
    const categorizeTransactions = () => {
        const received: IPointTransaction[] = []
        const used: IPointTransaction[] = []
        const expired: IPointTransaction[] = []

        pointTransaction?.forEach(transaction => {
            if (transaction.amount > 0) {
                received.push(transaction)
            } else if (transaction.amount < 0) {
                used.push(transaction)
            } else {
                // For now, we'll put transactions with 0 amount in expired
                // You might want to add a specific field for expired transactions
                expired.push(transaction)
            }
        })

        return { received, used, expired }
    }

    // Function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
    }

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        if (onPageChange) {
            onPageChange(page)
        }
    }

    // Function to render transactions based on active tab
    const renderTransactions = () => {
        const { received, used, expired } = categorizeTransactions()
        let transactions: IPointTransaction[] = []

        switch (activeTab) {
            case "received":
                transactions = received
                break
            case "used":
                transactions = used
                break
            case "expired":
                transactions = expired
                break
            case "all":
            default:
                transactions = [...received, ...used, ...expired]
                break
        }

        if (transactions?.length === 0) {
            return (
                <div className="text-center py-12">
                    <div className="flex justify-center">
                        <Image
                            src="https://res.cloudinary.com/dodtzdovx/image/upload/v1753246902/empty-wallet-remove-svgrepo-com_oy37ui.svg"
                            alt="Empty jar"
                            width={120}
                            height={120}
                            className="opacity-70"
                        />
                    </div>
                    <p className="mt-4 text-gray-500">Chưa có giao dịch điểm</p>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                {transactions?.map((transaction, index) => (
                    <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border rounded-lg p-4"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-gray-500">{formatDate(transaction.created_at)}</p>
                                <p className="text-xs text-gray-400">Loại: {transaction.type}</p>
                            </div>
                            <div className={`font-bold ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                                {transaction.amount > 0 ? "+" : ""}
                                {transaction.amount} pp
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Server-side Pagination */}
                {pagination && pagination.totalPage > 1 && (
                    <Pagination
                        className="mt-6"
                        total={pagination.totalPage}
                        current={currentPage}
                        onChange={handlePageChange}
                    />
                )}
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
                <TooltipProvider>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className="absolute top-2 right-2 text-white/80 hover:text-white hover:bg-white/10"
                            >
                                <HelpCircle className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            Thông tin về điểm thưởng
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Content */}
                <div className="relative text-center text-white">
                    <h1 className={`text-7xl font-bold mb-2`}>
                        {animatedPoints}
                    </h1>
                    <p className="text-white/90">
                        {points > 0
                            ? `Bạn có ${points} PhotoGo Point để sử dụng!`
                            : "Có vẻ như bạn đã hết điểm. Hãy đặt hoạt động để nhận điểm nhé!"
                        }
                    </p>
                </div>
            </div>

            {/* Tabs section */}
            <div>
                <h2 className="text-xl font-bold mb-4">Thông tin PhotoGo Point</h2>

                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 gap-2 bg-orange-100 p-1 rounded-xl max-w-md mx-auto mb-6">
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
