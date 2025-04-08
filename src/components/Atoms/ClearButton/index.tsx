import React from 'react';
import styles from './index.module.scss';
import LucideIcon from '@/components/Atoms/LucideIcon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    width?: string | number;
    height?: string | number;
    icon?: keyof typeof import('lucide-react');
    iconPosition?: 'left' | 'right';
    iconSize?: number;
    iconColor?: string;
    isLoading?: boolean;
    loadingText?: string;
    spinIcon?: boolean;
}

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
}: ButtonProps) {
    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    const shouldSpin = isLoading || spinIcon;

    const renderIcon = icon && !isLoading && (
        <LucideIcon name={icon} size={iconSize} color={iconColor} spin={shouldSpin} />
    );

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
