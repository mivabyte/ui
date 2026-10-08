"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    /** Native scrollbars avoid JavaScript-driven thumb position updates. */
    scrollbar?: "custom" | "native"
    /** The scrollable element; the forwarded ref still points to the root. */
    viewportRef?: React.Ref<HTMLDivElement>
  }
>(
  (
    { className, children, scrollbar = "custom", viewportRef, ...props },
    ref
  ) => (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="scroll-area"
      data-scrollbar={scrollbar}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {scrollbar === "native" ? (
        <div
          ref={viewportRef}
          data-slot="scroll-area-viewport"
          tabIndex={0}
          className="h-full w-full overflow-x-hidden overflow-y-auto rounded-[inherit] [scrollbar-color:hsl(var(--border))_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin]"
        >
          {children}
        </div>
      ) : (
        <>
          <ScrollAreaPrimitive.Viewport
            tabIndex={0}
            ref={viewportRef}
            data-slot="scroll-area-viewport"
            className="h-full w-full rounded-[inherit]"
          >
            {children}
          </ScrollAreaPrimitive.Viewport>
          <ScrollBar />
          <ScrollAreaPrimitive.Corner />
        </>
      )}
    </ScrollAreaPrimitive.Root>
  )
)
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
