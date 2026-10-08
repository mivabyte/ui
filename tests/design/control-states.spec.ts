import { expect, test } from "@playwright/test"
import { expectNoAxeViolations } from "../e2e/axe"

for (const mode of ["light", "dark"]) {
  test(`control state colors and focus remain visible in ${mode}`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=design-system-control-states--basic&viewMode=story&globals=mode:${mode}`
    )
    const input = page.locator("#input-default")
    await expect(input).toBeVisible()
    const colors = await page.evaluate(() => {
      const probe = document.createElement("span")
      document.body.append(probe)
      const result: Record<string, string> = {}
      for (const token of [
        "destructive",
        "muted",
        "input",
        "ring",
        "foreground",
      ]) {
        probe.style.color = `hsl(var(--${token}))`
        result[token] = getComputedStyle(probe).color
      }
      probe.remove()
      return result
    })
    for (const id of ["input-invalid", "textarea-invalid", "select-invalid"]) {
      const control = page.locator(`#${id}`)
      await expect(control).toHaveCSS("border-top-color", colors.destructive)
      await control.hover()
      await expect(control).toHaveCSS("border-top-color", colors.destructive)
    }
    await expect(page.locator("#group-input").locator("..")).toHaveCSS(
      "border-top-color",
      colors.destructive
    )
    for (const id of ["input-readonly", "textarea-readonly"]) {
      await expect(page.locator(`#${id}`)).toHaveCSS(
        "background-color",
        colors.muted
      )
    }
    for (const id of [
      "input-disabled",
      "textarea-disabled",
      "select-disabled",
    ]) {
      await expect(page.locator(`#${id}`)).toBeDisabled()
      await expect(page.locator(`#${id}`)).toHaveCSS("opacity", "0.5")
      await page.locator(`#${id}`).hover({ force: true })
      await expect(page.locator(`#${id}`)).toHaveCSS(
        "border-top-color",
        colors.input
      )
    }
    await input.focus()
    await expect(input).toBeFocused()
    await expect
      .poll(() => input.evaluate((node) => getComputedStyle(node).boxShadow))
      .toContain(colors.ring)
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1
        )
      ).toBe(true)
    }
    await expectNoAxeViolations(page)
    await page.emulateMedia({ contrast: "more" })
    // Firefox media emulation needs a navigation to apply the CSS query reliably.
    await page.reload()
    await expect(
      page.getByRole("button", { name: "outline", exact: true })
    ).toBeVisible()
    expect(
      await page.evaluate(() => matchMedia("(prefers-contrast: more)").matches)
    ).toBe(true)
    const outline = page.getByRole("button", { name: "outline", exact: true })
    await expect(outline).toHaveCSS("border-top-color", colors.foreground)
  })
}
