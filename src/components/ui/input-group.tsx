import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      className={cn(
        "flex w-full rounded-md border border-input bg-background shadow-sm",
        className
      )}
      {...props}
    />
  )
}
