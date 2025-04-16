"use client"

import { Button } from "@atoms/Button/Button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@atoms/DropdownMenu"
import { MoreHorizontal } from "lucide-react"
import type { ReactNode } from "react"

export interface ActionItem {
    label: string
    icon?: ReactNode
    onClick: () => void
    className?: string
    disabled?: boolean
}

interface ActionDropdownProps {
    actions: ActionItem[]
    buttonClassName?: string
}

export function ActionDropdown({ actions, buttonClassName }: ActionDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={buttonClassName ?? "h-8 w-8 p-0"}>
                    <span className="sr-only">Mở menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={action.onClick}
                        className={action.className}
                        disabled={action.disabled}
                    >
                        {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}