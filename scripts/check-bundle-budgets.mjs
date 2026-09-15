import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import path from "node:path"

import { bundleSizeMetrics, measureBundleSize } from "./lib/bundle-size.mjs"

const root = path.resolve(import.meta.dirname, "..")
const budgets = {
  "dist/index.js": { raw: 12_000, gzip: 3_500, brotli: 3_000 },
  "dist/components/ui/button.js": { raw: 5_500, gzip: 1_900, brotli: 1_700 },
  "dist/components/ui/dialog.js": { raw: 15_000, gzip: 4_200, brotli: 3_800 },
  "dist/components/ui/sheet.js": { raw: 15_000, gzip: 4_200, brotli: 3_800 },
  "dist/components/ui/tooltip.js": { raw: 7_500, gzip: 2_200, brotli: 1_900 },
  "dist/components/ui/sidebar.js": { raw: 48_000, gzip: 10_500, brotli: 9_200 },
  "dist/components/ui/calendar.js": { raw: 10_750, gzip: 2_800, brotli: 2_500 },
  "dist/components/ui/chart.js": { raw: 12_000, gzip: 3_000, brotli: 2_600 },
  "dist/components/ui/data-table.js": {
    raw: 10_000,
    gzip: 2_500,
    brotli: 2_200,
  },
  // Official shadcn carousel baseline, measured from the current source.
  "dist/components/ui/carousel.js": { raw: 8_500, gzip: 2_400, brotli: 2_100 },
  "dist/styles.css": { raw: 185_000, gzip: 30_000, brotli: 25_000 },
}

const results = []
for (const [relativePath, limits] of Object.entries(budgets)) {
  const content = await readFile(path.join(root, relativePath))
  const sizes = measureBundleSize(content)
  results.push({ relativePath, sizes, limits })

  for (const metric of bundleSizeMetrics) {
    assert.ok(
      sizes[metric] <= limits[metric],
      `${relativePath} ${metric} is ${sizes[metric]} bytes and exceeds its ${limits[metric]} byte budget`
    )
  }
}

for (const { relativePath, sizes, limits } of results) {
  const metrics = bundleSizeMetrics.map((metric) => {
    const percentage = Math.round((sizes[metric] / limits[metric]) * 100)
    return `${metric}=${sizes[metric]}/${limits[metric]} (${percentage}%)`
  })
  console.log(`${relativePath}: ${metrics.join(", ")}`)
}
