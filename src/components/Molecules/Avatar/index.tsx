'use client'

import React, { forwardRef } from 'react'
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import styles from './index.module.scss'
import avatarStyles from '@/components/Atoms/AvatarImage/index.module.scss'
import fallbackStyles from '@/components/Atoms/AvatarFallback/index.module.scss'
import AvatarFallback from '@components/Atoms/AvatarFallback'
import AvatarImage from '@components/Atoms/AvatarImage'
import { RankFrame } from '@components/Atoms/AvatarFrame/AvatarFrame'


type UserRank = "unranked" | "bronze" | "silver" | "gold"

interface AvatarProps extends ICOMPONENTS.AvatarProps {
    rank?: UserRank
    showRankLabel?: boolean
    rankSize?: "sm" | "md" | "lg"
    onClick?: () => void
}

const Avatar = forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    AvatarProps
>(({
    className = '',
    size = 40,
    src,
    alt = '',
    fallback,
    rank,
    showRankLabel = true,
    rankSize = "md",
    ...props
}, ref) => {
    const getInitials = (name?: string) => {
        if (!name) return '?'
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 3)
    }

    const avatarContent = (
        <AvatarPrimitive.Root
            ref={ref}
            className={`${styles.avatar_root} ${className}`}
            style={{ width: size, height: size}}
            {...props}
        >
            <AvatarImage
                className={avatarStyles.avatar_image}
                src={src || ''}
                alt={alt}
            />
            <AvatarFallback className={fallbackStyles.avatar_fallback}>
                {fallback || getInitials(alt)}
            </AvatarFallback>
        </AvatarPrimitive.Root>
    )

    if (rank) {
        return (
            <RankFrame
                rank={rank}
                showLabel={showRankLabel}
                size={rankSize}
                className={className}
                onClick={props.onClick}
            >
                {avatarContent}
            </RankFrame>
        )
    }

    return avatarContent
})
Avatar.displayName = AvatarPrimitive.Root.displayName

export { Avatar }
