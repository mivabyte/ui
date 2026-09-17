import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const containerVariants = cva("mx-auto w-full min-w-0", {
  variants: {
    size: {
      standard: "max-w-[var(--content-width)]",
      reading: "max-w-[var(--reading-width)]",
      wide: "max-w-[var(--wide-width)]",
    },
    gutter: {
      true: "px-[var(--page-gutter)]",
      false: null,
    },
  },
  defaultVariants: {
    size: "standard",
    gutter: true,
  },
})

export interface ContainerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, gutter, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(containerVariants({ size, gutter, className }))}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

export { Container, containerVariants }
