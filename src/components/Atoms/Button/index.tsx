import React, { useMemo } from 'react';
import styles from './index.module.scss';
import LucideIcon from '@/components/Atoms/LucideIcon';

export default function Button({
    children,
    width,
    height,
    icon,
    iconPosition = 'left',
    iconSize = 18,
    iconColor = 'currentColor',
    isLoading = false,
    loadingText = 'Loading...',
    spinIcon = false,
    ...rest
}: ICOMPONENTS.ButtonProps) {
    const style = useMemo<React.CSSProperties>(() => ({
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    }), [width, height]);

    const showIcon = useMemo(() => {
        if (!icon || isLoading) return null;

        return (
            <LucideIcon
                name={icon}
                size={iconSize}
                color={iconColor}
                spin={spinIcon}
            />
        );
    }, [icon, iconSize, iconColor, spinIcon, isLoading]);

    const loadingIndicator = useMemo(() => (
        <>
            <LucideIcon name="Loader" spin size={iconSize} />
            <span className={styles.loadingText}>{loadingText}</span>
        </>
    ), [iconSize, loadingText]);

    return (
        <button
            className={styles.button}
            style={style}
            disabled={isLoading || rest.disabled}
            {...rest}
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
}
