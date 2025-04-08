import styles from './index.module.scss';

export default function Select(props: ICOMPONENTS.SelectProps) {
    const {
        width,
        height,
        fontSize,
        style,
        className,
        label,
        labelClassName,
        children,
        ...rest
    } = props;

    const selectStyle: React.CSSProperties = {
        width,
        height,
        fontSize,
        ...style,
    };

    return (
        <div className={styles.selectWrapper}>
            {label && (
                <label className={`${styles.label} ${labelClassName ?? ''}`}>
                    {label}
                </label>
            )}
            <select
                className={`${styles.select} ${className ?? ''}`}
                style={selectStyle}
                {...rest}
            >
                {children}
            </select>
        </div>
    );
}
