'use client';

import * as React from "react"
import { cn } from "@helpers/CN"

import PaginationItem from "@molecules/PaginationItem/PaginationItem"
import PaginationLink from "@atoms/PaginationLink/PaginationLink"
import PaginationEllipsis from "@atoms/PaginationEllipsis/PaginationEllipsis"
import PaginationPrevious from "@molecules/PaginationPrevious/PaginationPrevious"
import PaginationNext from "@molecules/PaginationNext/PaginationNext"

const Pagination = ({ className, total, current, onChange }: ICOMPONENTS.PaginationProps) => {
    const handlePageChange = (page: number) => {
        if (page !== current) {
            onChange(page)
        }
    }

    const renderPageNumbers = () => {
        const siblings = 1
        const dots = <PaginationItem><PaginationEllipsis /></PaginationItem>
        const items: React.ReactElement[] = []

        items.push(
            <PaginationItem key={1}>
                <PaginationLink isActive={1 === current} onClick={() => handlePageChange(1)}>
                    1
                </PaginationLink>
            </PaginationItem>
        )

        const leftSibling = Math.max(current - siblings, 2)
        const rightSibling = Math.min(current + siblings, total - 1)

        if (leftSibling > 2) {
            items.push(React.cloneElement(dots, { key: 'dots-1' }))
        }

        for (let i = leftSibling; i <= rightSibling; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink isActive={i === current} onClick={() => handlePageChange(i)}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        if (rightSibling < total - 1) {
            items.push(React.cloneElement(dots, { key: 'dots-2' }))
        }

        if (total > 1) {
            items.push(
                <PaginationItem key={total}>
                    <PaginationLink isActive={total === current} onClick={() => handlePageChange(total)}>
                        {total}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        return items
    }

    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
        >
            <ul className="flex flex-row items-center gap-1">
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, current - 1))}
                        disabled={current === 1}
                    />
                </PaginationItem>
                {renderPageNumbers()}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => handlePageChange(Math.min(total, current + 1))}
                        disabled={current === total}
                    />
                </PaginationItem>
            </ul>
        </nav>
    )
}

export default Pagination
