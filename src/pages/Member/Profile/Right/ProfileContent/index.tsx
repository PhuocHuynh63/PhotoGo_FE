import Button from "@components/Atoms/Button"
import { Card, CardContent } from "@components/Atoms/Card"
import Input from "@components/Atoms/Input"
import Label from "@components/Atoms/Label"
import { IUser } from "@models/user/common.model"
import { Edit, Info } from "lucide-react"
import { useState } from "react"

export default function ProfileContent({ user }: { user: IUser }) {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
                <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? (
                        "Lưu"
                    ) : (
                        <div className="flex items-center gap-1">
                            <Edit size={16} />
                            <span>Chỉnh sửa</span>
                        </div>
                    )}
                </Button>
            </div>

            <Card>
                <CardContent className="">
                    <form className="my-4">
                        <div className="grid md:grid-cols-2 gap-4 p-3">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Họ và tên</Label>
                                <Input id="fullName" defaultValue={user?.fullName} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={user?.email} disabled={!isEditing} />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 p-3">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                                <Input id="phoneNumber" defaultValue={user?.phoneNumber} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Địa chỉ</Label>
                                <Input id="address" disabled={!isEditing} />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 p-3">
                            <div className="space-y-2">
                                <Label htmlFor="rank">Hạng thành viên</Label>
                                <Input id="rank" defaultValue={user?.rank} disabled={true} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Ngày tham gia</Label>
                                <Input id="status" defaultValue={new Date(user?.createdAt).toLocaleDateString('vi-VN')} disabled={true} />
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8">
                <div className="flex-1 rounded-lg overflow-hidden w-full">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-white">
                        <div className="flex items-center">
                            <div className="bg-white/20 rounded-md px-2 py-1 text-xs">Lv. 1</div>
                            <div className="ml-2 text-sm">Hạng hiện tại</div>
                        </div>
                        <h3 className="text-2xl font-bold mt-4">Bạc</h3>
                        <div className="mt-4 flex items-center">
                            <div className="bg-white/20 rounded-full p-2">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm">
                            <p>
                                Chi tiêu US$ 380.00 (khoảng 9832639.33đ) hoặc hoàn thành tham gia 5 đơn hàng trước 2026-04-18 để lên
                                hạng Vàng
                            </p>
                            <div className="flex items-center mt-1">
                                <Button
                                    className="shadow-none hover:text-white hover:bg-white/10"
                                >
                                    <Info className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}