import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      className={cn(
        "ui-control flex w-full rounded-md border border-input bg-surface shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}
