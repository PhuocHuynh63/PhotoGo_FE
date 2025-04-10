declare namespace ICOMPONENTS {
    // Common base props for reusable styles
    interface BaseProps {
        width?: string | number;
        height?: string | number;
        fontSize?: string | number;
    }

    // Icon-related props
    interface IconProps {
        icon?: keyof typeof import('lucide-react');
        iconSize?: number;
        iconColor?: string;
    }

    export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, BaseProps, IconProps {
        iconPosition?: 'left' | 'right';
        isLoading?: boolean;
        loadingText?: string;
        spinIcon?: boolean;
    }

    export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseProps, IconProps {
        placeholder?: string;
        togglePassword?: boolean;
        leftIconColor?: string;
        rightIconColor?: string;
    }

    export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, BaseProps {
        htmlFor?: string;
    }

    export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseProps {
        label?: string;
        labelClassName?: string;
        options?: string[];
    }

    export interface LucideIconProps extends IconProps {
        name: keyof typeof import('lucide-react');
        className?: string;
        spin?: boolean;
    }

    export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {
        placeholder?: string;
        resize?: "none" | "horizontal" | "vertical" | "both";
        maxLength?: number;
        minLength?: number;
    }

    export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
        label: string;
        checked: boolean;
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    }

    export interface RadioButtonGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
        name: string;
        options: { label: string; value: string }[];
        value: string;
        onChange: (value: string) => void;
    }

    export interface CardBaseProps extends React.HTMLAttributes<HTMLDivElement>, BaseProps {}

    export interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
        size?: number;
        strokeWidth?: number;
        value: number;
        color?: string;
        bgColor?: string;
        direction?: 'clockwise' | 'counter-clockwise';
        showPercentage?: boolean;
        textColor?: string;
    }

    export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, BaseProps {
        value: number;
        backgroundColor?: string;
        color?: string;
        className?: string;
    }

    export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, BaseProps {
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
