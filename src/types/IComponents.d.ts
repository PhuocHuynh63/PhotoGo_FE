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
        options?: string[]
    }

    export interface LucideIconProps {
        name: keyof typeof import('lucide-react');
        size?: number;
        color?: string;
        className?: string;
        spin?: boolean;
    }

    export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
        width?: string | number;
        height?: string | number;
        fontSize?: string | number;
        placeholder?: string;
        resize?: "none" | "horizontal" | "vertical" | "both";
        maxLength?: number;
        minLength?: number;
    }

    interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
        label: string;
        checked: boolean;
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    }

    interface RadioButtonGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
        name: string;
        options: { label: string; value: string }[];
        value: string;
        onChange: (value: string) => void;
    }

    interface CardBaseProps extends React.HTMLAttributes<HTMLDivElement> {
        width?: string | number;
        height?: string | number;
        fontSize?: string | number;
    }

}
