import React from 'react';
import { cn } from '@helpers/CN';

const ChartLegendItem: React.FC<ICOMPONENTS.ChartLegendItemProps> = ({ color, label, value }) => {
    return (
        <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
            <span className="text-sm text-muted-foreground">{label}</span>
            {value && <span className="text-sm font-medium ml-1">{value}</span>}
        </div>
    )
}

interface ChartLegendProps {
    items: ICOMPONENTS.ChartLegendItemProps[]
    className?: string
}

const ChartLegend: React.FC<ChartLegendProps> = ({ items, className }) => {
    return (
        <div className={cn("flex flex-wrap gap-4 mt-2", className)}>
            {items.map((item, index) => (
                <ChartLegendItem key={index} {...item} />
            ))}
        </div>
    )
}

export default ChartLegend
