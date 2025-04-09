'use client';

import React from 'react';
import { cn } from '@/helpers/CN';

interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    strokeWidth?: number;
    value: number; // 0-100
    color?: string;
    bgColor?: string;
    direction?: 'clockwise' | 'counter-clockwise'; // thêm props
}

export default function CircularProgress({
    size = 48,
    strokeWidth = 4,
    value,
    color = 'var(--bg-orange)',
    bgColor = 'var(--bg-progress)',
    direction = 'clockwise',
    className,
    ...props
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset =
        direction === 'clockwise'
            ? circumference - (value / 100) * circumference
            : (value / 100) * circumference;

    return (
        <svg
            className={cn(
                direction === 'clockwise' ? 'rotate-[-90deg]' : 'rotate-[90deg]',
                className
            )}
            width={size}
            height={size}
            {...props}
        >
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={bgColor}
                strokeWidth={strokeWidth}
                fill="none"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                fill="none"
                strokeLinecap="round"
                style={{
                    transition: 'stroke-dashoffset 0.35s',
                    transform: direction === 'counter-clockwise' ? 'scale(-1, 1)' : undefined,
                    transformOrigin: 'center',
                }}
            />
        </svg>
    );
}
