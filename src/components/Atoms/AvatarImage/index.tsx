'use client'

import React, { forwardRef } from 'react'
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import styles from './index.module.scss'

const AvatarImage = forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    ICOMPONENTS.AvatarImageProps
>(({ className = '', ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={`${styles.avatar_image} ${className}`}
        {...props}
    />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

export default AvatarImage 