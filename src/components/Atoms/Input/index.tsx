import styles from './index.module.scss';

export default function Input(props: ICOMPONENTS.InputProps) {
    const { width, height, fontSize, style, ...rest } = props;

    return (
        <input
            className={`${styles.input} `}
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
