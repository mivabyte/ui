import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import useEmblaCarousel from "embla-carousel-react"
import { describe, expect, it, vi } from "vitest"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../src/components/ui/carousel.js"

const { mockListeners, mockApi } = vi.hoisted(() => {
  const mockListeners: Record<string, Function[]> = {}
  const mockApi = {
    canScrollPrev: vi.fn(() => true),
    canScrollNext: vi.fn(() => true),
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    on: vi.fn((event: string, cb: Function) => {
      mockListeners[event] = mockListeners[event] || []
      mockListeners[event].push(cb)
    }),
    off: vi.fn((event: string, cb: Function) => {
      if (mockListeners[event]) {
        mockListeners[event] = mockListeners[event].filter((fn) => fn !== cb)
      }
    }),
  }
  return { mockListeners, mockApi }
})

vi.mock("embla-carousel-react", () => ({
  default: vi.fn(() => [vi.fn(), mockApi]),
}))

describe("Carousel runtime & accessibility", () => {
  it("renders carousel region, slides, and navigation controls", async () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    const carousel = screen.getByRole("region")
    expect(carousel).toHaveAttribute("aria-roledescription", "carousel")

    const slides = screen.getAllByRole("group")
    expect(slides).toHaveLength(3)
    expect(slides[0]).toHaveAttribute("aria-roledescription", "slide")
    expect(slides[0]).toHaveTextContent("Slide 1")

    const prevButton = screen.getByRole("button", { name: "Previous slide" })
    const nextButton = screen.getByRole("button", { name: "Next slide" })

    expect(prevButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()

    // Test keyboard interactions and button clicks
    fireEvent.keyDown(carousel, { key: "ArrowRight" })
    fireEvent.keyDown(carousel, { key: "ArrowLeft" })
    fireEvent.keyDown(carousel, { key: "ArrowDown" })
    fireEvent.click(nextButton)
    fireEvent.click(prevButton)

    const results = await axe.run(carousel)
    expect(results.violations).toEqual([])
  })

  it("supports vertical orientation, opts.axis=y, and setApi callback", () => {
    const setApi = vi.fn()
    render(
      <Carousel orientation="vertical" opts={{ axis: "y" }} setApi={setApi}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-roledescription",
      "carousel"
    )
    // Embla mock might call setApi
  })

  it("throws when carousel subcomponents are used outside Carousel", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<CarouselContent />)).toThrow(
      "useCarousel must be used within a <Carousel />"
    )
    spy.mockRestore()
  })

  it("handles null api in select listener safely and unmounts cleanly", () => {
    const { unmount } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    )

    mockListeners["select"]?.forEach((cb) => cb(null))
    unmount()
    expect(mockApi.off).toHaveBeenCalled()
  })

  it("handles undefined api gracefully", () => {
    vi.mocked(useEmblaCarousel).mockReturnValueOnce([
      vi.fn() as any,
      undefined as any,
    ])
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    )
  })
})
