"use client";

import Button from "@components/Atoms/Button";
import { RegisterOptions, useForm } from "react-hook-form";
import Input from "@components/Atoms/Input";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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

    const fadeInVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    const renderPasswordInput = (
        label: string,
        field: keyof ChangePasswordData,
        registerOptions: RegisterOptions<ChangePasswordData> = {}
    ) => (
        <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4 }}
        >
            <label className={labelClasses}>{label}</label>
            <div className="relative">
                <Input
                    icon="Lock"
                    id={field}
                    type="password"
                    togglePassword={true}
                    placeholder="********"
                    {...register(field, registerOptions)}
                />
            </div>
            {errors[field] && <p className={errorClasses}>{errors[field]?.message}</p>}
        </motion.div>
    );

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 max-w-md mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
        >
            {renderPasswordInput(
                "Mật khẩu hiện tại",
                "oldPassword",
                { required: "Vui lòng nhập mật khẩu hiện tại" }
            )}
            {renderPasswordInput(
                "Mật khẩu mới",
                "newPassword",
                { required: "Vui lòng nhập mật khẩu mới" }
            )}
            {renderPasswordInput(
                "Nhập lại mật khẩu mới",
                "confirmPassword",
                { required: "Vui lòng nhập lại mật khẩu" }
            )}

            <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </Button>
            </motion.div>
        </motion.form>
    );
}
