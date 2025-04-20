'use client'

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { ROUTES } from "@routes"
import styles from "./index.module.scss"
import { useForm } from "react-hook-form"
import Input from "@components/Atoms/Input"
import Button from "@components/Atoms/Button"
import { IUserLoginRequest, UserLoginRequest } from "@models/user/request.model"
import { zodResolver } from "@hookform/resolvers/zod"
import TransitionWrapper from "@components/Atoms/TransitionWrapper"
import { useRemoveLocalStorage } from "@utils/hooks/localStorage"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import authService from "@services/auth"
import { IBackendResponse } from "@models/backend/backendResponse.model"
import { AuthError } from "@constants/errors"

const LoginPage = () => {
    //#region define variables
    useRemoveLocalStorage("email")
    useRemoveLocalStorage("otp")
    const router = useRouter()
    //#endregion


    //#region Handle form submit
    const [loading, setLoading] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUserLoginRequest>({
        resolver: zodResolver(UserLoginRequest),
    })
    const onSubmit = async (data: IUserLoginRequest) => {
        try {
            setLoading(true);

            const res = await signIn("credentials", {
                redirect: false,
                ...data,
            });

            //#region Handle response
            const status = res?.status;
            const error = res?.error;
            const delay = 3;

            //#region Handle success
            if (status === 200) {
                router.push(ROUTES.PUBLIC.HOME);
                router.refresh();
                return;
            }
            //#endregion

            //#region Handle error
            if (error === AuthError.INACTIVE) {
                toast.error("Email chưa được xác thực. Vui lòng kiểm tra email để kích hoạt tài khoản. Chuyển hướng đến trang xác thực trong " + delay + " giây.");
                const resSendOtp = await authService.sendOtp(data.email) as IBackendResponse<any>;
                if (resSendOtp.statusCode !== 201) {
                    toast.error(resSendOtp.message || "Gửi mã OTP thất bại");
                    return;
                }

                setEmailToRedirect(data.email)
                setCountdown(delay)
                return;
            } else {
                toast.error(res?.error || "Đăng nhập thất bại");
                return;
            }
            //#endregion
            //#endregion

        } catch (err) {
            toast.error("Đã xảy ra lỗi, vui lòng thử lại");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    //#endregion


    //#region Handle downtime redirect
    const [countdown, setCountdown] = useState<number | null>(null)
    const [emailToRedirect, setEmailToRedirect] = useState<string | null>(null)

    useEffect(() => {
        if (countdown === null || !emailToRedirect) return

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev && prev <= 1) {
                    clearInterval(interval)
                    localStorage.setItem("email", emailToRedirect)
                    setTimeout(() => {
                        router.push(`${ROUTES.AUTH.VERIFY_OTP}?purpose=activate-account`)
                    }, 0)
                    return null
                }
                return (prev ?? 0) - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [countdown, emailToRedirect])
    //#endregion


    const handleGoogleLogin = () => {
        window.location.href = 'https://api.photogo.id.vn/api/v1/auth/google';
    }

    return (
        <>
            <TransitionWrapper className="w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row">
                {/* Main card container */}
                {/* Left side - Login form */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    {/* Center logo */}
                    <Link href={ROUTES.AUTH.LOGIN} className="flex justify-center mb-10 w-full h-12 relative">
                        <Image src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg" fill alt="" />
                    </Link>

                    <h1 className="text-2xl font-bold mb-2">Đăng nhập</h1>
                    <p className="text-description-title mb-8">Chào mừng bạn đến với PhotoGo</p>

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

                        <div className="flex flex-col space-y-2  mb-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Mật khẩu
                            </label>

                            <div className="flex flex-col space-y-2">
                                <Input
                                    id="password"
                                    type="password"
                                    togglePassword={true}
                                    placeholder="********"
                                    {...register("password")}
                                    className={errors.password ? 'input-error' : ''}
                                />
                                {errors.password && <span className="text-red-500 text-sm">{errors.password?.message}</span>}
                                <div className="flex justify-end">
                                    <Link href={ROUTES.AUTH.FORGOT_PASSWORD} className="w-fit text-sm hover:underline my-0.5">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" style={{ width: "100%" }} isLoading={loading} disabled={loading}>
                            Đăng nhập
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                            </div>
                            <div className="relative flex justify-center items-center text-sm">
                                <div className={styles.line}></div>
                                <span className={`px-2 font-bold ${styles.continue_with}`}>HOẶC TIẾP TỤC VỚI</span>
                                <div className={styles.line}></div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="cursor-pointer flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={handleGoogleLogin}
                            >
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    {/* Google SVG Path Data */}
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F</svg>4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                className="cursor-pointer flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <svg className="h-5 w-5 mr-2 text-[#1877F2]" viewBox="0 0 24 24" fill="#1877F2">
                                    {/* Facebook SVG Path Data */}
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-description-title">
                        Bạn chưa có tài khoản?{" "}
                        <Link href={ROUTES.AUTH.REGISTER} className="font-medium text-primary hover:underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>

                {/* --- MODIFIED Right side - Photo collage --- */}
                <div className="hidden items-center md:block md:w-1/2 bg-gradient-to-br from-[#DF9E61] to-[#E8B396] shadow-lg rounded-r-xl overflow-hidden">
                    {/* Container for padding and relative positioning */}
                    <div className="flex items-center justify-center h-full w-full  relative">
                        <div className="absolute top-4 left-0 right-0 p-6 text-white z-10">
                            <h2 className="text-xl font-bold mb-1 drop-shadow-lg">Thể hiện sự sáng tạo của bạn</h2>
                            <p className="text-sm opacity-90 drop-shadow-md">Tham gia cộng đồng nhiếp ảnh gia và người sáng tạo của chúng tôi</p>
                        </div>
                        <div className="h-9/12 w-full mt-10 p-4 relative">
                            {/* Photo collage grid (2 columns) */}
                            <div className="grid grid-cols-2 gap-4 h-full">
                                {/* Image 1: Tall, spans 2 rows in the first column */}
                                <div className="col-span-1 row-span-2 rounded-xl overflow-hidden transition-transform duration-300 shadow-lg group relative">
                                    <Image
                                        src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744191261/mau_1_t47cab.svg"
                                        alt="Scenic view"
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-15 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                                </div>

                                {/* Image 2: Top-right cell */}
                                <div className="col-span-1 row-span-1 rounded-xl overflow-hidden transition-transform duration-300 shadow-lg group relative">
                                    <Image
                                        src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744300737/mau_2_viaxwk.svg"
                                        alt="Creative shot"
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                                </div>

                                {/* Image 3: Bottom-right cell */}
                                <div className="col-span-1 row-span-1 rounded-xl overflow-hidden transition-transform duration-300 shadow-lg group relative">
                                    <Image
                                        src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744300689/mau_3_q6eubk.svg"
                                        alt="Community photo"
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {/* --- End of MODIFIED Right side --- */}
            </TransitionWrapper >
        </>
    )
}

export default LoginPage