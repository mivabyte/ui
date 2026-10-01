import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast, Toaster } from "../src/components/ui/toast.js"
import { Button } from "../src/components/ui/button.js"

const meta = {
  title: "Feedback/Toast",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Succinct message that is displayed temporarily for feedback.",
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
      <div className="flex gap-2">
        <Button
          onClick={() =>
            toast.add({
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2026 at 5:57 PM",
            })
          }
        >
          Default Toast
        </Button>
        <Button
          variant="destructive"
          onClick={() =>
            toast.add({
              type: "error",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
            })
          }
        >
          Destructive Toast
        </Button>
      </div>
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
          onClick={() => toast.add({ type: "success", title: "Changes saved" })}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({ type: "info", title: "New version available" })
          }
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({ type: "warning", title: "Storage is almost full" })
          }
        >
          Warning
        </Button>
        <Button
          variant="destructive"
          onClick={() => toast.add({ type: "error", title: "Request failed" })}
        >
          Error
        </Button>
      </div>
    </div>
  ),
}
