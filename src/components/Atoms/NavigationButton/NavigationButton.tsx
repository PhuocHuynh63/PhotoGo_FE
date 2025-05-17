import * as React from "react"
import { cn } from "@helpers/CN"

const NavigationButton = ({
    className,
    disabled,
    ...props
}: ICOMPONENTS.NavigationButtonProps) => (
    <a
        className={cn(
            "px-3 py-2 rounded-md transition-colors hover:bg-gray-100 flex items-center cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
            className
        )}
        aria-disabled={disabled}
        {...props}
    />
)

export default NavigationButton
