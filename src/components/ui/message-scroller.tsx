import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "./scroll-area"

type MessageScrollerProps = React.ComponentProps<typeof ScrollArea>

export function MessageScroller({
  className,
  scrollbar = "native",
  ...props
}: MessageScrollerProps) {
  return (
    <ScrollArea
      scrollbar={scrollbar}
      className={cn(
        "h-[500px] w-full overflow-hidden rounded-md border",
        className
      )}
      {...props}
    />
  )
}
