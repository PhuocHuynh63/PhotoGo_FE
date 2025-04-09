'use client';

import React, { CSSProperties } from 'react';
import { cn } from '@/helpers/CN';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    backgroundColor?: string;
    className?: string;
}

export default function Skeleton({
    width = '100%',
    height = 16,
    borderRadius = 8,
    backgroundColor = 'var(--bg-muted)',
    className,
    style,
    ...props
}: SkeletonProps) {
    const skeletonStyle: CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        backgroundColor,
        ...style,
    };

    return (
        <div
            className={cn('animate-pulse', className)}
            style={skeletonStyle}
            {...props}
        />
    );
}
