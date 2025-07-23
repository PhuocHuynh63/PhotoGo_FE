"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Badge } from "@/components/Atoms/ui/badge"
import { Button } from "@/components/Atoms/ui/button"
import { CheckCircle, XCircle, Crown, Zap, Building, Star, TrendingUp } from "lucide-react"

interface AvailablePlansProps {
    plans: any[]
    currentPlan: any
}

export default  function AvailablePlans({ plans, currentPlan }: AvailablePlansProps) {
    const formatCurrency = (amount: number) => {
        if (amount === 0) return "Miễn phí"
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const getPlanIcon = (planId: string) => {
        switch (planId) {
            case "premium":
                return <Crown className="h-6 w-6 text-purple-500" />
            case "basic":
                return <Building className="h-6 w-6 text-blue-500" />
            case "starter":
                return <Zap className="h-6 w-6 text-green-500" />
            default:
                return <Crown className="h-6 w-6 text-gray-500" />
        }
    }

    const getPlanGradient = (planId: string) => {
        switch (planId) {
            case "premium":
                return "bg-gradient-to-br from-purple-500 to-pink-500"
            case "basic":
                return "bg-gradient-to-br from-blue-500 to-cyan-500"
            case "starter":
                return "bg-gradient-to-br from-green-500 to-emerald-500"
            default:
                return "bg-gradient-to-br from-gray-500 to-slate-500"
        }
    }

    const isCurrentPlan = (planId: string) => {
        return currentPlan.type === planId
    }

    const isUpgrade = (planPrice: number) => {
        return planPrice > currentPlan.price
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Chọn gói phù hợp với bạn</h3>
                <p className="text-gray-500">Nâng cấp để mở khóa thêm nhiều tính năng mạnh mẽ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans?.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${plan.id === "premium" ? "ring-2 ring-purple-500 scale-105" : ""
                            } ${isCurrentPlan(plan.id) ? "ring-2 ring-orange-500" : ""}`}
                    >
                        {/* Popular Badge */}
                        {plan.id === "premium" && (
                            <div className="absolute top-4 right-4">
                                <Badge className="bg-purple-500 text-white">
                                    <Star className="h-3 w-3 mr-1" />
                                    Phổ biến
                                </Badge>
                            </div>
                        )}

                        {/* Current Plan Badge */}
                        {isCurrentPlan(plan.id) && (
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-orange-500 text-white">Đang sử dụng</Badge>
                            </div>
                        )}

                        <CardHeader className="text-center space-y-4">
                            <div
                                className={`w-16 h-16 mx-auto rounded-full ${getPlanGradient(plan.id)} flex items-center justify-center text-white`}
                            >
                                {getPlanIcon(plan.id)}
                            </div>

                            <div>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="text-4xl font-bold">{formatCurrency(plan.price)}</div>
                                <div className="text-sm text-gray-500">{plan.billingCycle === "monthly" ? "/tháng" : "/năm"}</div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Features */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-gray-700">Tính năng:</h4>
                                {plan.features.map((feature: string, index: number) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Limitations */}
                            {plan.limitations && plan.limitations.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm text-gray-700">Giới hạn:</h4>
                                    {plan.limitations.map((limitation: string, index: number) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-600">{limitation}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Action Button */}
                            <div className="pt-4">
                                {isCurrentPlan(plan.id) ? (
                                    <Button disabled className="w-full">
                                        Gói hiện tại
                                    </Button>
                                ) : isUpgrade(plan.price) ? (
                                    <Button className="w-full">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        Nâng cấp - {formatCurrency(plan.price - currentPlan.price)} thêm
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="w-full bg-transparent">
                                        Chuyển xuống gói này
                                    </Button>
                                )}
                            </div>

                            {/* Savings Badge */}
                            {plan.id === "premium" && (
                                <div className="text-center">
                                    <Badge variant="secondary" className="text-xs">
                                        Tiết kiệm 20% khi thanh toán năm
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Comparison Table */}
            <Card>
                <CardHeader>
                    <CardTitle>So sánh chi tiết các gói</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Tính năng</th>
                                    {plans?.map((plan) => (
                                        <th key={plan.id} className="text-center py-3 px-4">
                                            {plan.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-3 px-4 font-medium">Booking/tháng</td>
                                    <td className="text-center py-3 px-4">50</td>
                                    <td className="text-center py-3 px-4">200</td>
                                    <td className="text-center py-3 px-4">Không giới hạn</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 px-4 font-medium">Số chi nhánh</td>
                                    <td className="text-center py-3 px-4">1</td>
                                    <td className="text-center py-3 px-4">2</td>
                                    <td className="text-center py-3 px-4">5</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 px-4 font-medium">Lưu trữ</td>
                                    <td className="text-center py-3 px-4">5GB</td>
                                    <td className="text-center py-3 px-4">20GB</td>
                                    <td className="text-center py-3 px-4">50GB</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 px-4 font-medium">API Access</td>
                                    <td className="text-center py-3 px-4">
                                        <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                                    </td>
                                    <td className="text-center py-3 px-4">
                                        <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                                    </td>
                                    <td className="text-center py-3 px-4">
                                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                    </td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 px-4 font-medium">Custom Branding</td>
                                    <td className="text-center py-3 px-4">
                                        <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                                    </td>
                                    <td className="text-center py-3 px-4">
                                        <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                                    </td>
                                    <td className="text-center py-3 px-4">
                                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Hỗ trợ</td>
                                    <td className="text-center py-3 px-4">Email</td>
                                    <td className="text-center py-3 px-4">Chat</td>
                                    <td className="text-center py-3 px-4">24/7</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Câu hỏi thường gặp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Tôi có thể thay đổi gói bất cứ lúc nào không?</h4>
                        <p className="text-sm text-gray-600">
                            Có, bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Khi nâng cấp, bạn sẽ được tính phí theo tỷ lệ thời
                            gian còn lại.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Có được hoàn tiền khi hủy gói không?</h4>
                        <p className="text-sm text-gray-600">
                            Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày đầu tiên. Sau đó, bạn có thể hủy gói và sẽ không bị
                            tính phí cho chu kỳ tiếp theo.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Dữ liệu của tôi có được bảo mật không?</h4>
                        <p className="text-sm text-gray-600">
                            Tất cả dữ liệu được mã hóa và lưu trữ an toàn. Chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế và có
                            backup tự động hàng ngày.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
