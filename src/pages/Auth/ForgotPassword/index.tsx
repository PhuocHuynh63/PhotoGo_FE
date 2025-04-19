'use client'

import type React from "react"
import Link from "next/link"
import { ROUTES } from "@routes"
import { useForm } from "react-hook-form"
import Input from "@components/Atoms/Input"
import Button from "@components/Atoms/Button"
import { IUserForgotPasswordRequest, UserForgotPasswordRequest } from "@models/user/request.model"
import { zodResolver } from "@hookform/resolvers/zod"
import TransitionWrapper from "@components/Atoms/TransitionWrapper"
import { ArrowLeft, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import userService from "@services/user"
import { IBackendResponse } from "@models/backend/backendResponse.model"
import authService from "@services/auth"
import { useState } from "react"

const ForgotPasswordPage = () => {
    const router = useRouter();

    //#region Handle form submit
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUserForgotPasswordRequest>({
        resolver: zodResolver(UserForgotPasswordRequest),
    })

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const onSubmit = async (data: IUserForgotPasswordRequest) => {
        try {
            setIsLoading(true);

            const res = await userService.getAUserByEmail(data.email) as IBackendResponse<any>;
            if (!res.statusCode || ![200, 201].includes(res.statusCode)) {
                toast.error(res.message || "Email không tồn tại trong hệ thống");
                return;
            }

            const otpRes = await authService.sendOtp(data.email) as IBackendResponse<any>;
            if (otpRes.statusCode !== 201) {
                toast.error(otpRes.message || "Gửi mã OTP thất bại");
                return;
            }

            localStorage.setItem('email', data.email);
            toast.success("Chúng tôi đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra email để tiếp tục đặt lại mật khẩu.", {
                duration: 5000,
                position: "top-right",
            });

            router.push(`${ROUTES.AUTH.VERIFY_OTP}?purpose=reset-password`);
        } catch (error) {
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
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
                            <Mail className="w-8 h-8 text-primary font-bold" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-2">Quên mật khẩu</h1>
                        <p className="text-description text-center mb-8 whitespace-pre-line">Nhập thông tin liên hệ của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className={"flex flex-col space-y-2"}>
                            <Input
                                id="email"
                                placeholder="Email của bạn"
                                {...register("email")}
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>

                        <Button type="submit" style={{ width: "100%" }} isLoading={isLoading} disabled={isLoading}>
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

export default ForgotPasswordPage