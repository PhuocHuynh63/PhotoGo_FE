'use client'

import React, { forwardRef } from 'react'
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import styles from './index.module.scss'

const AvatarFallback = forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    ICOMPONENTS.AvatarFallbackProps
>(({ className = '', ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={`${styles.avatar_fallback} ${className}`}
        {...props}
    />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export default AvatarFallback