import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import styles from './index.module.scss';

export default function LucideIcon({
    name,
    size = 18,
    color = 'currentColor',
    className = '',
    spin = false,
}: ICOMPONENTS.LucideIconProps) {
    const IconComponent = Icons[name as keyof typeof Icons] as React.FC<LucideProps>;

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
