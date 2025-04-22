"use client";

import Button from "@components/Atoms/Button";
import { RegisterOptions, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "@components/Atoms/Input";
import { toast } from "react-hot-toast";

type ChangePasswordData = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export default function ChangePasswordForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },

    } = useForm<ChangePasswordData>();

    const [showPassword, setShowPassword] = useState<Record<keyof ChangePasswordData, boolean>>({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const onSubmit = async (data: ChangePasswordData) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error("Mật khẩu mới không khớp");
            return;
        }

        console.log("Dữ liệu đổi mật khẩu:", data);
        await new Promise((res) => setTimeout(res, 1000)); // giả lập API
    };

    const labelClasses = "block mb-1 font-medium";
    const errorClasses = "text-red-500 text-sm mt-1";

    const renderPasswordInput = (
        label: string,
        field: keyof ChangePasswordData,
        togglePassword: () => void,
        registerOptions: RegisterOptions<ChangePasswordData> = {}
    ) => (
        <div>
            <label className={labelClasses}>{label}</label>
            <div className="relative">
                <Input
                    icon="Lock"
                    id={field}
                    type={showPassword[field] ? "text" : "password"}
                    togglePassword={true}
                    placeholder="********"
                    {...register(field, registerOptions)}
                />
            </div>
            {errors[field] && <p className={errorClasses}>{errors[field]?.message}</p>}
        </div>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md mx-auto">
            {renderPasswordInput(
                "Mật khẩu hiện tại",
                "oldPassword",
                () => setShowPassword({ ...showPassword, oldPassword: !showPassword.oldPassword }),
                { required: "Vui lòng nhập mật khẩu hiện tại" }
            )}
            {renderPasswordInput(
                "Mật khẩu mới",
                "newPassword",
                () => setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword }),
                { required: "Vui lòng nhập mật khẩu mới" }
            )}
            {renderPasswordInput(
                "Nhập lại mật khẩu mới",
                "confirmPassword",
                () => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword }),
                { required: "Vui lòng nhập lại mật khẩu" }
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </Button>
        </form>
    );
}
