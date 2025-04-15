"use client";

import * as Slider from "@radix-ui/react-slider";

interface PriceRangeSliderProps {
    min?: number;
    max?: number;
    step?: number;
    value: [number, number];
    onValueChange?: (value: [number, number]) => void;
}

export default function PriceRangeSlider({
    min = 0,
    max = 10000000,
    step = 100000,
    value,
    onValueChange,
}: PriceRangeSliderProps) {

    const handleChange = (value: number[]) => {
        const newRange: [number, number] = [value[0], value[1]];
        onValueChange?.(newRange);
    };

    return (
        <div className="w-full max-w-md px-4">
            <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                min={min}
                max={max}
                step={step}
                value={value}
                onValueChange={handleChange}
            >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
                    <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                    <div className="flex items-center justify-center mt-2 text-sm font-medium text-gray-700">
                        {value[0].toLocaleString()} đ - {value[1].toLocaleString()} đ
                    </div>
                </Slider.Track>
                <Slider.Thumb
                    className="block w-5 h-5 bg-white border border-blue-500 rounded-full shadow hover:bg-blue-100 focus:outline-none"
                    aria-label="Minimum price"
                />
                <Slider.Thumb
                    className="block w-5 h-5 bg-white border border-blue-500 rounded-full shadow hover:bg-blue-100 focus:outline-none"
                    aria-label="Maximum price"
                />
            </Slider.Root>
        </div>
    );
}
