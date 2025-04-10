import * as React from "react"
import { cn } from "@helpers/CN"

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("bg-gray-50 [&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

export default TableHeader
