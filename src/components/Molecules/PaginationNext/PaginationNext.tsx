import { ChevronRight } from "lucide-react"
import { cn } from "@helpers/CN"
import NavigationButton from "@atoms/NavigationButton/NavigationButton"

const PaginationNext = ({
    className,
    ...props
}: ICOMPONENTS.NavigationButtonProps) => (
    <NavigationButton
        aria-label="Go to next page"
        className={cn("gap-1 pr-2.5", className)}
        {...props}
    >
        <ChevronRight className="h-4 w-4" />
    </NavigationButton>
)

export default PaginationNext
