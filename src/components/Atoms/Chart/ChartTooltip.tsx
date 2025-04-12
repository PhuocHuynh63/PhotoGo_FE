import React from 'react';
import { cn } from '@helpers/CN';

const ChartTooltip: React.FC<ICOMPONENTS.ChartTooltipProps> = ({ active, payload, label, className, formatter }) => {
    if (!active || !payload || !payload.length) {
      return null
    }
  
    return (
      <div className={cn("rounded-lg border bg-background p-2 shadow-sm text-sm", className)}>
        <p className="font-medium mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`tooltip-item-${index}`} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground capitalize">{entry.name}: </span>
              <span className="font-medium ml-1">{formatter ? formatter(entry.value, entry.name) : entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default ChartTooltip