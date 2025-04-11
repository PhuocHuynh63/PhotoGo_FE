'use client'

import type React from "react"
import Link from "next/link"
import { ROUTES } from "@routes"
import { useForm } from "react-hook-form"
import Button from "@components/Atoms/Button"
import { IUserOTPRequest, UserOTPRequest } from "@models/user/request.model"
import { zodResolver } from "@hookform/resolvers/zod"
import TransitionWrapper from "@components/Atoms/TransitionWrapper"
import { ArrowLeft, KeyRound } from "lucide-react"
import OTPInput from "@components/Atoms/OTPInput"
import Input from "@components/Atoms/Input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useGetLocalStorage } from "@utils/hooks/localStorage"

const VerifyOtpPage = () => {
    //#region define variables
    const { value, isReady } = useGetLocalStorage('email')
    const router = useRouter()
    //#endregion


    //#region Handle form submit
    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<IUserOTPRequest>({
        resolver: zodResolver(UserOTPRequest),
    })
    const onSubmit = (data: IUserOTPRequest) => {
        console.log(data);
        router.push(ROUTES.AUTH.RESET_PASSWORD)
    }
    //#endregion


    //#region Handle OTP input change
    const handleOTPChange = (otp: string) => {
        setValue('otp', otp)
        trigger('otp')
    }
    //#endregion


    //#region Check email in localStorage and redirect if not found
    useEffect(() => {
        if (!isReady) return
        if (!value) {
            router.replace(ROUTES.AUTH.FORGOT_PASSWORD)
        }
    }, [value, router])
    //#endregion


    //#region Countdown timer for OTP resend
    //TODO: Để 5s cho dễ test, sau này để 60s
    const [countdown, setCountdown] = useState<number>(5)
    useEffect(() => {
        if (countdown <= 0) return
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [countdown])

    const handleResendOTP = async () => {
        try {
            // await api.sendOtpToEmail(value)
            toast.success('Đã gửi lại mã OTP')
            setCountdown(60)
        } catch (error) {
            toast.error('Gửi OTP thất bại')
        }
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
                            <KeyRound className="w-8 h-8 text-primary font-bold" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h1>
                        <p className="text-description text-center whitespace-pre-line">Nhập mã OTP đã được gửi đến email {value} và mật khẩu mới của bạn</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email */}
                        <Input type="hidden" defaultValue={value || ''} {...register('email')} />

                        {/* OTP */}
                        <label htmlFor="otp" className="text-sm font-medium">
                            Mã OTP
                        </label>
                        <div className="flex flex-col mt-2">
                            <input type="hidden" {...register('otp')} />
                            <OTPInput length={6} onChange={handleOTPChange} />
                            {errors.otp && <span className="text-red-500 text-sm">{errors.otp.message}</span>}
                        </div>
                        <div className="flex justify-end mt-2">
                            {countdown > 0 ? (
                                <span className="text-sm text-description">Gửi lại mã OTP sau {countdown}s</span>
                            ) : (
                                <p
                                    onClick={handleResendOTP}
                                    className="cursor-pointer text-sm text-primary font-medium hover:underline"
                                >
                                    Gửi lại mã OTP
                                </p>
                            )}
                        </div>
                        <Button type="submit" style={{ width: "100%" }}>
                            Đặt lại mật khẩu
                        </Button>
                    </form>


                    <p className="flex mt-5 justify-center items-center text-description-title">
                        <ArrowLeft size={20} className="text-dark mr-2" />
                        <Link href={ROUTES.AUTH.FORGOT_PASSWORD} className="font-sm text-dark hover:underline">
                            Quay lại
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

export default VerifyOtpPage