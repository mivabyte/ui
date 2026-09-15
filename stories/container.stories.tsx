import type { Meta, StoryObj } from "@storybook/react-vite"
import { Container } from "../src/components/ui/container"

const meta = {
  title: "Components/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Bounded container primitive with standard, reading, and wide widths.",
      },
    },
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Container size="standard">
      <div className="bg-muted p-4 text-center rounded-md">
        Standard Container Content
      </div>
    </Container>
  ),
}
