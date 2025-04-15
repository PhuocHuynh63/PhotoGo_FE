"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@helpers/CN"

interface RangeSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    className?: string
}

export const RangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, RangeSliderProps>(
    ({ className, ...props }, ref) => (
        <SliderPrimitive.Root
            ref={ref}
            className={cn("relative flex w-full touch-none select-none items-center", className)}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-100">
                <SliderPrimitive.Range className="absolute h-full bg-slate-900" />
            </SliderPrimitive.Track>
            {props.value &&
                Array.isArray(props.value) &&
                props.value.map((_, index) => (
                    <SliderPrimitive.Thumb
                        key={index}
                        className="block h-5 w-5 rounded-full border border-slate-200 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    />
                ))}
        </SliderPrimitive.Root>
    ),
)

RangeSlider.displayName = SliderPrimitive.Root.displayName
