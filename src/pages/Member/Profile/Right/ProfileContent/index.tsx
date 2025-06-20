"use client"

import Button from "@components/Atoms/Button"
import { Card, CardContent } from "@components/Atoms/Card"
import Input from "@components/Atoms/Input"
import Label from "@components/Atoms/Label"
import { IUser } from "@models/user/common.model"
import { IUserUpdateResponse } from "@models/user/response.model"
import userService from "@services/user"
import { Edit, Info } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface UpdateUserForm {
    fullName: string
    phoneNumber: string
}

export default function ProfileContent({ user }: { user: IUser }) {
    const [isEditing, setIsEditing] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateUserForm>({
        defaultValues: {
            fullName: user?.fullName,
            phoneNumber: String(user?.phoneNumber),
        },
    })

    const onSubmit = async (data: UpdateUserForm) => {

        const response = await userService.updateUser(user.id, {
            fullName: data?.fullName,
            phoneNumber: data?.phoneNumber,
        }) as IUserUpdateResponse
        if (response.statusCode === 200) {
            toast.success("Cập nhật thông tin thành công")
            setIsEditing(false)
        } else {
            reset()
            toast.error("Cập nhật thông tin thất bại")
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        reset() // reset về dữ liệu cũ
        setIsEditing(false)
    }

    const getRankInfo = (rank: string | undefined) => {
        switch (rank?.toLowerCase()) {
            case 'đồng':
                return {
                    level: 0,
                    gradient: 'from-[#b87333] via-[#d49a6a] to-[#8c6239]',
                    nextRank: 'Bạc',
                    spentGoal: 1000,
                    orderGoal: 5
                };
            case 'bạc':
                return {
                    level: 1,
                    gradient: 'from-[#b0b0b0] via-[#e0e0e0] to-[#8c8c8c]',
                    nextRank: 'Vàng',
                    spentGoal: 2000,
                    orderGoal: 10
                };
            case 'vàng':
                return {
                    level: 2,
                    gradient: 'from-[#d4af37] via-[#f7e27e] to-[#b8860b]',
                    nextRank: 'Kim Cương',
                    spentGoal: 4000,
                    orderGoal: 20
                };
            case 'kim cương':
                return {
                    level: 3,
                    gradient: 'from-[#1d9cd8] via-[#38c3ec] to-[#0f70b7]',
                    nextRank: null,
                    spentGoal: 0,
                    orderGoal: 0
                };
            default:
                return {
                    level: 0,
                    gradient: 'from-[#b87333] via-[#d49a6a] to-[#8c6239]',
                    nextRank: 'Bạc',
                    spentGoal: 1000,
                    orderGoal: 5
                };
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button onClick={handleSubmit(onSubmit)}>Lưu</Button>
                        <Button variant="outline" onClick={handleCancel}>Hủy</Button>
                    </div>
                ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit size={16} className="mr-1" />
                        Chỉnh sửa
                    </Button>
                )}
            </div>

            <Card>
                <CardContent>
                    <form className="my-4">
                        <div className="grid md:grid-cols-2 gap-4 p-3">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Họ và tên</Label>
                                <Input
                                    id="fullName"
                                    {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                                    disabled={!isEditing}
                                    defaultValue={user?.fullName}
                                    className={`${!isEditing ? "opacity-60 cursor-default" : "opacity-100 hover:opacity-100 focus:opacity-100"} transition-opacity duration-300`}
                                />
                                {errors?.fullName && <p className="text-red-500 text-sm">{errors?.fullName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                                <Input
                                    id="phoneNumber"
                                    {...register("phoneNumber", {
                                        required: "Vui lòng nhập số điện thoại",
                                        pattern: {
                                            value: /^[0-9]{9,11}$/,
                                            message: "Số điện thoại không hợp lệ",
                                        },
                                    })}
                                    disabled={!isEditing}
                                    className={`${!isEditing ? "opacity-60 cursor-default" : "opacity-100 hover:opacity-100 focus:opacity-100"} transition-opacity duration-300`}
                                    defaultValue={user?.phoneNumber}
                                />
                                {errors?.phoneNumber && <p className="text-red-500 text-sm">{errors?.phoneNumber.message}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 p-3">
                            <div className="space-y-2 opacity-60 cursor-default">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={user?.email} disabled />
                            </div>
                            <div className="space-y-2 opacity-60 cursor-default">
                                <Label htmlFor="rank">Hạng thành viên</Label>
                                <Input id="rank" value={user?.rank} disabled />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 p-3">
                            <div className="space-y-2 opacity-60 cursor-default">
                                <Label htmlFor="status">Ngày tham gia</Label>
                                <Input id="status" value={new Date(user?.createdAt).toLocaleDateString("vi-VN")} disabled />
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="mt-8">
                <div className="flex-1 rounded-lg overflow-hidden w-full">
                    <div className={`bg-gradient-to-tl ${getRankInfo(user?.rank).gradient} p-4 text-white`}>
                        <div className="flex items-center">
                            <div className="bg-white/20 rounded-md px-2 py-1 text-xs">Lv. {getRankInfo(user?.rank).level}</div>
                            <div className="ml-2 text-sm">Hạng hiện tại</div>
                        </div>
                        <h3 className="text-2xl font-bold mt-4">{user?.rank || 'Đồng'}</h3>
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
                            {getRankInfo(user?.rank).nextRank ? (
                                <p>
                                    Chi tiêu US$ {getRankInfo(user?.rank).spentGoal.toLocaleString()} (khoảng {(getRankInfo(user?.rank).spentGoal * 25875.37).toLocaleString('vi-VN')}đ) hoặc hoàn thành tham gia {getRankInfo(user?.rank).orderGoal} đơn hàng để lên
                                    hạng {getRankInfo(user?.rank).nextRank}
                                </p>
                            ) : (
                                <p>Bạn đã đạt hạng cao nhất!</p>
                            )}
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