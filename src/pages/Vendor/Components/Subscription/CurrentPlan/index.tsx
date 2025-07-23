"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Badge } from "@/components/Atoms/ui/badge"
import { Button } from "@/components/Atoms/ui/button"
import { Progress } from "@/components/Atoms/ui/progress"
import {
    Crown,
    Calendar,
    CreditCard,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Building,
    Database,
    Zap,
} from "lucide-react"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"
import { formatDate } from "@utils/helpers/Date"

interface CurrentPlanProps {
    plan: any
}

export default function CurrentPlan({ plan }: CurrentPlanProps) {


    const getPlanColor = (type: string) => {
        switch (type) {
            case "premium":
                return "bg-gradient-to-r from-purple-500 to-pink-500"
            case "basic":
                return "bg-gradient-to-r from-blue-500 to-cyan-500"
            case "starter":
                return "bg-gradient-to-r from-green-500 to-emerald-500"
            default:
                return "bg-gradient-to-r from-gray-500 to-slate-500"
        }
    }

    const getUsagePercentage = (used: number, limit: number) => {
        if (limit === -1) return 0 // unlimited
        return Math.min((used / limit) * 100, 100)
    }

    const getUsageColor = (percentage: number) => {
        if (percentage >= 90) return "bg-red-500"
        if (percentage >= 70) return "bg-yellow-500"
        return "bg-green-500"
    }

    return (
        <div className="space-y-6">
            {/* Plan Overview Card */}
            <Card className="relative overflow-hidden">
                <div className={`absolute inset-0 ${getPlanColor(plan?.type)} opacity-10`} />
                <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full ${getPlanColor(plan?.type)} text-white`}>
                                <Crown className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{plan?.name}</CardTitle>
                                <p className="text-sm text-gray-500">Gói đang sử dụng</p>
                            </div>
                        </div>
                        <Badge variant={plan?.status === "active" ? "default" : "secondary"} className="text-sm px-3 py-1">
                            {plan?.status === "active" ? "Đang hoạt động" : "Hết hạn"}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="relative space-y-6">
                    {/* Pricing & Billing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <CreditCard className="h-5 w-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-500">Giá gói</p>
                                <p className="font-semibold">{formatPrice(plan?.price)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-500">Chu kỳ</p>
                                <p className="font-semibold">{plan?.billingCycle === "monthly" ? "Hàng tháng" : "Hàng năm"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-500">Hết hạn</p>
                                <p className="font-semibold">{formatDate(plan?.endDate)}</p>
                            </div>
                        </div>
                    </div>



                    {/* Features */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Tính năng gói {plan?.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {plan?.features?.map((feature: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button className="flex-1">Gia hạn gói</Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                            Nâng cấp gói
                        </Button>
                        <Button variant="ghost">Hủy gói</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
