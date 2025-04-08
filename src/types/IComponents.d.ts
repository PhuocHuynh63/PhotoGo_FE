declare namespace ICOMPONENTS {
    export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

    export interface LucideIconProps {
        name: keyof typeof import('lucide-react');
        size?: number;
        color?: string;
        className?: string;
        spin?: boolean;
    }

}
