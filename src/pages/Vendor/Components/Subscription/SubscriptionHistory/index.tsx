"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Badge } from "@/components/Atoms/ui/badge"
import { Button } from "@/components/Atoms/ui/button"
import { Calendar, CreditCard, Download, CheckCircle, Clock, XCircle, Crown, Zap, Building } from "lucide-react"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"

interface SubscriptionHistoryProps {
    history: any[]
}

export default function SubscriptionHistory({ history }: SubscriptionHistoryProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Đang hoạt động
                    </Badge>
                )
            case "completed":
                return (
                    <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Đã hoàn thành
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <XCircle className="h-3 w-3 mr-1" />
                        Đã hủy
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getPlanIcon = (planType: string) => {
        switch (planType) {
            case "premium":
                return <Crown className="h-5 w-5 text-purple-500" />
            case "basic":
                return <Building className="h-5 w-5 text-blue-500" />
            case "starter":
                return <Zap className="h-5 w-5 text-green-500" />
            default:
                return <Crown className="h-5 w-5 text-gray-500" />
        }
    }

    const getPlanColor = (planType: string) => {
        switch (planType) {
            case "premium":
                return "border-l-purple-500"
            case "basic":
                return "border-l-blue-500"
            case "starter":
                return "border-l-green-500"
            default:
                return "border-l-gray-500"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Lịch sử subscription</h3>
                    <p className="text-sm text-gray-500">Tổng cộng {history?.length} giao dịch</p>
                </div>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Xuất báo cáo
                </Button>
            </div>

            <div className="space-y-4">
                {/* Summary Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Thống kê tổng quan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{history?.length}</div>
                                <div className="text-sm text-gray-500">Tổng giao dịch</div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    {history?.filter((sub) => sub?.status === "active")?.length}
                                </div>
                                <div className="text-sm text-gray-500">Đang hoạt động</div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {formatPrice(history?.reduce((sum, sub) => sum + sub?.price, 0))}
                                </div>
                                <div className="text-sm text-gray-500">Tổng chi phí</div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {history?.map((subscription, index) => (
                    <Card key={subscription?.id} className={`border-l-4 ${getPlanColor(subscription?.planType)}`}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-gray-50 rounded-lg">{getPlanIcon(subscription?.planType)}</div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-semibold text-lg">Gói {subscription?.planName}</h4>
                                            {getStatusBadge(subscription?.status)}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600">
                                                    {formatDate(subscription?.startDate)} - {formatDate(subscription?.endDate)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600">{subscription?.paymentMethod}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600">Mã GD: {subscription?.transactionId}</span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Chu kỳ: {subscription?.billingCycle === "monthly" ? "Hàng tháng" : "Hàng năm"}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right space-y-2">
                                    <div className="text-2xl font-bold text-orange-600">{formatPrice(subscription?.price)}</div>

                                    <div className="flex gap-2">
                                        {subscription?.invoiceUrl && (
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-1" />
                                                Hóa đơn
                                            </Button>
                                        )}

                                        {subscription?.status === "active" && <Button size="sm">Quản lý</Button>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>


        </div>
    )
}
