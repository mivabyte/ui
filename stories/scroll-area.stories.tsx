import { ScrollAreaExample } from "./_examples.js"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { ScrollArea } from "../src/components/ui/scroll-area.js"

const meta = {
  title: "Layout/ScrollArea",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Scrollable container with Radix scrollbars by default and a native scrollbar mode for busy interfaces.",
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <ScrollAreaExample />,
}

export const Native: Story = {
  render: () => (
    <ScrollArea scrollbar="native" className="h-48 w-64 rounded-md border p-4">
      {Array.from({ length: 50 }, (_, i) => (
        <p key={i} className="py-2 text-sm">
          Message #{i + 1}
        </p>
      ))}
    </ScrollArea>
  ),
}
