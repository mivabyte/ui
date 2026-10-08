import type { Meta, StoryObj } from "@storybook/react-vite"

import { NativeSelect } from "../src/components/ui/native-select.js"

const meta = {
  title: "Form/NativeSelect",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Native HTML select wrapped with consistent styling.",
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <div className="w-80">
      <NativeSelect defaultValue="apple" aria-label="Fruit">
        <optgroup label="Fruits">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </optgroup>
      </NativeSelect>
    </div>
  ),
}
