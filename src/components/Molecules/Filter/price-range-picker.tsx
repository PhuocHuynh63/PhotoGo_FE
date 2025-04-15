"use client"

import { RangeSlider } from "@atoms/Slider/range-slider"

interface PriceRangeSliderProps {
    value: [number, number]
    onChange: (value: [number, number]) => void
    min?: number
    max?: number
    step?: number
    formatValue?: (value: number) => string
}

export function PriceRangeSlider({
    value,
    onChange,
    min = 0,
    max = 10000000,
    step = 100000,
    formatValue = (val) => new Intl.NumberFormat("vi-VN").format(val) + "đ",
}: PriceRangeSliderProps) {
    return (
        <div className="pt-6 px-2">
            <RangeSlider
                defaultValue={[min, max]}
                max={max}
                min={min}
                step={step}
                value={value}
                onValueChange={(val) => onChange(val as [number, number])}
            />
            <div className="flex justify-between mt-2 text-sm">
                <span>{formatValue(value[0])}</span>
                <span>{formatValue(value[1])}</span>
            </div>
        </div>
    )
}
