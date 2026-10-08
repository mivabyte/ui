import { expect, test } from "@playwright/test"
import { collectAxeViolations } from "../e2e/axe"

// Discover every published story so new components join the theme audit.
for (const mode of ["light", "dark"]) {
  test(`all Storybook examples: ${mode} surfaces, accessibility and reflow`, async ({
    page,
    request,
    browserName,
  }, testInfo) => {
    test.skip(
      browserName !== "chromium",
      "Chromium owns the complete deterministic Storybook scan; state tests cover all engines."
    )
    test.setTimeout(600_000)
    const response = await request.get("/index.json")
    const index = await response.json()
    const stories = Object.values(index.entries).filter(
      (entry: any) => entry.type === "story"
    ) as { id: string }[]
    expect(stories.length).toBeGreaterThan(0)
    const findings: unknown[] = []
    for (const { id } of stories) {
      await test.step(id, async () => {
        const errors: string[] = []
        const onError = (error: Error) => errors.push(error.message)
        page.on("pageerror", onError)
        await page.setViewportSize({ width: 1440, height: 1000 })
        await page.goto(
          `/iframe.html?id=${id}&viewMode=story&globals=mode:${mode}`
        )
        await page.locator("#storybook-root > *").first().waitFor()
        await page.evaluate(() => document.fonts.ready)
        const violations = await collectAxeViolations(page)
        await page.screenshot({
          path: testInfo.outputPath(`${id}.png`),
          fullPage: true,
        })
        const overflow: number[] = []
        for (const width of [375, 768, 1440]) {
          await page.setViewportSize({ width, height: 1000 })
          try {
            await expect
              .poll(() =>
                page.evaluate(() => document.documentElement.scrollWidth)
              )
              .toBeLessThanOrEqual(width + 1)
          } catch {
            overflow.push(width)
          }
        }
        page.off("pageerror", onError)
        if (violations.length || errors.length || overflow.length)
          findings.push({ id, violations, errors, overflow })
      })
    }
    await testInfo.attach("theme-audit", {
      body: JSON.stringify(findings, null, 2),
      contentType: "application/json",
    })
    expect(findings, JSON.stringify(findings, null, 2)).toEqual([])
  })
}
