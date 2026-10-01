import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/design",
  fullyParallel: true,
  // Firefox fails intermittently with `browserContext.close: ENOENT` on trace
  // artifacts when workers write into the same output directory concurrently.
  // The suite is small, so serialise it rather than let artefact cleanup race.
  workers: 1,
  timeout: 60000,
  use: { baseURL: "http://localhost:6006", trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run storybook -- --host localhost --ci",
    url: "http://localhost:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
