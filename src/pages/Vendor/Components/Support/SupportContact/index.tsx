"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Badge } from "@components/Atoms/ui/badge"
import { Mail, Phone, Clock, CheckCircle, FileText, Play } from "lucide-react"

export default function SupportContact() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Cần thêm hỗ trợ?</CardTitle>
                    <p className="text-sm text-gray-500">Liên hệ với đội ngũ hỗ trợ của chúng tôi</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700 mb-2">
                            Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp đỡ bạn từ 8:00 đến 22:00 hàng ngày.
                        </p>
                    </div>

                    <Button className="w-full bg-gray-900 hover:bg-gray-800">Tạo yêu cầu hỗ trợ mới</Button>

                    <Button variant="outline" className="w-full">
                        Chat với hỗ trợ viên
                    </Button>

                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-medium">Thông tin liên hệ</h4>

                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>Email: support@photogo.com</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>Hotline: 1900 1234</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>Thời gian: 8:00 - 22:00 (Hàng ngày)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Trạng thái hệ thống</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Đặt lịch</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoạt động</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Thanh toán</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoạt động</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Thông báo</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoạt động</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Báo cáo</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoạt động</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Tài liệu phổ biến</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:underline">
                        <FileText className="h-4 w-4" />
                        <span>Hướng dẫn sử dụng</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:underline">
                        <FileText className="h-4 w-4" />
                        <span>Cách tạo lịch hẹn</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:underline">
                        <FileText className="h-4 w-4" />
                        <span>Chính sách thanh toán</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:underline">
                        <FileText className="h-4 w-4" />
                        <span>Ký kết hợp đồng với đối tác</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Video hướng dẫn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-red-600 cursor-pointer hover:underline">
                        <Play className="h-4 w-4" />
                        <span>Cách sử dụng hệ thống nghiệp</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-red-600 cursor-pointer hover:underline">
                        <Play className="h-4 w-4" />
                        <span>Quản lý lịch hẹn hiệu quả</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-red-600 cursor-pointer hover:underline">
                        <Play className="h-4 w-4" />
                        <span>Thay đổi doanh thu và báo cáo</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-red-600 cursor-pointer hover:underline">
                        <Play className="h-4 w-4" />
                        <span>Tối ưu hóa việc của bạn</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
