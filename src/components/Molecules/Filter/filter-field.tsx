import type { ReactNode } from "react"
import { Label } from "@atoms/Label/Label"
import { cn } from "@helpers/CN"

interface FilterFieldProps {
  label: string
  children: ReactNode
  className?: string
}

export function FilterField({ label, children, className }: FilterFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  )
}
