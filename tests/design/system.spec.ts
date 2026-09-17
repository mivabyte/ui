import { expect, test, type Page } from "@playwright/test"
import { expectNoAxeViolations } from "../e2e/axe"

async function openStory(page: Page, story: string, mode = "light") {
  await page.goto(
    `/iframe.html?id=${story}&viewMode=story&globals=mode:${mode}`
  )
  await page.locator(".ui-heading").first().waitFor()
  await page.evaluate(() => document.fonts.ready)
}
const compositions = ["website", "application"]
for (const mode of ["light", "dark"]) {
  for (const composition of compositions) {
    test(`${composition} ${mode}: responsive, accessible, no browser errors`, async ({
      page,
    }) => {
      const errors: string[] = []
      page.on("pageerror", (error) => errors.push(error.message))
      await openStory(page, `design-system-compositions--${composition}`, mode)
      for (const width of [320, 375, 428, 768, 1024, 1280, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 })
        await expect
          .poll(
            () =>
              page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth + 1
              ),
            { message: `overflow at ${width}px` }
          )
          .toBe(true)
      }
      await expectNoAxeViolations(page)
      await page.setViewportSize({ width: 375, height: 900 })
      await expectNoAxeViolations(page)
      expect(errors).toEqual([])
    })
  }
  test(`semantic color contracts in ${mode}`, async ({ page }) => {
    await openStory(page, "design-system-foundations--tokens-and-states", mode)
    const ratios = await page.evaluate(() => {
      const probe = document.createElement("span")
      document.body.append(probe)
      function luminance(token: string) {
        probe.style.color = `hsl(var(--${token}))`
        const rgb = getComputedStyle(probe)
          .color.match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
          .map((v) => {
            v /= 255
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
          })
        return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
      }
      const pairs: [string, string, number][] = []
      for (const bg of [
        "background",
        "section",
        "surface",
        "surface-elevated",
        "surface-interactive",
        "accent",
      ])
        for (const fg of ["foreground", "muted-foreground"])
          pairs.push([fg, bg, 4.5])
      for (const bg of ["primary", "primary-hover"])
        pairs.push(["primary-foreground", bg, 4.5])
      for (const bg of ["accent", "accent-muted"])
        pairs.push(["accent-foreground", bg, 4.5])
      for (const status of ["success", "warning", "info", "destructive"])
        pairs.push([status, `${status}-subtle`, 4.5])
      pairs.push(["destructive-foreground", "destructive", 4.5])
      for (const bg of ["background", "section", "surface", "surface-elevated"])
        for (const fg of ["ring", "input"]) pairs.push([fg, bg, 3])
      const result = pairs.map(([fg, bg, min]) => {
        const a = luminance(fg),
          b = luminance(bg)
        return {
          fg,
          bg,
          min,
          ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
        }
      })
      probe.remove()
      return result
    })
    expect(ratios.filter(({ ratio, min }) => ratio < min)).toEqual([])
    await expectNoAxeViolations(page)
    const cards = await page
      .locator('[data-slot="card"]')
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          variant: node.getAttribute("data-variant"),
          bg: getComputedStyle(node).backgroundColor,
          shadow: getComputedStyle(node).boxShadow,
        }))
      )
    expect(new Set(cards.map((c) => c.bg)).size).toBeGreaterThanOrEqual(4)
    expect(new Set(cards.map((c) => c.shadow)).size).toBeGreaterThanOrEqual(3)
    expect(
      await page
        .locator("body")
        .evaluate((node) => getComputedStyle(node).fontFamily)
    ).toContain("Onest")
  })
}

test("search, create, tabs and dialog keyboard behavior", async ({ page }) => {
  await openStory(page, "design-system-compositions--application", "dark")
  await page
    .getByRole("searchbox", { name: "Search projects" })
    .fill("nothing-matches")
  await expect(page.getByText("No projects found")).toBeVisible()
  await page.getByRole("searchbox").fill("")
  const trigger = page.getByRole("button", { name: "New project" })
  await trigger.click()
  await page
    .getByRole("textbox", { name: "Project name" })
    .fill("Release console")
  await expectNoAxeViolations(page)
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(
    page.getByRole("cell", { name: "Release console Your workspace" })
  ).toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
  await page.getByRole("tab", { name: "Projects", exact: true }).focus()
  await page.keyboard.press("ArrowRight")
  await expect(page.getByRole("tab", { name: "Archived" })).toBeFocused()
  await expect(page.getByText("No archived projects")).toBeVisible()
})

test("reduced motion, density, touch and visible forced-color focus", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openStory(page, "design-system-foundations--tokens-and-states", "dark")
  const button = page.getByRole("button", { name: "Primary action" })
  expect(
    await button.evaluate((node) =>
      parseFloat(getComputedStyle(node).transitionDuration)
    )
  ).toBeLessThanOrEqual(0.00001)
  expect((await button.boundingBox())!.height).toBe(44)
  await page
    .locator("html")
    .evaluate((node) => node.setAttribute("data-density", "compact"))
  expect((await button.boundingBox())!.height).toBe(32)
  if (browserName === "chromium") {
    await page.emulateMedia({ forcedColors: "active" })
    await button.focus()
    expect(
      await button.evaluate((node) => getComputedStyle(node).outlineStyle)
    ).toBe("solid")
  }
})

test("mobile sidebar and RTL remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 850 })
  await openStory(page, "design-system-compositions--application", "dark")
  await page.locator("html").evaluate((node) => (node.dir = "rtl"))
  const trigger = page.getByRole("button", { name: "Toggle navigation" })
  await trigger.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expectNoAxeViolations(page)
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1
    )
  ).toBe(true)
})

test("coarse pointers retain touch targets in compact mode", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 375, height: 850 },
  })
  const page = await context.newPage()
  await page.goto(
    "http://localhost:6006/iframe.html?id=design-system-foundations--tokens-and-states&viewMode=story"
  )
  const button = page.getByRole("button", { name: "Primary action" })
  await button.waitFor()
  await page
    .locator("html")
    .evaluate((node) => node.setAttribute("data-density", "compact"))
  expect(
    await page.evaluate(() => matchMedia("(pointer: coarse)").matches)
  ).toBe(true)
  expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  expect(
    (await page
      .getByRole("tab", { name: "Overview", exact: true })
      .boundingBox())!.height
  ).toBeGreaterThanOrEqual(44)
  await context.close()
})
