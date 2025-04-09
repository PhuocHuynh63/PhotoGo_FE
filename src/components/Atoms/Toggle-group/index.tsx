'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '@helpers/CN';

type Variant = 'default' | 'outline';
type Size = 'default' | 'sm' | 'lg';

interface ToggleGroupContextProps {
    variant?: Variant;
    size?: Size;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextProps>({
    variant: 'default',
    size: 'default',
});

interface ToggleGroupBaseProps {
    variant?: Variant;
    size?: Size;
    className?: string;
    children?: React.ReactNode;
}

type ToggleGroupSingleProps = ToggleGroupBaseProps & {
    type: 'single';
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
};

type ToggleGroupMultipleProps = ToggleGroupBaseProps & {
    type?: 'multiple'; // default to multiple
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
};

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

const ToggleGroup = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Root>,
    ToggleGroupProps
>((props, ref) => {
    const { variant = 'default', size = 'default', className, children } = props;

    return (
        <ToggleGroupContext.Provider value={{ variant, size }}>
            <ToggleGroupPrimitive.Root
                ref={ref}
                // Conditionally apply type, value, defaultValue, onValueChange
                {...(props.type === 'single'
                    ? {
                        type: 'single' as const,
                        value: props.value,
                        defaultValue: props.defaultValue,
                        onValueChange: props.onValueChange,
                    }
                    : {
                        type: 'multiple' as const,
                        value: props.value,
                        defaultValue: props.defaultValue,
                        onValueChange: props.onValueChange,
                    })}
                className={cn('flex items-center justify-center gap-1', className)}
            >
                {children}
            </ToggleGroupPrimitive.Root>
        </ToggleGroupContext.Provider>
    );
});

ToggleGroup.displayName = 'ToggleGroup';

const ToggleGroupItem = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
    const { variant = 'default', size = 'default' } = React.useContext(ToggleGroupContext);

    const sizeClasses = {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
    };

    const variantClasses = {
        default: 'border border-transparent hover:bg-gray-100',
        outline: 'border border-gray-300 hover:bg-gray-100',
    };

    return (
        <ToggleGroupPrimitive.Item
            ref={ref}
            className={cn(
                'rounded-md font-medium transition-colors',
                sizeClasses[size],
                variantClasses[variant],
                'data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:border-orange-500',
                className
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    );
});

ToggleGroupItem.displayName = 'ToggleGroupItem';


export { ToggleGroup, ToggleGroupItem };
