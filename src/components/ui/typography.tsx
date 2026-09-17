import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingClasses: Record<string, string> = {
  h1: "ui-page",
  h2: "ui-section-heading",
  h3: "ui-title",
  h4: "ui-card-heading",
  hero: "ui-display",
  display: "ui-display",
  statement: "ui-statement",
  page: "ui-page",
  section: "ui-section-heading",
  title: "ui-title",
  card: "ui-card-heading",
}
const textClasses: Record<string, string> = {
  p: "ui-text",
  body: "ui-text",
  lead: "ui-text ui-lead text-muted-foreground",
  small: "ui-text text-sm text-muted-foreground",
  meta: "ui-text text-xs text-muted-foreground",
  eyebrow:
    "text-xs font-semibold uppercase tracking-widest text-accent-foreground",
  signal: "ui-signal text-foreground",
}
export const headingVariants = (options?: {
  variant?: string
  tone?: string
  className?: string
}) =>
  cn(
    "ui-heading",
    headingClasses[options?.variant ?? "h2"] ?? headingClasses.h2,
    options?.tone === "inherit" && "text-inherit",
    options?.className
  )
export const textVariants = (options?: {
  variant?: string
  tone?: string
  className?: string
}) =>
  cn(
    textClasses[options?.variant ?? "p"] ?? textClasses.p,
    options?.tone === "inherit" && "text-inherit",
    options?.className
  )

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: headingVariants({ variant: "h1" }),
      h2: headingVariants({ variant: "h2" }),
      h3: headingVariants({ variant: "h3" }),
      h4: headingVariants({ variant: "h4" }),
      p: textClasses.p,
      lead: textClasses.lead,
      small: textClasses.small,
    },
  },
  defaultVariants: { variant: "p" },
})

export interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "p", asChild = false, ...props }, ref) => {
    const Component = asChild
      ? Slot
      : variant === "h1" ||
          variant === "h2" ||
          variant === "h3" ||
          variant === "h4"
        ? variant
        : "p"
    return (
      <Component
        ref={ref as any}
        className={cn(typographyVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Typography.displayName = "Typography"

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "hero"
    | "statement"
    | "display"
    | "page"
    | "section"
    | "title"
    | "card"
  tone?: "default" | "inherit" | string
  asChild?: boolean
  render?: React.ReactElement
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      variant = "h2",
      tone,
      asChild = false,
      render,
      children,
      ...props
    },
    ref
  ) => {
    const tag =
      variant === "h1" ||
      variant === "hero" ||
      variant === "display" ||
      variant === "page"
        ? "h1"
        : variant === "h3" || variant === "card"
          ? "h3"
          : variant === "h4"
            ? "h4"
            : "h2"
    const baseClass = headingVariants({ variant, tone, className })
    if (render) {
      const elementRef = (render as any).props?.ref ?? (render as any).ref
      const targetRef = ref ?? elementRef
      return React.cloneElement(render as React.ReactElement<any>, {
        ref: targetRef,
        className: cn(baseClass, (render as any).props?.className),
        children: children ?? (render as any).props?.children,
        ...props,
      })
    }
    const Comp = asChild ? Slot : tag
    return (
      <Comp ref={ref} className={baseClass} {...props}>
        {children}
      </Comp>
    )
  }
)
Heading.displayName = "Heading"

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "p" | "lead" | "small" | "body" | "meta" | "eyebrow" | "signal"
  tone?: "default" | "inherit" | string
  asChild?: boolean
  render?: React.ReactElement
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      className,
      variant = "p",
      tone,
      asChild = false,
      render,
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = textVariants({ variant, tone, className })
    if (render) {
      const elementRef = (render as any).props?.ref ?? (render as any).ref
      const targetRef = ref ?? elementRef
      return React.cloneElement(render as React.ReactElement<any>, {
        ref: targetRef,
        className: cn(baseClass, (render as any).props?.className),
        children: children ?? (render as any).props?.children,
        ...props,
      })
    }
    const Comp = asChild ? Slot : "p"
    return (
      <Comp ref={ref} className={baseClass} {...props}>
        {children}
      </Comp>
    )
  }
)
Text.displayName = "Text"

export function Eyebrow({ className, ...props }: TextProps) {
  return <Text variant="eyebrow" className={className} {...props} />
}
