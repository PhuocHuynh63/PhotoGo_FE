"use client"

import type React from "react"
import { useRef, useLayoutEffect, useState } from "react"
import clsx from "clsx"
import { type Rank, rankConfigs } from "./rankStyles"
import { Crown, Medal, Award, Trophy, Gem } from "lucide-react"

const RankIcons = {
    Crown,
    Medal,
    Award,
    Trophy,
    Gem,
}

interface AvatarWithBorderProps {
    rank?: Rank
    children: React.ReactNode
}

export const AvatarWithBorder: React.FC<AvatarWithBorderProps> = ({ rank = "Đồng", children }) => {
    const avatarRef = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState<number>(0)

    // Get rank config with fallback to default values
    const rankConfig = rankConfigs[rank as Rank] || rankConfigs["Bạc"]
    const { className = "", color = "#cd7f32", icon } = rankConfig

    useLayoutEffect(() => {
        if (!avatarRef.current) return
        const updateSize = () => {
            const rect = avatarRef.current!.getBoundingClientRect()
            setSize(Math.max(rect.width, rect.height))
        }
        updateSize()

        const resizeObserver = new window.ResizeObserver(updateSize)
        resizeObserver.observe(avatarRef.current)
        return () => resizeObserver.disconnect()
    }, [])

    const borderSize = 1
    const totalSize = size + borderSize * 2
    const borderStyle = {
        width: totalSize,
        height: totalSize,
        "--rank-color": color,
    } as React.CSSProperties

    // Replace the complex mathematical calculation with this simpler approach
    const IconComponent = icon ? RankIcons[icon as keyof typeof RankIcons] : null

    // Tính kích thước icon đơn giản hơn - dựa trên kích thước avatar
    const iconSize = Math.min(Math.max(size * 0.25, 14), 20)

    // Tính offset để icon luôn nằm ngoài border
    const offset = borderSize + 2 // 2px thêm để tạo khoảng cách

    const iconStyle = {
        position: "absolute" as const,
        top: -offset,
        right: -offset,
        width: iconSize,
        height: iconSize,
        zIndex: 20,
    }

    // Nếu là Đồng thì không áp dụng className, không style border, không render icon
    if (rank === "Đồng") {
        return (
            <div className="relative flex items-center justify-center rounded-full">
                <div ref={avatarRef} className="relative z-10 rounded-full overflow-hidden">
                    {children}
                </div>
            </div>
        )
    }

    return (
        <div className={clsx("relative flex items-center justify-center rounded-full", className)} style={borderStyle}>
            <div
                className="absolute inset-0 z-10 rounded-full avatar-mask"
                style={{
                    top: borderSize + 1,
                    left: borderSize + 1,
                    right: borderSize + 1,
                    bottom: borderSize + 1,
                    background: "white", // hoặc màu nền bạn muốn
                    pointerEvents: "none",
                }}
            />
            <div ref={avatarRef} className="relative z-20 rounded-full overflow-hidden">
                {children}
            </div>
            {IconComponent && (
                <div style={iconStyle} className="transform rotate-45">
                    <IconComponent
                        size={iconSize}
                        className={clsx("drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]", {
                            "text-[#a7a7ad]": rank === "Bạc",
                            "text-[#ffd700]": rank === "Vàng",
                            "text-[#E5E4E2] drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] stroke-[1.5]": rank === "Bạch Kim",
                            "text-[#00ffff] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]": rank === "Kim Cương",
                        })}
                    />
                </div>
            )}
        </div>
    )
}
