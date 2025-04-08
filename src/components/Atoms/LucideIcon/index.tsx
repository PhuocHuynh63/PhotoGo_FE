import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import React from 'react';
import styles from './index.module.scss';

interface LucideIconProps {
    name: keyof typeof Icons;
    size?: number;
    color?: string;
    className?: string;
    spin?: boolean;
}

export default function LucideIcon({
    name,
    size = 18,
    color = 'currentColor',
    className = '',
    spin = false,
}: LucideIconProps) {
    const IconComponent = Icons[name] as React.FC<LucideProps>;

    if (!IconComponent) {
        console.warn(`Lucide icon "${name}" not found.`);
        return null;
    }

    const combinedClass = `${className} ${spin ? styles['lucide-spin'] : ''}`.trim();

    return (
        <IconComponent
            size={size}
            color={color}
            className={combinedClass}
        />
    );
}
