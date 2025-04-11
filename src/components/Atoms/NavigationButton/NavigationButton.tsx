import * as React from "react"
import { cn } from "@helpers/CN"

const NavigationButton = ({
    className,
    ...props
}: ICOMPONENTS.NavigationButtonProps) => (
    <a
        className={cn(
            "px-3 py-2 rounded-md transition-colors hover:bg-gray-100 flex items-center cursor-pointer",
            className
        )}
        {...props}
    />
)

export default NavigationButton
