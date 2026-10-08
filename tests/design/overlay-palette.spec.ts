import { expect, test } from "@playwright/test"
import { expectNoAxeViolations } from "../e2e/axe"

for (const mode of ["light", "dark"]) {
  test(`opened overlays inherit neutral surfaces and keyboard focus in ${mode}`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000)
    for (const [story, trigger, selector, action] of [
      [
        "overlay-dialog--basic",
        "Open dialog",
        '[data-slot="dialog-content"]',
        "click",
      ],
      [
        "overlay-sheet--basic",
        "Open sheet",
        '[data-slot="sheet-content"]',
        "click",
      ],
      ["overlay-drawer--basic", "Open Drawer", '[role="dialog"]', "click"],
      ["overlay-dropdownmenu--basic", "Open Menu", '[role="menu"]', "click"],
      [
        "overlay-popover--basic",
        "Open Popover",
        "[data-radix-popper-content-wrapper] > div",
        "click",
      ],
      [
        "overlay-tooltip--basic",
        "Hover or focus",
        "[data-radix-popper-content-wrapper] > div",
        "focus",
      ],
      [
        "overlay-hovercard--basic",
        "@nextjs",
        "[data-radix-popper-content-wrapper] > div",
        "hover",
      ],
    ]) {
      await page.goto(
        `/iframe.html?id=${story}&viewMode=story&globals=mode:${mode}`
      )
      const button = page.getByRole("button", { name: trigger, exact: true })
      await expect(button).toBeVisible()
      if (action === "hover") await button.hover()
      else if (action === "focus") await button.focus()
      else await button.click()
      if (story === "overlay-dropdownmenu--basic")
        await page.keyboard.press("ArrowDown")
      const content = page.locator(selector).first()
      await expect(content).toBeVisible()
      await expect(content).toHaveCSS(
        "background-color",
        mode === "light" ? "rgb(248, 250, 252)" : "rgb(41, 41, 41)"
      )
      await expect(content).toHaveCSS(
        "color",
        mode === "light" ? "rgb(15, 23, 42)" : "rgb(250, 250, 250)"
      )
      if (story === "overlay-dropdownmenu--basic") {
        // Radix hides the trigger tree while its modal menu traps keyboard focus.
        // Scan the active menu and separately verify that Tab cannot enter that tree.
        await page.keyboard.press("Tab")
        expect(
          await content.evaluate((node) =>
            node.contains(document.activeElement)
          )
        ).toBe(true)
        await expectNoAxeViolations(page, '[role="menu"]')
      } else await expectNoAxeViolations(page)
      await page.screenshot({
        path: testInfo.outputPath(`${story}-${mode}.png`),
      })
      if (action !== "hover") {
        await page.keyboard.press("Escape")
        await expect(content).toBeHidden()
        await expect(button).toBeFocused()
      }
    }
  })
}
