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
import { useEffect } from "react"
import toast from "react-hot-toast"
import authService from "@services/auth"
import { IBackendResponse } from "@models/backend/backendResponse.model"
import { signIn } from "next-auth/react"

const ResetPassswordPage = () => {
    //#region define variables
    const { value, isReady } = useGetLocalStorage('email')
    const { value: otp } = useGetLocalStorage('otp')
    const router = useRouter();
    //#endregion


    //#region Handle form submit
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<IUserResetPasswordRequest>({
        resolver: zodResolver(UserResetPasswordRequest),
    })

    const onSubmit = async (data: IUserResetPasswordRequest) => {
        //#region api reset password
        const res = await authService.resetPassword(data) as IBackendResponse<any>

        if (res.statusCode !== 201) {
            toast.error(res.message || 'Đặt lại mật khẩu thất bại')
            return
        }
        localStorage.removeItem('email');
        localStorage.removeItem('otp');
        toast.success('Đặt lại mật khẩu thành công')
        //#endregion

        //#region login after reset password
        const resLogin = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        })
        if (resLogin?.error) {
            toast.error(resLogin?.error || 'Đăng nhập thất bại')
            return
        }
        router.push(ROUTES.PUBLIC.HOME)
        //#endregion
    }
    //#endregion

    /**
       * Handle confirm password
       * @param value 
       * @returns 
       */
    const handleConfirmPassword = (value: string) => {
        if (value !== watch('password')) {
            return 'Password does not match';
        }
        return true;
    };
    //---------------------------Handle confirm password---------------------------//


    //#region check if email is exist in local storage
    useEffect(() => {
        if (!isReady) return;
        if (!value) {
            router.push(ROUTES.AUTH.FORGOT_PASSWORD)
        } else {
            setValue('email', value)
            setValue('otp', otp || '')
        }
    }, [isReady, value, otp, router])
    //#endregion

    return (
        <div className="w-full max-w-4/12">
            <TransitionWrapper className="bg-white rounded-xl overflow-hidden shadow-xl  md:flex-row">
                {/* Main card container */}
                <div className="flex flex-col">
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
                            {/* OTP */}
                            <Input type="hidden" defaultValue={otp || ''} {...register('otp')} />

                            {/* Email */}
                            <Input type="hidden" defaultValue={value || ''} {...register('email')} />

                            {/* New Password */}
                            <div className="flex flex-col space-y-2  mb-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Mật khẩu mới
                                </label>

                                <div className="flex flex-col space-y-2 mb-2">
                                    <Input
                                        id="password"
                                        type="password"
                                        togglePassword={true}
                                        placeholder="Nhập mật khẩu mới"
                                        {...register("password")}
                                        className={errors.password ? 'input-error' : ''}
                                    />
                                    {errors.password && <span className="text-red-500 text-sm">{errors.password?.message}</span>}
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col space-y-2 mb-4">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Xác nhận mật khẩu
                                </label>

                                <div className="flex flex-col space-y-2 mb-2">
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        togglePassword={true}
                                        placeholder="Xác nhận mật khẩu mới"
                                        {...register("confirmPassword", {
                                            required: true,
                                            validate: handleConfirmPassword,
                                        })}
                                        className={errors.confirmPassword ? 'input-error' : ''}
                                    />
                                    {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword?.message}</span>}
                                </div>
                            </div>

                            <Button type="submit" style={{ width: "100%" }}>
                                Xác nhận
                            </Button>
                        </form>

                        <p className="flex mt-5 justify-center items-center text-description-title">
                            <ArrowLeft size={20} className="text-dark mr-2" />
                            <Link href={ROUTES.AUTH.FORGOT_PASSWORD} className="font-sm text-dark hover:underline" onClick={() => localStorage.removeItem('email')}>
                                Quay lại
                            </Link>
                        </p>
                    </div>
                    {/* --- End --- */}
                </div>
            </TransitionWrapper>
            <div className="flex justify-center items-center mt-8">
                <span className="text-description">Bạn cần trợ giúp? <Link href={ROUTES.PUBLIC.CONTACT} className="text-primary font-bold">Liên hệ với chúng tôi</Link>
                </span>
            </div>
        </div>

    )
}

export default ResetPassswordPage