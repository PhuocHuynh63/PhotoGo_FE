'use client'

import React, { forwardRef } from 'react'
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import styles from './index.module.scss'
import avatarStyles from '@/components/Atoms/AvatarImage/index.module.scss'
import fallbackStyles from '@/components/Atoms/AvatarFallback/index.module.scss'


const Avatar = forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    ICOMPONENTS.AvatarProps
>(({ className = '', size = 40, src, alt, fallback, ...props }, ref) => {
    const getInitials = (name?: string) => {
        if (!name) return '?'
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <AvatarPrimitive.Root
            ref={ref}
            className={`${styles.avatar_root} ${className}`}
            style={{ width: size, height: size }}
            {...props}
        >
            {src && (
                <AvatarPrimitive.Image
                    className={avatarStyles.avatar_image}
                    src={src}
                    alt={alt}
                />
            )}
            <AvatarPrimitive.Fallback className={fallbackStyles.avatar_fallback}>
                {fallback || getInitials(alt)}
            </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

export { Avatar }
