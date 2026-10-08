import type { Meta, StoryObj } from "@storybook/react-vite"

import { MediaPlayer } from "../src/components/ui/media-player.js"

const meta = {
  title: "Media/Media Player",
  component: MediaPlayer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Native video playback with Mivabyte controls. Click the video to play/pause; desktop controls fade when the pointer leaves and return on hover or keyboard focus. Touch controls remain visible. Pauses when the video leaves the viewport or the tab is hidden; returning does not restart it. Supports video props, source/track children and a video element ref. Fullscreen uses the browser API with a native Safari video fallback.",
      },
    },
  },
  args: {
    src: "/media-player-demo.mp4",
    "aria-label": "Mivabyte video preview",
    className: "w-full max-w-2xl",
  },
} satisfies Meta<typeof MediaPlayer>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Muted: Story = { args: { muted: true } }

export const ScrollToPause: Story = {
  render: (args) => (
    <div className="w-full max-w-2xl">
      <p className="mb-4 text-sm text-muted-foreground">
        Start the video, then scroll past it. Scroll back to resume manually.
      </p>
      <MediaPlayer {...args} />
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        The video above pauses once it leaves the screen.
      </div>
    </div>
  ),
}

export const Narrow: Story = { args: { className: "w-full max-w-[320px]" } }

export const Unavailable: Story = { args: { src: "/missing-video.mp4" } }
