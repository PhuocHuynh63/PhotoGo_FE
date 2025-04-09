import React from 'react';
import { cn } from '@/helpers/CN';


const styleHelper = ({ width, height, fontSize }: ICOMPONENTS.CardBaseProps): React.CSSProperties => ({
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
});

const Card = React.forwardRef<HTMLDivElement, ICOMPONENTS.CardBaseProps>(
    ({ className, width, height, fontSize, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('rounded-lg border bg-white text-black shadow-md', className)}
            style={styleHelper({ width, height, fontSize })}
            {...props}
        />
    )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, ICOMPONENTS.CardBaseProps>(
    ({ className, width, height, fontSize, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col space-y-1.5 p-6', className)}
            style={styleHelper({ width, height, fontSize })}
            {...props}
        />
    )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, ICOMPONENTS.CardBaseProps>(
    ({ className, width, height, fontSize = 20, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('font-semibold leading-none tracking-tight', className)}
            style={styleHelper({ width, height, fontSize })}
            {...props}
        />
    )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, ICOMPONENTS.CardBaseProps>(
    ({ className, fontSize = 14, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('text-muted-foreground', className)}
            style={styleHelper({ fontSize })}
            {...props}
        />
    )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, ICOMPONENTS.CardBaseProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
    )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, ICOMPONENTS.CardBaseProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
    )
);
CardFooter.displayName = 'CardFooter';

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
};
