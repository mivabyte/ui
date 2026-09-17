import { useEffect } from "react"
import type { Decorator, Preview } from "@storybook/react-vite"

import { DirectionProvider } from "../src/components/ui/direction.js"
import { TooltipProvider } from "../src/components/ui/tooltip.js"
import "../src/styles.css"

const withTheme: Decorator = (Story, context) => {
  const mode = String(context.globals.mode ?? "light")
  const direction = String(context.globals.direction ?? "ltr") as "ltr" | "rtl"

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark")
    document.documentElement.dir = direction
  }, [mode, direction])

  return (
    <DirectionProvider dir={direction}>
      <TooltipProvider>
        <div
          className={
            mode === "dark"
              ? "dark min-h-screen bg-background text-foreground"
              : "min-h-screen bg-background text-foreground"
          }
          dir={direction}
        >
          <div
            className={context.parameters.layout === "fullscreen" ? "" : "p-6"}
          >
            <Story />
          </div>
        </div>
      </TooltipProvider>
    </DirectionProvider>
  )
}

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    mode: {
      description: "Color mode",
      toolbar: {
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Writing direction",
      toolbar: {
        items: ["ltr", "rtl"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    mode: "light",
    direction: "ltr",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
