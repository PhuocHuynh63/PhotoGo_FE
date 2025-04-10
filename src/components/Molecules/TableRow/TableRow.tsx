import * as React from "react"
import { cn } from "@helpers/CN"

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100",
            className
        )}
        {...props}
    />
))
TableRow.displayName = "TableRow"

export default TableRow
