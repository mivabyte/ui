import { expect, test } from "@playwright/test"
import { expectNoAxeViolations } from "../e2e/axe"

for (const mode of ["light", "dark"]) {
  test(`media player is responsive and accessible in ${mode}`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    await page.goto(
      `/iframe.html?id=media-media-player--basic&viewMode=story&globals=mode:${mode}`
    )
    await page.getByRole("button", { name: "Play", exact: true }).waitFor()
    await expect(
      page.getByRole("slider", { name: "Playback position" })
    ).toHaveAttribute("aria-valuemax", "30")
    for (const width of [320, 375, 428, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth
          )
        )
        .toBe(true)
    }
    await expectNoAxeViolations(page)
    await page.setViewportSize({ width: 320, height: 900 })
    await expectNoAxeViolations(page)
    const play = page.getByRole("button", {
      name: "Play Mivabyte video preview",
      exact: true,
    })
    await play.focus()
    await page.keyboard.press("Space")
    await expect(
      page.getByRole("button", { name: "Pause", exact: true })
    ).toBeVisible()
    await expect(play).toHaveCount(0)
    await page.getByRole("button", { name: "Mute", exact: true }).click()
    await expect
      .poll(() =>
        page.locator("video").evaluate((video: HTMLVideoElement) => video.muted)
      )
      .toBe(true)
    await page.getByRole("button", { name: "Unmute", exact: true }).click()
    await expect
      .poll(() =>
        page.locator("video").evaluate((video: HTMLVideoElement) => video.muted)
      )
      .toBe(false)
    const volume = page.getByRole("slider", { name: "Volume" })
    await volume.focus()
    await page.keyboard.press("Home")
    await expect(
      page.getByRole("button", { name: "Unmute", exact: true })
    ).toBeVisible()
    await page.keyboard.press("End")
    await expect(volume).toHaveAttribute("aria-valuenow", "1")
    await page.getByRole("button", { name: "Pause", exact: true }).click()
    const seek = page.getByRole("slider", { name: "Playback position" })
    await seek.focus()
    await page.keyboard.press("End")
    await expect
      .poll(() =>
        page
          .locator("video")
          .evaluate((video: HTMLVideoElement) => video.currentTime)
      )
      .toBeGreaterThan(29)
    await page.keyboard.press("Home")
    await expect
      .poll(() =>
        page
          .locator("video")
          .evaluate((video: HTMLVideoElement) => video.currentTime)
      )
      .toBe(0)
    expect(errors).toEqual([])
  })
}

test("scrolling out pauses without resetting or restarting playback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 800, height: 600 })
  await page.goto(
    "/iframe.html?id=media-media-player--scroll-to-pause&viewMode=story"
  )
  const seek = page.getByRole("slider", { name: "Playback position" })
  await expect(seek).toHaveAttribute("aria-valuemax", "30")
  await seek.focus()
  for (let jump = 0; jump < 5; jump++) await page.keyboard.press("PageUp")
  await expect
    .poll(() =>
      page
        .locator("video")
        .evaluate((video: HTMLVideoElement) => video.currentTime)
    )
    .toBeGreaterThanOrEqual(5)
  await page.getByRole("button", { name: "Play", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Pause", exact: true })
  ).toBeVisible()
  await expect
    .poll(() =>
      page
        .locator("video")
        .evaluate((video: HTMLVideoElement) => video.currentTime)
    )
    .toBeGreaterThan(5.5)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect
    .poll(() =>
      page.locator("video").evaluate((video: HTMLVideoElement) => video.paused)
    )
    .toBe(true)
  const position = await page
    .locator("video")
    .evaluate((video: HTMLVideoElement) => video.currentTime)
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(
    page.getByRole("button", { name: "Play", exact: true })
  ).toBeVisible()
  expect(
    await page
      .locator("video")
      .evaluate((video: HTMLVideoElement) => video.currentTime)
  ).toBe(position)
})

test("native fullscreen includes the controls and follows browser exit", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=media-media-player--basic&viewMode=story")
  await page.getByRole("button", { name: "Play", exact: true }).waitFor()
  const supported = await page.evaluate(
    () =>
      document.fullscreenEnabled &&
      typeof document.documentElement.requestFullscreen === "function"
  )
  test.skip(!supported, "This browser does not support element fullscreen")
  await page.getByRole("button", { name: "Enter fullscreen" }).click()
  await expect(
    page.getByRole("button", { name: "Exit fullscreen" })
  ).toBeVisible()
  expect(
    await page.evaluate(() =>
      document.fullscreenElement?.getAttribute("data-slot")
    )
  ).toBe("media-player")
  await expect(page.getByRole("slider", { name: "Volume" })).toBeVisible()
  await page.evaluate(() => document.exitFullscreen())
  await expect(
    page.getByRole("button", { name: "Enter fullscreen" })
  ).toBeVisible()
})

test("video surface toggles playback and controls follow pointer, keyboard and touch", async ({
  page,
  browser,
  browserName,
}) => {
  await page.goto("/iframe.html?id=media-media-player--basic&viewMode=story")
  const surface = page.getByRole("button", {
    name: "Play Mivabyte video preview",
    exact: true,
  })
  const controls = page.locator('[data-slot="media-player-controls"]')
  await surface.click({ position: { x: 30, y: 30 } })
  await expect(
    page.getByRole("button", {
      name: "Pause Mivabyte video preview",
      exact: true,
    })
  ).toBeVisible()
  await expect(controls).toHaveCSS("opacity", "1")
  await page.mouse.move(3, 3)
  await expect(controls).toHaveCSS("opacity", "0")
  await page
    .getByRole("button", { name: "Pause Mivabyte video preview", exact: true })
    .focus()
  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("slider", { name: "Playback position" })
  ).toBeFocused()
  await expect(controls).toHaveCSS("opacity", "1")
  await page
    .getByRole("button", { name: "Pause Mivabyte video preview", exact: true })
    .focus()
  await page.keyboard.press("Space")
  await expect(surface).toBeFocused()
  await expect(controls).toHaveCSS("opacity", "1")
  await surface.click({ position: { x: 30, y: 30 } })
  await page.mouse.click(3, 3)
  await expect(controls).toHaveCSS("opacity", "0")
  await page.emulateMedia({ forcedColors: "active" })
  await expect(controls).toHaveCSS("opacity", "1")
  await page.emulateMedia({ forcedColors: "none", reducedMotion: "reduce" })
  await expect(controls).toHaveCSS("opacity", "0")
  await page
    .getByRole("button", { name: "Pause Mivabyte video preview", exact: true })
    .hover()
  await expect(controls).toHaveCSS("opacity", "1")
  await expectNoAxeViolations(page)

  if (browserName === "chromium") {
    const touchContext = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 375, height: 740 },
    })
    try {
      const touchPage = await touchContext.newPage()
      await touchPage.goto(
        "http://localhost:6006/iframe.html?id=media-media-player--basic&viewMode=story"
      )
      await touchPage
        .getByRole("button", {
          name: "Play Mivabyte video preview",
          exact: true,
        })
        .tap({ position: { x: 30, y: 30 } })
      await expect(
        touchPage.getByRole("button", { name: "Pause", exact: true })
      ).toBeVisible()
      await touchPage.mouse.move(3, 3)
      await expect(
        touchPage.locator('[data-slot="media-player-controls"]')
      ).toHaveCSS("opacity", "1")
      await expectNoAxeViolations(touchPage)
    } finally {
      await touchContext.close()
    }
  }
})
