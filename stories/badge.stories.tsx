import { Badge } from "../src/components/ui/badge.js"
import { BadgeExample } from "./_examples.js"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Feedback/Badge",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Compact status label.",
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <BadgeExample />,
}

export const Info: Story = {
  render: () => (
    <div className="max-w-prose space-y-3 text-sm">
      <p>
        Status: <Badge variant="info">Informational</Badge> — the neutral
        variant stays quiet inside a paragraph.
      </p>
      <p>
        <Badge variant="secondary">Secondary</Badge>{" "}
        <Badge variant="info">Info</Badge>{" "}
        <Badge variant="success">Success</Badge>{" "}
        <Badge variant="warning">Warning</Badge>
      </p>
    </div>
  ),
}
