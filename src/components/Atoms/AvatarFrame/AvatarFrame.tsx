'use client'
import { cn } from "@helpers/CN"
// import Image from "next/image"
import { Camera } from "lucide-react"




export function RankFrame({ rank = "unranked", className, showLabel = true, size = "sm", children, onClick }: ICOMPONENTS.RankFrameProps) {
    const sizeClasses = {
        sm: "w-16 h-16",
        md: "w-24 h-24",
        lg: "w-32 h-32",
    }

    const labelClasses = {
        unranked: "text-gray-500",
        bronze: "text-amber-700",
        silver: "text-gray-500",
        gold: "text-yellow-600",
    }

    return (
        <div className={cn("", className)} onClick={onClick}>
            <div className={cn("relative cursor-pointer", sizeClasses[size])}>
                {/* Frame SVG based on rank */}
                {/* {rank === "unranked" && (
                    <svg className="w-full h-full -mt-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="unrankedFrameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#F8F8F8" />
                                <stop offset="100%" stopColor="#E0E0E0" />
                            </linearGradient>
                        </defs>

                        <path
                            d="M15,30 H85 A5,5 0 0 1 90,35 V75 A5,5 0 0 1 85,80 H15 A5,5 0 0 1 10,75 V35 A5,5 0 0 1 15,30 Z"
                            fill="url(#unrankedFrameGradient)"
                            stroke="#D0D0D0"
                            strokeWidth="1"
                        />

                        <path
                            d="M35,20 H65 A3,3 0 0 1 68,23 V30 H32 V23 A3,3 0 0 1 35,20 Z"
                            fill="#E8E8E8"
                            stroke="#D0D0D0"
                            strokeWidth="1"
                        />

                        <rect x="70" y="20" width="10" height="10" rx="2" fill="#F0F0F0" stroke="#D0D0D0" strokeWidth="1" />

                        <circle cx="50" cy="55" r="25" fill="white" stroke="#D0D0D0" strokeWidth="1" />
                        <circle cx="50" cy="55" r="22" stroke="#E0E0E0" strokeWidth="0.5" fill="none" />

                        <rect x="20" y="40" width="10" height="5" rx="1" fill="#F0F0F0" />
                        <circle cx="75" cy="40" r="3" fill="#F0F0F0" />
                    </svg>
                )} */}

                {rank === "bronze" && (
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bronzeFrameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#E6C19C" />
                                <stop offset="50%" stopColor="#CD7F32" />
                                <stop offset="100%" stopColor="#A97142" />
                            </linearGradient>
                        </defs>

                        {/* Camera body */}
                        <path
                            d="M15,30 H85 A5,5 0 0 1 90,35 V75 A5,5 0 0 1 85,80 H15 A5,5 0 0 1 10,75 V35 A5,5 0 0 1 15,30 Z"
                            fill="url(#bronzeFrameGradient)"
                            stroke="#A97142"
                            strokeWidth="1.5"
                        />

                        {/* Camera top */}
                        <path
                            d="M30,20 H70 A3,3 0 0 1 73,23 V30 H27 V23 A3,3 0 0 1 30,20 Z"
                            fill="#CD7F32"
                            stroke="#A97142"
                            strokeWidth="1.5"
                        />

                        {/* Camera handle */}
                        <rect x="70" y="20" width="12" height="10" rx="2" fill="#E6C19C" stroke="#A97142" strokeWidth="1" />

                        {/* Lens circle */}
                        <circle cx="50" cy="55" r="25" fill="white" stroke="#A97142" strokeWidth="1.5" />
                        <circle cx="50" cy="55" r="22" stroke="#E6C19C" strokeWidth="0.5" fill="none" />

                        {/* Camera details */}
                        <rect x="20" y="40" width="12" height="5" rx="1" fill="#E6C19C" />
                        <circle cx="75" cy="40" r="4" fill="#E6C19C" />
                        <circle cx="75" cy="40" r="2" fill="#A97142" />
                    </svg>
                )}

                {rank === "silver" && (
                    <svg className="w-full h-full -mt-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="silverFrameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFFFFF" />
                                <stop offset="50%" stopColor="#E8E8E8" />
                                <stop offset="100%" stopColor="#C0C0C0" />
                            </linearGradient>
                        </defs>

                        {/* Camera body */}
                        <path
                            d="M15,30 H85 A5,5 0 0 1 90,35 V75 A5,5 0 0 1 85,80 H15 A5,5 0 0 1 10,75 V35 A5,5 0 0 1 15,30 Z"
                            fill="url(#silverFrameGradient)"
                            stroke="#A9A9A9"
                            strokeWidth="1.5"
                        />

                        {/* Camera top */}
                        <path
                            d="M25,20 H75 A3,3 0 0 1 78,23 V30 H22 V23 A3,3 0 0 1 25,20 Z"
                            fill="#D7D7D7"
                            stroke="#A9A9A9"
                            strokeWidth="1.5"
                        />

                        {/* Camera handle */}
                        <rect x="70" y="15" width="15" height="15" rx="3" fill="#E8E8E8" stroke="#A9A9A9" strokeWidth="1" />
                        <rect x="72" y="17" width="11" height="11" rx="2" fill="#FFFFFF" />

                        {/* Lens circle */}
                        <circle cx="50" cy="55" r="25" fill="white" stroke="#A9A9A9" strokeWidth="1.5" />
                        <circle cx="50" cy="55" r="22" stroke="#D7D7D7" strokeWidth="1" fill="none" />
                        <circle cx="50" cy="55" r="19" stroke="#A9A9A9" strokeWidth="0.5" fill="none" />

                        {/* Camera details */}
                        <rect x="20" y="40" width="15" height="5" rx="1" fill="#D7D7D7" />
                        <circle cx="75" cy="40" r="4" fill="#D7D7D7" />
                        <circle cx="75" cy="40" r="2" fill="#A9A9A9" />
                        <rect x="20" y="50" width="8" height="3" rx="1" fill="#D7D7D7" />
                    </svg>
                )}

                {rank === "gold" && (
                    <svg className="w-full h-full -mt-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="goldFrameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFF3A1" />
                                <stop offset="50%" stopColor="#FFD700" />
                                <stop offset="100%" stopColor="#DAA520" />
                            </linearGradient>
                            <linearGradient id="goldFrameShine" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Camera body - simplified flat design matching the example */}
                        <path
                            d="M10,30 H90 A5,5 0 0 1 95,35 V75 A5,5 0 0 1 90,80 H10 A5,5 0 0 1 5,75 V35 A5,5 0 0 1 10,30 Z"
                            fill="url(#goldFrameGradient)"
                            stroke="#B8860B"
                            strokeWidth="1"
                        />

                        {/* Camera top */}
                        <path
                            d="M25,15 H75 A5,5 0 0 1 80,20 V30 H20 V20 A5,5 0 0 1 25,15 Z"
                            fill="url(#goldFrameGradient)"
                            stroke="#B8860B"
                            strokeWidth="1"
                        />

                        {/* Camera handle/grip */}
                        <rect
                            x="65"
                            y="15"
                            width="15"
                            height="15"
                            rx="3"
                            fill="url(#goldFrameGradient)"
                            stroke="#B8860B"
                            strokeWidth="1"
                        />

                        {/* Camera viewfinder */}
                        <rect x="40" y="15" width="20" height="5" rx="2" fill="#FFFFFF" fillOpacity="0.3" />

                        {/* Left side detail */}
                        <rect
                            x="10"
                            y="40"
                            width="10"
                            height="30"
                            rx="2"
                            fill="url(#goldFrameGradient)"
                            stroke="#B8860B"
                            strokeWidth="0.5"
                        />
                        <rect
                            x="80"
                            y="40"
                            width="10"
                            height="30"
                            rx="2"
                            fill="url(#goldFrameGradient)"
                            stroke="#B8860B"
                            strokeWidth="0.5"
                        />

                        {/* Lens circle - white center for avatar */}
                        <circle cx="50" cy="55" r="25" fill="white" stroke="#B8860B" strokeWidth="1.5" />


                        {/* Shine effect */}
                        <path d="M15,30 L25,20 A50,50 0 0 1 75,20 L85,30" fill="url(#goldFrameShine)" opacity="0.5" />

                        {/* Camera button */}
                        <circle cx="75" cy="40" r="4" fill="#FFFFFF" fillOpacity="0.3" />

                        {/* Camera details */}
                        <rect x="20" y="40" width="8" height="3" rx="1" fill="#FFFFFF" fillOpacity="0.3" />
                    </svg>
                )}

                {/* Avatar placeholder or image - positioned to appear inside the camera lens */}
                <div className="absolute inset-0 mt-1.5 flex items-center justify-center">
                    <div className="rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                        {children || (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Camera className="w-1/3 h-1/3 text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showLabel && (
                <div className={cn("mt-1 font-bold text-lg", labelClasses[rank])}>
                    {rank.charAt(0).toUpperCase() + rank.slice(1)}
                </div>
            )}
        </div>
    )
}
