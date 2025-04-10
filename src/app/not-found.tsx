"use client"
import Link from "next/link"
import { ArrowRight, Camera, RefreshCw, Search } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function NotFound() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center  px-4 py-12 text-center bg-[#F8F8F8]">
            <div className="mx-auto max-w-md">
                <motion.div
                    className="mb-8 flex justify-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2,
                    }}
                >
                    <motion.div
                        className="rounded-full bg-gray-100 p-6"
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 2,
                            repeatType: "reverse",
                        }}
                    >
                        <Camera className="h-8 w-8 text-primary" />
                    </motion.div>
                </motion.div>

                <motion.h1
                    className="mb-4 text-5xl font-bold text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {isLoaded && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.1 }}
                            className="inline-block"
                        >
                            {"Oops!".split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        delay: index * 0.1,
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                    className="inline-block"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.span>
                    )}
                </motion.h1>

                <motion.h2
                    className="mb-6 text-2xl font-medium text-[#555555]"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    Không tìm thấy trang
                </motion.h2>

                <motion.p
                    className="mb-8 text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    Bạn đang đi lạc vào nơi mà ảnh sáng và màu sắc không còn hòa hợp.
                </motion.p>

                <motion.div
                    className="mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Bạn đang tìm kiếm thông tin gì thế?"
                            className="w-full rounded-full border border-gray-300 px-4 py-2 pr-10 focus:border-gray-400 focus:outline-none transition-all duration-300 hover:shadow-md focus:shadow-md"
                        />
                        <motion.button
                            className="cursor-pointer absolute right-1 top-1 rounded-full bg-[#8FAABF] p-2 text-white"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            animate={{
                                boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 8px rgba(0,0,0,0.5)", "0px 0px 0px rgba(0,0,0,0)"],
                            }}
                            transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 2,
                                repeatType: "reverse",
                            }}
                        >
                            <Search className="h-4 w-4" />
                        </motion.button>
                    </div>
                </motion.div>

                <motion.div
                    className="mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link
                            href="/"
                            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-lg"
                        >
                            Đưa tôi về nhà
                            <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </motion.span>
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                >
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link
                            href="/services"
                            className="inline-flex w-full bg[#8FAABF] items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:shadow-md"
                        >
                            Xem những dịch vụ của chúng tôi
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.5 }}
                >
                    © 2025 Photography Studio. Hãy cùng nhau lưu lại những khoảnh khắc!
                </motion.div>
            </div>
        </div>
    )
}
