import styles from './index.module.scss';

export default function Input(props: ICOMPONENTS.InputProps) {
    const { width, height, fontSize, style, className, ...rest } = props;

    return (
        <input
            className={[styles.input, className].filter(Boolean).join(' ')}
            style={{
                width,
                height,
                fontSize,
                ...style,
            }}
            {...rest}
        />
    );
}
