import React from 'react';
import { cn } from '@helpers/CN';


const ChartContainer: React.FC<ICOMPONENTS.ChartContainerProps> = ({ children, className, ...props }) => {
    return (
        <div className={cn("w-full overflow-hidden", className)} {...props}>
            <div className="w-full overflow-auto">{children}</div>
        </div>
    )
}

export default ChartContainer