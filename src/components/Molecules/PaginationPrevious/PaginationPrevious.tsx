import { ChevronLeft } from "lucide-react"
import { cn } from "@helpers/CN"
import NavigationButton from "@atoms/NavigationButton/NavigationButton"

const PaginationPrevious = ({
    className,
    ...props
}: ICOMPONENTS.NavigationButtonProps) => (
    <NavigationButton
        aria-label="Go to previous page"
        className={cn("gap-1 pl-2.5", className)}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
    </NavigationButton>
)

export default PaginationPrevious
