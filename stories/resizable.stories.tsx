import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../src/components/ui/resizable.js"

const meta = {
  title: "Layout/Resizable",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible and resizable panel groups with keyboard and touch support.",
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <div className="w-[600px] h-[200px] rounded-lg border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Panel One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Panel Two</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}
