import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "text-3xl font-bold tracking-tight lg:text-4xl",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      p: "text-base leading-7 [&:not(:first-child)]:mt-6",
      lead: "text-base leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground",
      small: "text-sm leading-6 text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
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
      variant === "h1" || variant === "hero" || variant === "display"
        ? "h1"
        : variant === "h3" || variant === "card"
          ? "h3"
          : variant === "h4"
            ? "h4"
            : "h2"
    const baseClass = cn(
      tag === "h1"
        ? "text-4xl font-extrabold tracking-tight lg:text-5xl"
        : tag === "h3"
          ? "text-2xl font-semibold tracking-tight"
          : tag === "h4"
            ? "text-xl font-semibold tracking-tight"
            : "text-3xl font-bold tracking-tight lg:text-4xl",
      tone === "inherit" && "text-inherit",
      className
    )
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
    const baseClass = cn(
      variant === "lead"
        ? "text-base leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground"
        : variant === "small" || variant === "meta"
          ? "text-sm leading-6 text-muted-foreground"
          : variant === "eyebrow"
            ? "text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            : "text-base leading-7 [&:not(:first-child)]:mt-6",
      tone === "inherit" && "text-inherit",
      className
    )
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

export const headingVariants = (options?: {
  variant?: string
  tone?: string
  className?: string
}) => {
  return cn(
    options?.variant === "h1" ||
      options?.variant === "hero" ||
      options?.variant === "display"
      ? "text-4xl font-extrabold tracking-tight lg:text-5xl"
      : options?.variant === "h3" || options?.variant === "card"
        ? "text-2xl font-semibold tracking-tight"
        : options?.variant === "h4"
          ? "text-xl font-semibold tracking-tight"
          : "text-3xl font-bold tracking-tight lg:text-4xl",
    options?.tone === "inherit" && "text-inherit",
    options?.className
  )
}

export const textVariants = (options?: {
  variant?: string
  tone?: string
  className?: string
}) => {
  return cn(
    options?.variant === "lead"
      ? "text-base leading-7 text-muted-foreground"
      : options?.variant === "small" || options?.variant === "meta"
        ? "text-sm leading-6 text-muted-foreground"
        : options?.variant === "eyebrow"
          ? "text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          : "text-base leading-7",
    options?.tone === "inherit" && "text-inherit",
    options?.className
  )
}
