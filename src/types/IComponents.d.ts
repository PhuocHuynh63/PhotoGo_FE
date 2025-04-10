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
        icon?: keyof typeof import('lucide-react');
        iconPosition?: 'left' | 'right';
        iconSize?: number;
        iconColor?: string;
        togglePassword?: boolean;
        leftIconColor?: string;
        rightIconColor?: string;
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

    interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
        size?: number;
        strokeWidth?: number;
        value: number;
        color?: string;
        bgColor?: string;
        direction?: 'clockwise' | 'counter-clockwise';
        showPercentage?: boolean;
        textColor?: string;
        fontSize?: number;
    }

    interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
        value: number;
        width?: string | number;
        height?: string | number;
        backgroundColor?: string;
        color?: string;
        className?: string;
    }

    interface SkeletonProps {
        width?: string | number;
        height?: string | number;
        borderRadius?: string | number;
        backgroundColor?: string;
        className?: string;
        count?: number;
        animated?: boolean;
    }

    interface TransitionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
        children: React.ReactNode;
        initial?: MotionProps["initial"]; // Tùy chỉnh trạng thái ban đầu
        animate?: MotionProps["animate"]; // Tùy chỉnh trạng thái khi hiển thị
        exit?: MotionProps["exit"]; // Tùy chỉnh trạng thái khi thoát
        transition?: MotionProps["transition"]; // Tùy chỉnh thời gian và kiểu hiệu ứng
        mode?: "sync" | "wait" | "popLayout"; // Tùy chỉnh mode của AnimatePresence
    }
}
