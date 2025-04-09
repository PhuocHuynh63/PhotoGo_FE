'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@helpers/CN';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    value: number;
    width?: string | number;
    height?: string | number;
    backgroundColor?: string; // var(--bg-orange)
    color?: string;  // var(--bg-indicator)
    className?: string;
}

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressProps
>(
    (
        {
            className,
            value,
            width = '100%',
            height = 16,
            backgroundColor = 'var(--bg-progress)',
            color = 'var(--bg-orange)',
            ...props
        },
        ref
    ) => {
        const rootStyle: React.CSSProperties = {
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            backgroundColor,
        };

        const indicatorStyle: React.CSSProperties = {
            transform: `translateX(-${100 - (value || 0)}%)`,
            backgroundColor: color,
        };

        return (
            <ProgressPrimitive.Root
                ref={ref}
                className={cn('relative overflow-hidden rounded-full', className)}
                style={rootStyle}
                {...props}
            >
                <ProgressPrimitive.Indicator
                    className="h-full transition-all"
                    style={indicatorStyle}
                />
            </ProgressPrimitive.Root>
        );
    }
);
Progress.displayName = 'Progress';

export { Progress };
