"use client";

import * as Slider from "@radix-ui/react-slider";

interface DurationRangeSliderProps {
    min?: number; // Thời gian tối thiểu (phút)
    max?: number; // Thời gian tối đa (phút)
    step?: number; // Bước nhảy (phút)
    value: [number, number]; // Giá trị hiện tại (phút)
    onValueChange?: (value: [number, number]) => void; // Hàm callback khi giá trị thay đổi
}

export default function DurationRangeSlider({
    min = 0,
    max = 1440, // 24 giờ = 1440 phút
    step = 60, // Bước nhảy 60 phút
    value,
    onValueChange,
}: DurationRangeSliderProps) {

    const handleChange = (value: number[]) => {
        const newRange: [number, number] = [value[0], value[1]];
        onValueChange?.(newRange);
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} giờ ${mins} phút`;
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
                    <Slider.Range className="absolute bg-primary rounded-full h-full" />
                    <div className="flex items-center justify-center mt-4 text-sm font-medium text-gray-700">
                        {formatDuration(value[0])} - {formatDuration(value[1])}
                    </div>
                </Slider.Track>
                <Slider.Thumb
                    className="block w-5 h-5 bg-white border border-blue-500 rounded-full shadow hover:bg-blue-100 focus:outline-none"
                    aria-label="Thời gian tối thiểu"
                />
                <Slider.Thumb
                    className="block w-5 h-5 bg-white border border-blue-500 rounded-full shadow hover:bg-blue-100 focus:outline-none"
                    aria-label="Thời gian tối đa"
                />
            </Slider.Root>
        </div>
    );
}