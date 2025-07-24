"use client"

import Button from "@components/Atoms/Button"
import { Card, CardContent } from "@components/Atoms/Card"
import Input from "@components/Atoms/Input"
import Label from "@components/Atoms/Label"
import { IUser } from "@models/user/common.model"
import { IUserUpdateResponse } from "@models/user/response.model"
import userService from "@services/user"
import { Edit } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Subscription from "@components/Atoms/Subscription"

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

    const hasSubscription = Boolean(user?.subscription)

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
                                <Label htmlFor="status">Ngày tham gia</Label>
                                <Input id="status" value={new Date(user?.createdAt).toLocaleDateString("vi-VN")} disabled />
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Subscription hasSubscription={hasSubscription} />
        </div>
    )
}