import type { Meta, StoryObj } from "@storybook/react-vite"
import { MarketingComposition } from "../_system-marketing"
import { ApplicationComposition } from "../_system-application"

const meta = {
  title: "Design System/Compositions",
  parameters: { layout: "fullscreen" },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Website: Story = { render: () => <MarketingComposition /> }
export const Application: Story = { render: () => <ApplicationComposition /> }
