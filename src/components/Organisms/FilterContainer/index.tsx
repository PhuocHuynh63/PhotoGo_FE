"use client"

import { type ReactNode, useState } from "react"
import { Button } from "@atoms/Button/Button"
import { Accordion, AccordionContent, AccordionItem } from "@atoms/Accordion"
import { Search, X } from "lucide-react"

interface FilterContainerProps {
    children: ReactNode
    advancedFilters?: ReactNode
    onApply?: () => void
    onReset?: () => void
    className?: string
}

export function FilterContainer({ children, advancedFilters, onApply, onReset, className = "" }: FilterContainerProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className={`bg-card border rounded-lg p-4 shadow-sm ${className}`}>
            <div className="flex items-center flex-wrap gap-4 mb-4">
                {children}

                {advancedFilters && (
                    <div className="flex gap-2 ml-auto">
                        <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
                            Bộ lọc nâng cao
                        </Button>
                    </div>
                )}
            </div>

            {advancedFilters && (
                <Accordion type="single" collapsible value={isExpanded ? "filters" : ""}>
                    <AccordionItem value="filters" className="border-0">
                        <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">{advancedFilters}</div>

                            <div className="flex justify-end mt-4 gap-2">
                                <Button variant="outline" onClick={onReset}>
                                    <X className="h-4 w-4 mr-2" />
                                    Xóa bộ lọc
                                </Button>
                                <Button onClick={onApply}>
                                    <Search className="h-4 w-4 mr-2" />
                                    Áp dụng
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    )
}
