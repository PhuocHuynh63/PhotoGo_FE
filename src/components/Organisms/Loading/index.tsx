"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const LoadingPage = () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + Math.floor(Math.random() * 5) + 1
            })
        }, 100)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white">
            <div className="flex flex-col items-center space-y-8">
                <div className="relative h-24 w-48 sm:h-32 sm:w-64 animate-pulse">
                    <Image
                        src={`https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_orange_jslflw.svg`}
                        alt="PhotoGo Logo"
                        fill
                        className="object-contain drop-shadow-lg"
                        priority
                    />
                </div>

                <div className="w-64 sm:w-80 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-1">Loading amazing photos...</p>
                    <p className="text-xs font-medium text-orange-500">{progress}%</p>
                </div>
            </div>
        </div>
    )
}

export default LoadingPage
