'use client';

import React from 'react';
import { cn } from '@helpers/CN';



export default function CircularProgress({
    size = 48,
    strokeWidth = 4,
    value,
    color = 'var(--bg-orange)',
    bgColor = 'var(--bg-progress)',
    direction = 'clockwise',
    className,
    showPercentage = true,
    textColor = '#333',
    fontSize = 14,
    ...props
}: ICOMPONENTS.CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset =
        direction === 'clockwise'
            ? circumference - (value / 100) * circumference
            : (value / 100) * circumference;

    return (
        <div
            className="relative inline-flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <svg
                className={cn(
                    'block',
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

            {showPercentage && (
                <span
                    className="absolute"
                    style={{
                        color: textColor,
                        fontSize,
                        fontWeight: 500,
                    }}
                >
                    {Math.round(value)}%
                </span>
            )}
        </div>
    );
}
