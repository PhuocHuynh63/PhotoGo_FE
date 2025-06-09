'use client';

import React, { useMemo } from 'react';
import styles from './index.module.scss';
import LucideIcon from '@/components/Atoms/LucideIcon';

export default React.forwardRef<HTMLButtonElement, ICOMPONENTS.ButtonProps>(function Button(
    {
        children,
        width,
        height,
        icon,
        iconPosition = 'left',
        iconSize = 18,
        iconColor = 'currentColor',
        isLoading = false,
        loadingText = 'Đang xử lý...',
        spinIcon = false,
        disabled = false,
        className = '',
        onClick,
        ...rest
    }: ICOMPONENTS.ButtonProps,
    ref
) {
    const { ...buttonProps } = rest;

    const { style, showIcon, loadingIndicator } = useMemo(() => {
        const computedStyle: React.CSSProperties = {
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
        };

        const computedShowIcon = !isLoading && icon ? (
            <LucideIcon
                name={icon}
                iconSize={iconSize}
                iconColor={iconColor}
                spin={spinIcon}
            />
        ) : null;

        const computedLoadingIndicator = isLoading ? (
            <>
                <LucideIcon name="Loader" spin iconSize={iconSize} />
                <span className={styles.loadingText}>{loadingText}</span>
            </>
        ) : null;

        return { style: computedStyle, showIcon: computedShowIcon, loadingIndicator: computedLoadingIndicator };
    }, [width, height, icon, iconSize, iconColor, spinIcon, isLoading, loadingText]);

    return (
        <button
            ref={ref}
            className={`${styles.button} ${className} `}
            style={style}
            onClick={disabled ? undefined : onClick}
            disabled={isLoading || disabled}
            {...buttonProps}
        >
            {isLoading ? (
                loadingIndicator
            ) : (
                <>
                    {iconPosition === 'left' && showIcon}
                    {children}
                    {iconPosition === 'right' && showIcon}
                </>
            )}
        </button>
    );
});