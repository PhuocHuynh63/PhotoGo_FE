'use client'

import type React from "react"
import Link from "next/link"
import { ROUTES } from "@routes"
import { useForm } from "react-hook-form"
import Input from "@components/Atoms/Input"
import Button from "@components/Atoms/Button"
import { IUserResetPasswordRequest, UserResetPasswordRequest } from "@models/user/request.model"
import { zodResolver } from "@hookform/resolvers/zod"
import TransitionWrapper from "@components/Atoms/TransitionWrapper"
import { ArrowLeft, KeyRoundIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetLocalStorage } from "@utils/hooks/localStorage"

const ResetPassswordPage = () => {
    //#region define variables
    const { value, isReady } = useGetLocalStorage('email')
    const router = useRouter();
    //#endregion


    //#region Handle form submit
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUserResetPasswordRequest>({
        resolver: zodResolver(UserResetPasswordRequest),
    })

    const onSubmit = (data: IUserResetPasswordRequest) => {
        router.push(ROUTES.AUTH.VERIFY_OTP);
        localStorage.setItem('email', data.email);
        console.log(data);
    }
    //#endregion

    return (
        <TransitionWrapper>
            {/* Main card container */}
            <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row">
                {/* Forgot - form */}
                <div className="w-full p-8 md:p-12">
                    {/* Center logo */}
                    <div className="flex justify-center items-center mb-4">
                        <div className="rounded-full flex justify-center items-center w-16 h-16 bg-grey">
                            <KeyRoundIcon className="w-8 h-8 text-primary font-bold" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h1>
                        <p className="text-description text-center mb-8 whitespace-pre-line">Nhập và ghi nhớ mật khẩu mới</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email */}
                        <Input type="hidden" defaultValue={value || ''} {...register('email')} />

                        {/* New Password */}
                        <div className="flex flex-col space-y-2  mb-2">
                            <label htmlFor="newPassword" className="text-sm font-medium">
                                Mật khẩu mới
                            </label>

                            <div className="flex flex-col space-y-2">
                                <Input
                                    id="newPassword"
                                    type="newPassword"
                                    togglePassword={true}
                                    placeholder="Nhập mật khẩu mới"
                                    {...register("newPassword")}
                                    className={errors.newPassword ? 'input-error' : ''}
                                />
                                {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword?.message}</span>}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col space-y-2  mb-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Mật khẩu mới
                            </label>

                            <div className="flex flex-col space-y-2">
                                <Input
                                    id="confirmPassword"
                                    type="confirmPassword"
                                    togglePassword={true}
                                    placeholder="Nhập mật khẩu mới"
                                    {...register("confirmPassword")}
                                    className={errors.confirmPassword ? 'input-error' : ''}
                                />
                                {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword?.message}</span>}
                            </div>
                        </div>

                        <Button type="submit" style={{ width: "100%" }}>
                            Tiếp tục
                        </Button>
                    </form>

                    <p className="flex mt-5 justify-center items-center text-description-title">
                        <ArrowLeft size={20} className="text-dark mr-2" />
                        <Link href={ROUTES.AUTH.LOGIN} className="font-sm text-dark hover:underline">
                            Quay lại trang đăng nhập
                        </Link>
                    </p>
                </div>
                {/* --- End --- */}
            </div>
            <div className="flex justify-center items-center mt-8">
                <span className="text-description">Bạn cần trợ giúp? <Link href={ROUTES.PUBLIC.CONTACT} className="text-primary font-bold">Liên hệ với chúng tôi</Link>
                </span>
            </div>
        </TransitionWrapper>
    )
}

export default ResetPassswordPage