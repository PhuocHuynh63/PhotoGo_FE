import styles from './index.module.scss';

export default function Label(props: ICOMPONENTS.LabelProps) {
    const { htmlFor, className, children, width, height, fontSize, style, ...rest } = props;

    return (
        <label
            htmlFor={htmlFor}
            className={`${styles.label} ${className ?? ''}`}
            style={{
                width,
                height,
                fontSize,
                ...style,
            }}
            {...rest}
        >
            {children}
        </label>
    );
}
