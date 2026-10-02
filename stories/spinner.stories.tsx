import type { Meta, StoryObj } from "@storybook/react-vite"

import { Spinner } from "../src/components/ui/spinner.js"

const meta = {
  title: "Feedback/Spinner",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Accessible loading spinner indicator.",
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner className="size-5 text-link" />
      <span className="text-sm text-muted-foreground">Loading assets...</span>
    </div>
  ),
}
