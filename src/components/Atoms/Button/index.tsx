import styles from './index.module.scss';

export default function Button(props: ICOMPONENTS.ButtonProps) {
    return (
        <button className=className={`cursor-pointer ${styles.button}` {...props} type={props.type || 'button'}>
            {props.children}
        </button>
    );
}