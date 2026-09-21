import * as React from "react"
import { cn } from "@/lib/utils"

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: Date | string
}

export function Message({ className, date, children, ...props }: MessageProps) {
  return (
    <div className={cn("group relative flex py-3", className)} {...props}>
      {children}
      {date && (
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  )
}
