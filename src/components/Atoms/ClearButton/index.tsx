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
    const style = useMemo(() => ({
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    }), [width, height]);

    const shouldSpin = useMemo(() => isLoading || spinIcon, [isLoading, spinIcon]);

    const renderIcon = useMemo(() => (
        icon && !isLoading && (
            <LucideIcon name={icon} size={iconSize} color={iconColor} spin={shouldSpin} />
        )
    ), [icon, isLoading, iconSize, iconColor, shouldSpin]);

    return (
        <button
            className={styles.clear_button}
            style={style}
            disabled={isLoading || rest.disabled}
            {...rest}
        >
            {isLoading ? (
                <>
                    <LucideIcon name="Loader" size={iconSize} spin />
                    <span className={styles.loadingText}>{loadingText}</span>
                </>
            ) : (
                <>
                    {iconPosition === 'left' && renderIcon}
                    <span>{children}</span>
                    {iconPosition === 'right' && renderIcon}
                </>
            )}
        </button>
    );
}