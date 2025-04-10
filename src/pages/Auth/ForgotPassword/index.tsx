'use client'

import type React from "react"
import Link from "next/link"
import { ROUTES } from "@routes"
import styles from "./index.module.scss"
import { useForm } from "react-hook-form"
import Input from "@components/Atoms/Input"
import Button from "@components/Atoms/Button"
import { IUserLoginRequest, UserLoginRequest } from "@models/user/request.model"
import { zodResolver } from "@hookform/resolvers/zod"
import TransitionWrapper from "@components/Atoms/TransitionWrapper"
import { ArrowLeft } from "lucide-react"

const ForgotPasswordPage = () => {
    //#region Handle form submit
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUserLoginRequest>({
        resolver: zodResolver(UserLoginRequest),
    }
    )
    const onSubmit = (data: IUserLoginRequest) => console.log(data)
    //#endregion

    return (
        <TransitionWrapper>
            {/* Main card container */}
            <div className="w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row">
                {/* Left side - Login form */}
                <div className="w-full p-8 md:p-12">
                    {/* Center logo */}
                    .b
                    <Link href={ROUTES.AUTH.LOGIN} className="flex justify-center mb-10">
                        <img src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg" alt="" />
                    </Link>

                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-2">Quên mật khẩu</h1>
                        <p className="text-description-title mb-8 whitespace-pre-line">Nhập thông tin liên hệ của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className={"flex flex-col space-y-2"}>
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                placeholder="photogo@gmail.com"
                                {...register("email")}
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>

                        <Button type="submit" style={{ width: "100%" }}>
                            Tiếp tục
                        </Button>
                    </form>

                    <p className="flex mt-8 justify-center items-center text-description-title">
                        <ArrowLeft size={20} />
                        <Link href={ROUTES.AUTH.REGISTER} className="font-medium text-primary hover:underline">
                            Quay lại trang đăng nhập
                        </Link>
                    </p>
                </div>
                {/* --- End of MODIFIED Right side --- */}
            </div>
        </TransitionWrapper>
    )
}

export default ForgotPasswordPage