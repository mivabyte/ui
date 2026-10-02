"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-info" />,
        warning: <TriangleAlertIcon className="size-4 text-warning" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin text-link" />,
      }}
      style={
        {
          "--normal-bg": "hsl(var(--popover))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--success-bg": "hsl(var(--success-subtle))",
          "--success-text": "hsl(var(--success))",
          "--success-border": "hsl(var(--success) / 0.5)",
          "--info-bg": "hsl(var(--info-subtle))",
          "--info-text": "hsl(var(--info))",
          "--info-border": "hsl(var(--info) / 0.5)",
          "--warning-bg": "hsl(var(--warning-subtle))",
          "--warning-text": "hsl(var(--warning))",
          "--warning-border": "hsl(var(--warning) / 0.5)",
          "--error-bg": "hsl(var(--destructive-subtle))",
          "--error-text": "hsl(var(--destructive))",
          "--error-border": "hsl(var(--destructive) / 0.5)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
