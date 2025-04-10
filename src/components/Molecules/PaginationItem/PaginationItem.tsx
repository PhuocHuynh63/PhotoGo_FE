import * as React from "react"
import { cn } from "@helpers/CN"

const PaginationItem = React.forwardRef<HTMLLIElement, ICOMPONENTS.PaginationItemProps>(
    ({ className, ...props }, ref) => (
        <li ref={ref} className={cn("", className)} {...props} />
    )
)

PaginationItem.displayName = "PaginationItem"
export default PaginationItem
