"use client"

import type React from "react"
import { useRef, useLayoutEffect, useState } from "react"
import clsx from "clsx"
import { rankConfigs } from "./rankStyles"
import { Crown, Medal, Award, Trophy, Gem } from "lucide-react"

const RankIcons = {
    Crown,
    Medal,
    Award,
    Trophy,
    Gem,
}

interface AvatarWithBorderProps {
    subscription?: unknown;
    children: React.ReactNode;
}

export const AvatarWithBorder: React.FC<AvatarWithBorderProps> = ({ subscription, children }) => {
    const avatarRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<number>(0);

    useLayoutEffect(() => {
        if (!avatarRef.current) return;
        const updateSize = () => {
            const rect = avatarRef.current!.getBoundingClientRect();
            setSize(Math.max(rect.width, rect.height));
        };
        updateSize();

        const resizeObserver = new window.ResizeObserver(updateSize);
        resizeObserver.observe(avatarRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Nếu không có subscription, render giống Đồng (không border, không icon)
    const hasSubscription = !!subscription;
    if (!hasSubscription) {
        return (
            <div className="relative flex items-center justify-center rounded-full">
                <div ref={avatarRef} className="relative z-10 rounded-full overflow-hidden">
                    {children}
                </div>
            </div>
        );
    }

    // Nếu có subscription, render border và icon giống Kim Cương
    const rankConfig = rankConfigs["Kim Cương"];
    const { className = "", color = "#00ffff", icon } = rankConfig;
    const borderSize = 1;
    const totalSize = size + borderSize * 2;
    const borderStyle = {
        width: totalSize,
        height: totalSize,
        "--rank-color": color,
    } as React.CSSProperties;
    const IconComponent = icon ? RankIcons[icon as keyof typeof RankIcons] : null;
    const iconSize = Math.min(Math.max(size * 0.25, 14), 20);
    const offset = borderSize + 2;
    const iconStyle = {
        position: "absolute" as const,
        top: -offset,
        right: -offset,
        width: iconSize,
        height: iconSize,
        zIndex: 20,
    };
    return (
        <div className={clsx("relative flex items-center justify-center rounded-full", className)} style={borderStyle}>
            <div
                className="absolute inset-0 z-10 rounded-full avatar-mask"
                style={{
                    top: borderSize + 1,
                    left: borderSize + 1,
                    right: borderSize + 1,
                    bottom: borderSize + 1,
                    background: "white",
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
                        className={clsx("drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]", "text-[#00ffff] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]")}
                    />
                </div>
            )}
        </div>
    );
};
