import { useState, useMemo } from 'react';
import styles from './index.module.scss';
import LucideIcon from '@/components/Atoms/LucideIcon';

export default function Input(props: ICOMPONENTS.InputProps) {
    const {
        width,
        height,
        fontSize,
        style,
        className,
        icon, // left icon
        iconSize = 18,
        iconColor = 'currentColor',
        togglePassword = false,
        ...rest
    } = props;

    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = rest.type === 'password';

    const inputType = useMemo(() => {
        if (togglePassword && isPasswordType) {
            return showPassword ? 'text' : 'password';
        }
        return rest.type;
    }, [togglePassword, isPasswordType, showPassword, rest.type]);

    return (
        <div
            className={`${styles.inputWrapper} ${className ?? ''}`}
            style={{ width, height, fontSize, ...style }}
        >
            {icon && (
                <LucideIcon
                    name={icon}
                    size={iconSize}
                    color={props.leftIconColor || iconColor}
                    className={`${styles.icon} ${styles.leftIcon}`}
                />
            )}

            <input
                {...rest}
                type={inputType}
                className={styles.input}
                style={{
                    paddingLeft: icon ? '40px' : undefined,
                    paddingRight: togglePassword ? '40px' : undefined,
                }}
            />

            {togglePassword && isPasswordType && (
                <div
                    className={`${styles.iconButton} ${styles.rightIcon}`}
                    onClick={() => setShowPassword(prev => !prev)}
                >
                    <LucideIcon
                        name={showPassword ? 'EyeOff' : 'Eye'}
                        size={iconSize}
                        color={props.rightIconColor || iconColor}
                    />
                </div>
            )}
        </div>
    );
}
