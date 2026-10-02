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

export const Types: Story = {
  render: () => (
    <div>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => toast.success("Changes saved")}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("New version available")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Storage is almost full")}
        >
          Warning
        </Button>
        <Button
          variant="destructive"
          onClick={() => toast.error("Request failed")}
        >
          Error
        </Button>
      </div>
    </div>
  ),
}
