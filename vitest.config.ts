import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const src = fileURLToPath(new URL("./src", import.meta.url))

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/index.ts",
        "src/components/ui/direction.tsx",
        "src/components/ui/toast.tsx",
        "src/hooks/use-direction.ts",
        "**/*.d.ts",
      ],
      thresholds: {
        statements: 100,
        functions: 100,
        lines: 100,
        branches: 95,
      },
    },
  },
  resolve: {
    alias: {
      "@": src,
    },
  },
})
