import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/design",
  fullyParallel: true,
  // Firefox fails intermittently with `browserContext.close: ENOENT` on trace
  // artifacts when workers write into the same output directory concurrently.
  // The suite is small, so serialise it rather than let artefact cleanup race.
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60000,
  reporter: "line",
  use: {
    baseURL: process.env.STORYBOOK_URL ?? "http://localhost:6006",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: process.env.STORYBOOK_URL
    ? undefined
    : {
        // CI has already built Storybook. Serve that exact artifact to avoid
        // measuring Vite's first-load compilation instead of component states.
        command: process.env.CI
          ? "npx vite preview --outDir storybook-static --host localhost --port 6006 --strictPort"
          : "npm run storybook -- --host localhost --ci",
        url: "http://localhost:6006",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
})
