import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Button } from "../../src/components/ui/button"
import { Heading, headingVariants } from "../../src/components/ui/typography"

describe("design system behavior", () => {
  it("pending native actions report busy state and cannot submit twice", () => {
    const click = vi.fn()
    render(
      <Button loading onClick={click}>
        Save changes
      </Button>
    )
    const button = screen.getByRole("button", { name: "Save changes" })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
    fireEvent.click(button)
    expect(click).not.toHaveBeenCalled()
  })
  it.each(["asChild", "render"])(
    "pending %s links block activation and preserve content",
    (mode) => {
      const click = vi.fn()
      const link = (
        <a href="/danger" onClick={click}>
          Publish
        </a>
      )
      render(
        mode === "asChild" ? (
          <Button asChild loading>
            {link}
          </Button>
        ) : (
          <Button render={link} loading />
        )
      )
      const target = screen.getByRole("link", { name: "Publish" })
      expect(target).toHaveAttribute("aria-busy", "true")
      expect(target).toHaveAttribute("tabindex", "-1")
      fireEvent.click(target)
      expect(click).not.toHaveBeenCalled()
    }
  )
  it("a display role does not force the semantic heading level", () => {
    render(
      <Heading variant="display" render={<h2 />}>
        A section headline
      </Heading>
    )
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("ui-display")
    expect(headingVariants({ variant: "page" })).not.toBe(
      headingVariants({ variant: "display" })
    )
  })
})
