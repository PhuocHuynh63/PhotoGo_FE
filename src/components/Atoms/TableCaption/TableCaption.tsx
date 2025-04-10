import * as React from "react"
import { cn } from "@helpers/CN"

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-gray-600", className)}
        {...props}
    />
))
TableCaption.displayName = "TableCaption"

export default TableCaption
