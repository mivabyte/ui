import type { Meta, StoryObj } from "@storybook/react-vite"

import { MessageScroller } from "../src/components/ui/message-scroller.js"

const meta = {
  title: "Feedback/MessageScroller",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Scrolling container for chat threads with native scrollbars. Use viewportRef to manage scroll position, or scrollbar="custom" for Radix scrollbars.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <div className="w-80">
      <MessageScroller className="h-64 p-4">
        <div className="space-y-2">
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="rounded border p-2 text-sm">
              Message #{i + 1}
            </div>
          ))}
        </div>
      </MessageScroller>
    </div>
  ),
}
