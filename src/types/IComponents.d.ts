declare namespace ICOMPONENTS {
    export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
        color?: string;
        width?: string | number;
        height?: string | number;
        icon?: React.ReactNode;
        iconPosition?: 'left' | 'right';
        isLoading?: boolean;
        loadingText?: string;
    }

    export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
        placeholder?: string;
        width?: string | number;
        height?: string | number;
        fontSize?: string | number;
    }

    export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
        htmlFor?: string;
        width?: string | number;
        height?: string | number;
        fontSize?: string | number;
    }

    export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
        width?: string | number;
        height?: string | number;
        fontSize?: string | number;
        label?: string;
        labelClassName?: string;
    }

}
