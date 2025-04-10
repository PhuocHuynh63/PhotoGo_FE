import * as React from "react"
import { cn } from "@helpers/CN"

const PaginationLink = ({
    className,
    isActive,
    ...props
}: ICOMPONENTS.PaginationLinkProps) => (
    <a
        aria-current={isActive ? "page" : undefined}
        className={cn(
            "px-3 py-2 rounded-md transition-colors",
            isActive
                ? "border bg-orange text-light pointer-events-none"
                : "hover:bg-gray-100 hover:text-gray-900 cursor-pointer",
            className
        )}
        {...props}
    />
)

export default PaginationLink
