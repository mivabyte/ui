import * as React from "react"
import { act, render, screen, waitFor } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import { toast } from "sonner"
import { afterEach, describe, expect, it } from "vitest"

import { Toaster } from "@/components/ui/sonner"

const REGION = "[data-sonner-toaster]"

// `tests/setup.ts` installs a `matchMedia` stub that never reports a dark
// preference. sonner resolves the "system" theme through
// `window.matchMedia("(prefers-color-scheme: dark)")`, so these tests drive that
// query explicitly. Without it, "system" and a hardcoded "light" fallback are
// indistinguishable in the DOM and the default stays untested.
const defaultMatchMedia = window.matchMedia

function osPrefersDark(prefersDark: boolean) {
  window.matchMedia = ((query: string) =>
    ({
      matches: prefersDark && query.includes("prefers-color-scheme: dark"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia
}

type RegionOptions = {
  /** `next-themes` theme to seed; omitted means "no ThemeProvider at all". */
  providerTheme?: "light" | "dark" | "system"
  position?: "bottom-left"
  prefersDark: boolean
}

/**
 * Render `<Toaster />` and return the `data-sonner-toaster` region once a
 * toast exists.
 *
 * sonner renders that region only while at least one toast is queued, so the
 * theme and the position it reflects are not observable from an empty toaster.
 * A toast is pushed and dismissed inside the helper so the module-global
 * sonner store cannot leak between tests.
 */
async function renderRegion({
  providerTheme,
  position,
  prefersDark,
}: RegionOptions) {
  osPrefersDark(prefersDark)

  const toaster = <Toaster position={position} />
  const view = render(
    providerTheme === undefined ? (
      toaster
    ) : (
      <ThemeProvider
        defaultTheme={providerTheme}
        storageKey="sonner-test-theme"
      >
        {toaster}
      </ThemeProvider>
    )
  )

  try {
    act(() => {
      toast(`probe-${providerTheme ?? "default"}-${position ?? "default"}`)
    })
    return await waitFor(() => {
      const region = document.querySelector<HTMLElement>(REGION)
      expect(region).not.toBeNull()
      return region as HTMLElement
    })
  } finally {
    view.unmount()
    act(() => {
      toast.dismiss()
    })
  }
}

describe("Sonner", () => {
  afterEach(() => {
    window.matchMedia = defaultMatchMedia
    // sonner's toast store is module-global and outlives unmount, so anything
    // a test pushed has to be dismissed or it is replayed into the next one.
    act(() => {
      toast.dismiss()
    })
  })

  it("mounts an accessible live region without a theme provider", () => {
    render(<Toaster />)

    // next-themes' `useTheme` falls back to its default context, so the
    // component must mount cleanly with no surrounding ThemeProvider.
    const region = screen.getByLabelText("Notifications alt+T")
    expect(region.tagName).toBe("SECTION")
    expect(region.getAttribute("aria-live")).toBe("polite")
  })

  it("hands the next-themes theme to sonner", async () => {
    // `next-themes@0.4` has no `theme` prop — `defaultTheme` is what seeds
    // `useTheme().theme`, which is the only value this component forwards.
    // (`forcedTheme` is deliberately different: it never reaches `theme`, so a
    // forced dark theme leaves the toaster following the OS preference.)
    expect(
      (
        await renderRegion({ providerTheme: "dark", prefersDark: false })
      ).getAttribute("data-sonner-theme")
    ).toBe("dark")

    expect(
      (
        await renderRegion({ providerTheme: "light", prefersDark: true })
      ).getAttribute("data-sonner-theme")
    ).toBe("light")

    // An explicit "system" provider theme tracks the OS rather than pinning a
    // colour, which is what separates it from a hardcoded light toaster.
    expect(
      (
        await renderRegion({ providerTheme: "system", prefersDark: true })
      ).getAttribute("data-sonner-theme")
    ).toBe("dark")
    expect(
      (
        await renderRegion({ providerTheme: "system", prefersDark: false })
      ).getAttribute("data-sonner-theme")
    ).toBe("light")
  })

  it("defaults to the system theme when no provider is mounted", async () => {
    // `useTheme()`'s default context carries no `theme`, so the `= "system"`
    // fallback in the component decides the outcome. Both halves are needed:
    // on a light-preferring OS a hardcoded "dark" default looks correct, and on
    // a dark-preferring OS a hardcoded "light" default looks correct.
    expect(
      (await renderRegion({ prefersDark: true })).getAttribute(
        "data-sonner-theme"
      )
    ).toBe("dark")
    expect(
      (await renderRegion({ prefersDark: false })).getAttribute(
        "data-sonner-theme"
      )
    ).toBe("light")
  })

  it("renders toasts pushed through the sonner API", async () => {
    render(<Toaster position="bottom-left" />)

    act(() => {
      toast("Scheduled: Catch up", {
        description: "Friday, February 10",
      })
    })

    await waitFor(() => {
      expect(screen.getByText("Scheduled: Catch up")).toBeInTheDocument()
    })
    expect(screen.getByText("Friday, February 10")).toBeInTheDocument()

    // `position` has to reach sonner, not just be accepted by the component.
    const region = document.querySelector<HTMLElement>(REGION)
    expect(region).toHaveAttribute("data-x-position", "left")
    expect(region).toHaveAttribute("data-y-position", "bottom")
  })

  it("anchors the toaster bottom-right by default", async () => {
    const region = await renderRegion({ prefersDark: false })

    expect(region).toHaveAttribute("data-x-position", "right")
    expect(region).toHaveAttribute("data-y-position", "bottom")
  })

  it("keeps the consumer className alongside the sonner theme attribute", async () => {
    // The component hardcodes `className="toaster group"` before spreading
    // props, so a consumer className wins while the theme still comes from
    // next-themes. Both facts in one element.
    osPrefersDark(true)
    render(
      <ThemeProvider defaultTheme="dark" storageKey="sonner-test-theme">
        <Toaster className="brand-toaster" />
      </ThemeProvider>
    )

    act(() => {
      toast("Themed")
    })

    await waitFor(() => {
      expect(screen.getByText("Themed")).toBeInTheDocument()
    })
    const region = document.querySelector<HTMLElement>(REGION)
    expect(region).toHaveAttribute("data-sonner-theme", "dark")
    expect(region).toHaveClass("brand-toaster")
  })

  it("forwards consumer props such as custom icons", async () => {
    render(
      <Toaster
        icons={{
          success: <span data-testid="custom-success">ok</span>,
        }}
      />
    )

    act(() => {
      toast.success("Saved")
    })

    await waitFor(() => {
      expect(screen.getByTestId("custom-success")).toBeInTheDocument()
    })
  })
})
