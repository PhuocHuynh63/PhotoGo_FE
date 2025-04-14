'use client'

import React from 'react';
import ButtonNoBackground from '@components/Atoms/ButtonNoBackground';

export default function ButtonNoBackgroundVendorDetail({
    children,
    style,
    iconSize = 18,
    iconColor = 'currentColor',
    isLoading = false,
    loadingText = 'Loading...',
    spinIcon = false,
    disabled = false,
    className = '',
    ...rest
}: ICOMPONENTS.ButtonProps) {

    return (
        <ButtonNoBackground className={`flex items-center gap-1 border px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50 transition-colors ${className}`}
            style={{ boxShadow: 'none', ...style }} disabled={disabled} {...rest}>
            {children}
        </ButtonNoBackground>
    );
}