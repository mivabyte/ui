import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { MessageScroller } from "@/components/ui/message-scroller"
import { ScrollArea } from "@/components/ui/scroll-area"

describe("ScrollArea scrollbar modes", () => {
  it.each(["native", "custom"] as const)(
    "exposes separate root and viewport refs in %s mode",
    (scrollbar) => {
      const rootRef = React.createRef<HTMLDivElement>()
      const viewportRef = React.createRef<HTMLDivElement>()
      const onScroll = vi.fn()
      const { unmount } = render(
        <ScrollArea
          ref={rootRef}
          viewportRef={viewportRef}
          scrollbar={scrollbar}
          dir="rtl"
          data-testid="scroller"
          onScrollCapture={onScroll}
        >
          <p>Message</p>
        </ScrollArea>
      )

      expect(rootRef.current).toBe(screen.getByTestId("scroller"))
      expect(rootRef.current).toHaveAttribute("dir", "rtl")
      expect(viewportRef.current).not.toBe(rootRef.current)
      expect(viewportRef.current).toHaveTextContent("Message")
      expect(viewportRef.current).toHaveAttribute(
        "data-slot",
        "scroll-area-viewport"
      )
      viewportRef.current!.scrollTop = 120
      fireEvent.scroll(viewportRef.current!)
      expect(viewportRef.current!.scrollTop).toBe(120)
      expect(onScroll).toHaveBeenCalledOnce()

      unmount()
      expect(rootRef.current).toBeNull()
      expect(viewportRef.current).toBeNull()
    }
  )

  it("uses native scrollbars in chats and supports the previous custom mode", () => {
    const viewportRef = React.createRef<HTMLDivElement>()
    const { rerender } = render(
      <MessageScroller viewportRef={viewportRef}>Message</MessageScroller>
    )

    expect(viewportRef.current).toHaveAttribute("tabindex", "0")
    // Radix injects global CSS that hides every Radix viewport's native bar.
    // The native viewport must stay outside that selector, even alongside Radix.
    expect(viewportRef.current).not.toHaveAttribute(
      "data-radix-scroll-area-viewport"
    )

    rerender(
      <MessageScroller scrollbar="custom" viewportRef={viewportRef}>
        Message
      </MessageScroller>
    )
    expect(viewportRef.current).toHaveAttribute(
      "data-radix-scroll-area-viewport"
    )
  })

  it("renders a native chat viewport on the server without custom thumb machinery", () => {
    const html = renderToStaticMarkup(
      <MessageScroller>Message</MessageScroller>
    )
    expect(html).toContain('data-scrollbar="native"')
    expect(html).not.toContain("data-radix-scroll-area-viewport")
    expect(html).not.toContain("translate3d")
    expect(html).not.toContain("<style")
  })
})
