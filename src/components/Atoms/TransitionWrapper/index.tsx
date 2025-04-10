"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type React from "react";

const TransitionWrapper = ({
    children,
    className, // Giá trị mặc định
    initial = { opacity: 0, x: 20 }, // Mặc định trượt từ phải
    animate = { opacity: 1, x: 0 }, // Mặc định hiển thị đầy đủ
    exit = { opacity: 0, x: -20 }, // Mặc định trượt ra trái
    transition = { duration: 0.3, ease: "easeInOut" }, // Mặc định 0.3s, easeInOut
    mode = "wait", // Mặc định đợi trang cũ thoát trước khi trang mới vào
}: ICOMPONENTS.TransitionWrapperProps) => {
    const pathname = usePathname();

    return (
        <AnimatePresence mode={mode}>
            <motion.div
                key={pathname}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={transition}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default TransitionWrapper;