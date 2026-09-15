import * as React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AspectRatio } from "../../src/components/ui/aspect-ratio.js"

describe("AspectRatio", () => {
  it("uses the supplied width-to-height ratio", () => {
    const { container } = render(<AspectRatio ratio={4 / 3} />)

    expect(container.firstElementChild).toHaveAttribute(
      "style",
      "aspect-ratio: 1.3333333333333333 / 1;"
    )
  })
})
