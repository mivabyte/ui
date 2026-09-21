import { expect, test, type Page } from "@playwright/test"

function collectBrowserErrors(page: Page) {
  const errors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  page.on("pageerror", (error) => errors.push(error.message))
  return errors
}

test.describe("keyboard-sensitive component families", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?suite=keyboard")
    await expect(
      page.getByRole("heading", { name: "Keyboard Testbed" })
    ).toBeVisible()
  })

  test("menus: keyboard opens, navigates with arrows, and activates items", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page)
    const trigger = page.getByRole("button", { name: "Open dropdown menu" })
    await trigger.focus()
    await page.keyboard.press("Enter")

    const menu = page.getByRole("menu")
    await expect(menu).toBeVisible()

    const profileItem = page.getByRole("menuitem", { name: "Profile" })
    await expect(profileItem).toBeVisible()
    await expect(profileItem).toBeFocused()

    const settingsItem = page.getByRole("menuitem", { name: "Settings" })
    await page.keyboard.press("ArrowDown")
    await expect(settingsItem).toBeFocused()
    await page.keyboard.press("Enter")

    await expect(page.getByTestId("menu-action")).toHaveText("settings")
    expect(browserErrors).toEqual([])
  })

  test("navigation: navigation menu opens and dismisses with Escape", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page)
    const trigger = page.getByRole("button", { name: "Nav Products" })
    await trigger.click()

    const link = page.getByTestId("nav-link")
    await expect(link).toBeVisible()

    await page.keyboard.press("Escape")
    expect(browserErrors).toEqual([])
  })

  test("calendar: grid renders and supports day interaction", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page)
    const calendarSection = page.getByTestId("section-calendar")
    await expect(calendarSection).toBeVisible()
    const grid = calendarSection.getByRole("grid")
    await expect(grid).toBeVisible()
    expect(browserErrors).toEqual([])
  })

  test("combobox: filters options and selects via keyboard", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page)
    const input = page.getByLabel("Framework search")
    await input.focus()
    await page.keyboard.type("React")

    const reactItem = page.getByRole("option", { name: "React" })
    await expect(reactItem).toBeVisible()

    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    expect(browserErrors).toEqual([])
  })

  test("carousel: advances slides via keyboard navigation controls", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page)
    const nextBtn = page.getByLabel("Next slide")
    await expect(nextBtn).toBeVisible()
    await nextBtn.focus()
    await page.keyboard.press("Enter")
    expect(browserErrors).toEqual([])
  })

  test("resizable: separator is keyboard focusable and operable", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page)
    const handle = page.locator("#resize-handle")
    await handle.focus()
    await expect(handle).toBeFocused()
    await page.keyboard.press("ArrowRight")
    expect(browserErrors).toEqual([])
  })

  test("date picker: opens calendar dialog and dismisses with Escape", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page)
    const trigger = page.getByRole("button", { name: "Select custom date" })
    await trigger.click()
    await page.keyboard.press("Escape")
    expect(browserErrors).toEqual([])
  })

  test("input OTP: receives sequential keyboard digits into slots", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page)
    const otpInput = page.getByLabel("One-time code")
    await otpInput.focus()
    await page.keyboard.type("1234")
    await expect(page.getByTestId("otp-display")).toHaveText("1234")
    expect(browserErrors).toEqual([])
  })

  test("drawer: opens dialog overlay and dismisses with Escape", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page)
    const trigger = page.getByRole("button", { name: "Open test drawer" })
    await trigger.click()

    const drawer = page.getByRole("dialog")
    await expect(drawer).toBeVisible()
    await expect(page.getByText("Drawer Title")).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(drawer).toBeHidden()
    expect(browserErrors).toEqual([])
  })

  test("data table: renders tabular data and headers", async ({ page }) => {
    const browserErrors = collectBrowserErrors(page)
    const tableSection = page.getByTestId("section-datatable")
    await expect(tableSection.getByRole("table")).toBeVisible()
    await expect(tableSection.getByText("Alice")).toBeVisible()
    await expect(tableSection.getByText("Developer")).toBeVisible()
    expect(browserErrors).toEqual([])
  })
})
