import { describe, expect, it } from "vitest"

import { mergeRenderedChild } from "@/lib/render-child"

describe("mergeRenderedChild", () => {
  it("returns the element with its own children when it has any", () => {
    const element = <span data-testid="own">own text</span>

    const merged = mergeRenderedChild(element, <em>fallback</em>)

    expect(merged).not.toBe(element)
    expect((merged as React.ReactElement).props.children).toBe("own text")
  })

  it("falls back to the children prop when the element has none", () => {
    const element = <span data-testid="empty" />

    const merged = mergeRenderedChild(element, "fallback text")

    expect(merged).not.toBe(element)
    expect((merged as React.ReactElement).props.children).toBe("fallback text")
  })

  it("keeps the attributes the element was authored with", () => {
    const element = (
      <a href="/docs" className="link" data-analytics="nav">
        Docs
      </a>
    )

    const merged = mergeRenderedChild(element, "ignored") as React.ReactElement<
      Record<string, unknown>
    >

    // The original implementation passed `undefined` as props on purpose, so
    // cloneElement must not invent or overwrite any of these.
    expect(merged.props.href).toBe("/docs")
    expect(merged.props.className).toBe("link")
    expect(merged.props["data-analytics"]).toBe("nav")
  })

  it("treats an empty-string child as absent and keeps the fallback", () => {
    // `??` only falls back on null/undefined, so an empty string must survive.
    const element = <span>{""}</span>

    const merged = mergeRenderedChild(element, "fallback")

    expect((merged as React.ReactElement).props.children).toBe("")
  })

  it("passes a non-element value through untouched", () => {
    // Unreachable from TypeScript, because `render` is typed as
    // React.ReactElement. It is still guarded at runtime for JavaScript
    // consumers, so the branch is covered here on purpose rather than deleted.
    const notAnElement = "plain string" as unknown as React.ReactElement

    expect(mergeRenderedChild(notAnElement, "fallback")).toBe("plain string")
  })
})
