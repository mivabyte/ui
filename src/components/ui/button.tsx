import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "ui-button ui-focus inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-surface hover:bg-primary-hover",
        primary:
          "bg-primary text-primary-foreground shadow-surface hover:bg-primary-hover",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-surface shadow-surface hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-surface hover:bg-surface-interactive",
        accent:
          "bg-accent-muted text-accent-foreground hover:bg-accent shadow-surface",
        subtle: "bg-accent text-accent-foreground hover:bg-accent-muted",
        inverse:
          "bg-foreground text-background shadow-sm hover:bg-foreground/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        navigation: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[var(--control-height)] px-4 py-2",
        compact: "h-8 px-3 text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6",
        xs: "h-7 rounded px-2 text-xs",
        icon: "size-[var(--control-height)]",
        "icon-xs": "h-7 w-7",
        "icon-lg": "size-12",
      },
      wrap: {
        true: "whitespace-normal text-wrap",
        false: "whitespace-nowrap",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  wrap?: boolean
  loading?: boolean
  render?: React.ReactElement
  "data-slot"?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      wrap,
      asChild = false,
      loading = false,
      render,
      disabled,
      children,
      onClickCapture,
      tabIndex,
      type,
      ...props
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || loading)
    const slotted = asChild || Boolean(render)
    const Comp = slotted ? Slot : "button"
    const content = render
      ? React.cloneElement(
          render as React.ReactElement<{ children?: React.ReactNode }>,
          undefined,
          children ?? (render.props as { children?: React.ReactNode }).children
        )
      : children
    return (
      <Comp
        {...props}
        ref={ref}
        data-slot={props["data-slot"] ?? "button"}
        className={cn(buttonVariants({ variant, size, wrap, className }))}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || props["aria-busy"]}
        tabIndex={isDisabled && slotted ? -1 : tabIndex}
        {...(isDisabled
          ? {
              onClickCapture: (event: React.MouseEvent) => {
                event.preventDefault()
                event.stopPropagation()
              },
            }
          : onClickCapture
            ? { onClickCapture }
            : {})}
      >
        {content}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
