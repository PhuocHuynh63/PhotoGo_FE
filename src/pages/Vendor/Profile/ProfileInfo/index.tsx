"use client"

import { useState } from "react"

import { CheckCircle } from "lucide-react"
import { Badge } from "@components/Atoms/ui/badge"
import { Progress } from "@components/Atoms/ui/progress"
import { Button } from "@components/Atoms/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { Switch } from "@components/Atoms/ui/switch"

interface ProfileData {
    name: string
    verified: boolean
    completionPercentage: number
    email: string
    phone: string
    address: string
    workingHours: string
    workingDays: string
    description: string
    settings: {
        showProfile: boolean
        showLocation: boolean
        emailNotifications: boolean
    }
}

interface ProfileInfoProps {
    profileData: ProfileData
}

export default function ProfileInfo({ profileData }: ProfileInfoProps) {
    const [settings, setSettings] = useState(profileData?.settings)

    const handleSettingChange = (setting: keyof typeof settings, value: boolean) => {
        setSettings((prev) => ({
            ...prev,
            [setting]: value,
        }))
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    {profileData?.name?.charAt(0)}
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{profileData?.name}</h3>
                        {profileData?.verified && (
                            <Badge variant="outline" className="bg-green-200 text-green-800 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Đã xác minh
                            </Badge>
                        )}
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">Hoàn thành hồ sơ</p>
                        <div className="flex items-center gap-2">
                            <Progress value={profileData?.completionPercentage} className="w-32 h-2" />
                            <span className="text-sm font-medium">{profileData?.completionPercentage}%</span>
                        </div>
                    </div>
                </div>

                <div className="ml-auto">
                    <Button
                        variant="outline"
                        className="bg-orange-50 text-orange-500 border-orange-200 hover:bg-orange-100 hover:text-orange-600"
                    >
                        Chỉnh sửa
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="info">
                <TabsList className="mb-4">
                    <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
                    <TabsTrigger value="services">Dịch vụ</TabsTrigger>
                    <TabsTrigger value="pricing">Bảng giá</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                            <p>{profileData?.email}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</h4>
                            <p>{profileData?.address}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</h4>
                            <p>{profileData?.phone}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Giờ mở cửa</h4>
                            <p>{profileData?.workingHours}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                            <p>www.anhduongstudio.com</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Ngày làm việc</h4>
                            <p>{profileData?.workingDays}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Mô tả</h4>
                        <p className="text-sm">{profileData?.description}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium mb-3">Cài đặt hiển thị</h4>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Hồ sơ công khai</p>
                                    <p className="text-sm text-gray-500">Cho phép khách hàng tìm thấy hồ sơ của bạn</p>
                                </div>
                                <Switch
                                    checked={settings?.showProfile}
                                    onCheckedChange={(checked) => handleSettingChange("showProfile", checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Hiển thị địa điểm</p>
                                    <p className="text-sm text-gray-500">Cho phép khách hàng đặt lịch với bạn</p>
                                </div>
                                <Switch
                                    checked={settings?.showLocation}
                                    onCheckedChange={(checked) => handleSettingChange("showLocation", checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Thông báo email</p>
                                    <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                                </div>
                                <Switch
                                    checked={settings?.emailNotifications}
                                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="services">
                    <p className="text-gray-500">Chưa có dịch vụ nào được thêm.</p>
                </TabsContent>

                <TabsContent value="pricing">
                    <p className="text-gray-500">Chưa có bảng giá nào được thêm.</p>
                </TabsContent>
            </Tabs>
        </div>
    )
}
