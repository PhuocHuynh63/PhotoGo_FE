import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@helpers/CN"

const PaginationEllipsis = ({
    className,
    ...props
}: ICOMPONENTS.PaginationEllipsisProps) => (
    <span
        aria-hidden
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
)

export default PaginationEllipsis
