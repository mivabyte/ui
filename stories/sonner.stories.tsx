import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "../src/components/ui/button.js"
import { Toaster } from "../src/components/ui/sonner.js"
import { toast } from "sonner"

const meta = {
  title: "Feedback/Sonner",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Theme-aware toast surface built on sonner. Render once near the app root.",
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast("Scheduled: Catch up", {
            description: "Friday, February 10, 2026 at 5:57 PM",
          })
        }
      >
        Show toast
      </Button>
    </div>
  ),
}
