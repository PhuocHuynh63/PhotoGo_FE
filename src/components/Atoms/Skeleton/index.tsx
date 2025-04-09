'use client';

import React, { CSSProperties } from 'react';
import { cn } from '@helpers/CN';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    backgroundColor?: string;
    className?: string;
    count?: number;
}

export default function Skeleton({
    width = '100%',
    height = 16,
    borderRadius = 8,
    backgroundColor = 'var(--bg-muted)',
    className,
    style,
    count = 1,
    ...props
}: SkeletonProps) {
    const baseWidth =
        typeof width === 'number' ? width : parseInt(width.toString()) || 100;

    const skeletonStyle = (i: number): CSSProperties => {
        const currentWidth =
            typeof width === 'number'
                ? `${baseWidth + i * 40}px`
                : `calc(${width} + ${i * 40}%)`;

        return {
            width: currentWidth,
            height: typeof height === 'number' ? `${height}px` : height,
            borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
            backgroundColor,
            ...style,
        };
    };

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={cn('animate-pulse mb-2 last:mb-0', className)}
                    style={skeletonStyle(i)}
                    {...props}
                />
            ))}
        </>
    );
}
